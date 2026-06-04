---
title: "Docker 로 Nginx 에 SSL 인증서 세팅하기"
description: "Docker + docker-compose + Nginx + github actions 를 활용하여 certbot 에서 SSL 인증서 발급받고 적용하기"
date: "2026-05-19"
keywords: "Docker, HTTP"
---

## Step 1: Certbot Script

**배포용 디렉토리**에서 아래 Shell-Script 작성, or Clone

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

실행 전, 환경변수 세팅을 하거나, 명령어에 직접 주입하는 방식을 사용함

DOMAIN 이 없다면 `ip-address.nip.io` 사용해도 무방, Email 은 인증서가 발급받을시, 오류가 생길시 받을 이메일

```bash
chmod +x init-cert.sh
export DOMAIN="example.com"
export EMAIL="admin@example.com"
./init-cert.sh
```

실행이 완료되면 `ls -a` 명령어를 통해 `.nginx/certbot` 디렉토리가 만들어 졌는지 체크, 해당 디렉토리를 copy 하면 다른 디렉토리로 인증서를 옮기는것도 가능

> **주의**
>
> 80, 443 번 포트가 열려있는지 확인

> Let's Encrypt는 짧은 시간에 잦은 발급 요청이나 실패가 반복되면 해당 도메인에 대해 일정 기간(1시간 ~ 1주일) API 호출을 **차단(Rate Limit)** 해 버린다. 가능하면 원트컷 하는게 좋음

## Step 2: Nginx Template File
보통 git 으로 관리하기 때문에 clone 하면 해결 되겠지만, 따로 Step 으로 설명

`.nginx/conf.d/default.conf.template` File 을 생성 후 아래 Code 를 Copy

```nginx
upstream backend {
    server backend:8000;
}

server {
    listen 80;
    server_name ${DOMAIN};

    # Certbot webroot 인증을 위한 경로
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # HTTP to HTTPS redirect
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ${DOMAIN};

    # SSL 설정 (Certbot이 발급한 경로로 수정)
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    # SSL 최적화
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API docs (optional)
    location /docs {
        proxy_pass http://backend/docs;
        proxy_set_header Host $host;
    }

    location /redoc {
        proxy_pass http://backend/redoc;
        proxy_set_header Host $host;
    }
}
```

> `${DOMAIN}` 은 Nginx의 공식 Docker 이미지에서 지원하는 템플릿 기능, Nginx 컨테이너가 켜질 때 이 `.template` 파일을 읽어서 `${DOMAIN}` 부분을 `docker-compose.yml`에서 넘겨준 실제 도메인 환경변수로 자동 치환한 뒤, 진짜 `default.conf` 파일을 컨테이너 내부에 스스로 만들어낸다. 즉, 도메인이 바뀌어도 Nginx 설정 파일은 단 한 글자도 하드코딩해서 수정할 필요가 없다.

## Step 3: docker-compose

해당 compose 가 하는일
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

```bash
docker compose up -d
```

> `.nginx` 와 같은 위치에 docker-compose 파일이 있어야 함

## Step 4: Github Actions
여기서부턴 필수 작업은 아니긴 하지만, 본좌 같은 경우는 Github Actions 를 사용하여 심플한 CI/CD 환경을 구축함, 이후부턴 main 브랜치에 변화가 생길시 트리거가 됨

우선 Github 의 `Project-Repo/Settings/Secrets and variables/Actions` 탭에서 Repository secrets 세팅

**환경 변수 목록**
1. `CR_PAT`: GitHub Personal Access Token (클래식 방식 권장), `write:packages` 및 `read:packages` 권한이 반드시 포함되어 있어야 함
2. `DOMAIN`: 서비스할 도메인 주소, `example.com` or `12.34.56.78.nip.io`
3. `OCI_HOST`: SSH 및 SCP 로 접근할 서버의 IP 주소
4. `OCI_SSH_KEY`: OCI 서버 접속용 SSH 개인 키 (Private Key)
5. `OCI_USERNAME`: OCI 서버의 SSH 접속 계정명, 우분투면 `ubuntu`, Oracle Linux 면 `opc` 사용

**전체 흐름**
1. docker image build
2. Github Container Registry (GHCR) 에 Push
3. 배포할 서버로 `docker-compose.yml` 과 `.nginx` 설정 디렉토리를 전송
4. 서버에 SSH 로 원격 접속하여, 방금 빌드한 최신 이미지를 Pull 받고 `docker-compose up -d` 로 서버를 재시작
5. 미사용 이미지 `prune`

> 해당 스크립트는 `~/trading-app` 을 **배포용 디렉토리** 로 간주하고 있으므로, 프로젝트에 맞게 해당 부분만 수정

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