---
title: "Docker 로 Nginx 에 SSL 인증서 세팅하기"
description: "Docker + docker-compose + Nginx + github actions 를 활용하여 certbot 에서 SSL 인증서 발급받고 적용하기"
date: "2026-05-19"
keywords: "Docker, HTTP"
---

## certbot SSL 발급

**배포용 디렉토리**에서 아래 Shell-Script 실행

```shell
#!/bin/bash
# Nginx 컨테이너가 80포트를 점유하고 있다면 임시 중지
docker compose stop nginx || true

# Certbot 컨테이너를 일회성(--rm)으로 실행하여 인증서 발급
docker run -it --rm --name certbot \
  -p 80:80 \
  -v "$(pwd)/.nginx/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/.nginx/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --standalone \
  -d ${DOMAIN} \
  --email ${EMAIL} \
  --agree-tos \
  --no-eff-email

echo "인증서 초기 발급 완료! Nginx를 다시 시작합니다."
```

> 80, 443 번 포트가 열려있는지 확인

## docker-compose

1. 발급받은 SSL 인증서와 Nginx 컨테이너를 마운트
2. certbot 컨테이너는 12시간마다 갱신 및 Nginx 컨테이너 리로드

```yml
services:
  # Your Services

  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./.nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./.nginx/conf.d:/etc/nginx/templates:ro # templates 폴더로 변경
      # Certbot이 발급한 인증서 경로를 Nginx 컨테이너에 마운트
      - ./.nginx/certbot/conf:/etc/letsencrypt:ro
      - ./.nginx/certbot/www:/var/www/certbot:ro
    depends_on:
      - backend
    restart: unless-stopped
    environment:
      - TZ=Asia/Seoul
      - DOMAIN=${DOMAIN}

  # 인증서 자동 갱신을 위한 Certbot 서비스
  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./.nginx/certbot/conf:/etc/letsencrypt
      - ./.nginx/certbot/www:/var/www/certbot
      # 호스트의 도커 소켓을 마운트하여 certbot 컨테이너가 Nginx 컨테이너를 제어할 수 있게 함
      - /var/run/docker.sock:/var/run/docker.sock
    # certbot에 docker CLI를 설치하고, 갱신 성공 시 Nginx를 리로드하는 로직 추가
    entrypoint: >
      /bin/sh -c '
      apk add --no-cache docker-cli;
      trap exit TERM;
      while :; do
        certbot renew --webroot -w /var/www/certbot --deploy-hook "docker exec nginx-proxy nginx -s reload";
        sleep 12h & wait $${!};
      done;
      '
```

## Github Actions

```yml
name: Project Name

on:
  push:
    branches:
      - main

env:
  REGISTRY: ghcr.io

jobs:
  # 1단계: 이미지 빌드 및 푸시
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set Image Name
        run: echo "IMAGE_NAME=${GITHUB_REPOSITORY,,}" >> $GITHUB_ENV

      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.CR_PAT }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY  }}/${{ env.IMAGE_NAME }}
          tags: |
            type=raw,value=sha-${{ github.sha }}
            type=ref,event=branch
            latest

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  # 2단계: OCI 서버에 배포
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set Image Name
        run: echo "IMAGE_NAME=${GITHUB_REPOSITORY,,}-backend" >> $GITHUB_ENV

      - name: Copy docker-compose and nginx configs
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.OCI_HOST }}
          username: ${{ secrets.OCI_USERNAME }}
          key: ${{ secrets.OCI_SSH_KEY }}
          source: "docker-compose.yml,.nginx"
          target: "~/trading-app"

      - name: Execute remote ssh commands to deploy
        uses: appleboy/ssh-action@v1.0.3
        env:
          IMAGE_TAG: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:sha-${{ github.sha }}
          DOMAIN: ${{ secrets.DOMAIN }}
        with:
          host: ${{ secrets.OCI_HOST }}
          username: ${{ secrets.OCI_USERNAME }}
          key: ${{ secrets.OCI_SSH_KEY }}
          envs: IMAGE_TAG,DOMAIN
          script: |
            cd ~/trading-app
            # GHCR 로그인 (sudo 사용)
            echo "${{ secrets.CR_PAT }}" | sudo docker login ghcr.io -u ${{ github.actor }} --password-stdin

            # 환경 변수 설정 및 배포 (sudo -E 사용)
            export IMAGE_TAG=$IMAGE_TAG
            export DOMAIN=$DOMAIN
            sudo -E docker compose pull
            sudo -E docker compose up -d

            # 미사용 이미지 정리
            sudo docker image prune -f
```