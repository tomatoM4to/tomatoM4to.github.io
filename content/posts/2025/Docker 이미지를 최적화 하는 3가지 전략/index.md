---
title: "Docker 이미지를 최적화 하는 3가지 전략"
description: "Docker Image의 크기를 줄이고 빌드 속도를 높이기 위한 Layer 최적화 전략과 원리를 알아봅니다."
date: "2025-06-02"
keywords: "Docker"
---

# 최적화의 필요성

사실 Dockerfile 의 최적화 라기보다는, Image 자체를 최적화하는 것이 더 정확한 표현일 것 같습니다.

Docker Desktop을 열어, 지금까지 우리가 만들어온 Image들의 크기를 확인해보세요.

TODO: 사진

처음 보면 나쁘지 않은데? 싶을 수도 있지만, Image 는 아래와 같은 상황에서 **반복적으로 업로드/다운로드(pull/push) 되기에**, Image 의 크기는 생산성에 중요한 영향을 미칩니다.

* CI/CD 파이프라인에서 자동 배포할 때
* 클라우드 환경에서 스케일링할 때
* 다른 개발자와 Image를 공유할 때

## 최적화 전력

Image 최적화는 크게 두 가지 전략으로 나뉩니다

* Image Layer 경량화
* 경량화된 베이스 Image 사용

Layer 경량화는 **불필요한 Layer를 제거**하거나, **Layer를 합치는 방식**으로 이루어집니다. 이를 통해 Image의 크기를 줄이고, 빌드 시간을 단축할 수 있습니다.

이번 장에선 Layer 최적화에 초점을 맞추겠습니다.

## Layer 구조 이해

Docker Image란 여러 개의 Layer 로 구성된 **읽기 전용 템플릿** 입니다.

각 Layer는 이전 Layer 위에 쌓이는 방식으로 누적되며, 최종적으로 하나의 완성된 Image가 생성됩니다.

Layer 는 **Dockerfile에서 사용하는 명령어(RUN, COPY, ADD, ...) 에 의해 생성**됩니다. 각 명령어는 Container 내의 파일 시스템에 변화를 일으키며, 이 변화가 새로운 Layer로 기록됩니다.

따라서 Dockerfile 을 어떻게 구성하느냐에 따라 Image의 구조와 용량이 달라질 수 있습니다.

아래는 우리가 앞서 작성한 `my-ubuntu` Dockerfile입니다.

```dockerfile:my-ubuntu
FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y vim
RUN apt-get clean

CMD ["/bin/bash"]
```

이 예시를 보면, 베이스 Image를 제외하고도 **총 6개의 Layer가 생성될 것이라는 걸 쉽게 예상**할 수 있습니다.

## Layer 확인하기

이제 실제로 Image의 Layer 구조가 어떻게 생겼는지 직접 확인해보겠습니다.

`docker history` 명령어를 사용하여 Image의 Layer 구조를 확인할 수 있습니다.

```bash
docker history my-ubuntu
```

```bash:OUTPUT
IMAGE          CREATED       CREATED BY                                       SIZE      COMMENT
425841af221b   4 days ago    CMD ["/bin/bash"]                                0B        buildkit.dockerfile.v0
<missing>      4 days ago    RUN /bin/sh -c apt-get clean # buildkit          4.1kB     buildkit.dockerfile.v0
<missing>      4 days ago    RUN /bin/sh -c apt-get install -y vim # buil…   43.2MB    buildkit.dockerfile.v0
<missing>      4 days ago    RUN /bin/sh -c apt-get install -y python3-pi…   355MB     buildkit.dockerfile.v0
<missing>      4 days ago    RUN /bin/sh -c apt-get install -y python3 # …   33MB      buildkit.dockerfile.v0
<missing>      4 days ago    RUN /bin/sh -c apt-get update # buildkit         63.1MB    buildkit.dockerfile.v0
<missing>      5 weeks ago   /bin/sh -c #(nop)  CMD ["/bin/bash"]             0B
<missing>      5 weeks ago   /bin/sh -c #(nop) ADD file:59e67123ba6a5d9ee…   87.5MB
<missing>      5 weeks ago   /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      5 weeks ago   /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      5 weeks ago   /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH      0B
<missing>      5 weeks ago   /bin/sh -c #(nop)  ARG RELEASE                   0B
```

주의 깊게 봐야 할 건 `SIZE` 항목입니다.

* `0B` Layer: Container 내 파일 시스템에 **변화가 없는** 명령어 → `CMD`, `ENV`, `LABEL`, ...
* `0B` 보다 큰 Layer: Container 내 파일 시스템에 **변경이 일어난** 명령어 → `RUN`, `COPY`, `ADD`, ...

즉, Image 크기를 줄이려면 `0B` **보다 큰 Layer를 중심으로 최적화를 시도**해야 합니다.

***

# my-ubuntu 최적화

```dockerfile:my-ubuntu
FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y vim
RUN apt-get clean

CMD ["/bin/bash"]
```

이 Dockerfile 에서 크기가 큰 Layer 는 `RUN` 명령어를 통해 생성된 Layer들입니다. 그렇기에 `RUN` 명령어를 최적화하는 것이 이 Image의 크기를 줄이는 핵심이 될 것입니다.

방법은 몇가지 있습니다.

1. **명령어 병합**: 여러 개의 `RUN` 명령어를 하나로 합쳐 Layer 수를 줄임
2. **불필요한 파일 제거**: 패키지 설치 후 남는 캐시나 임시 파일을 삭제하여 Layer 크기를 줄임


## 최적화된 Dockerfile

아래는 위의 원본 Dockerfile을 최적화한 버전입니다.

```dockerfile
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y python3 python3-pip vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

CMD ["/bin/bash"]
```
* `&&` 연산자를 사용해 모든 설치 작업을 하나의 `RUN` **명령어로 병합**
* `apt-get clean` 및 `rm -rf /var/lib/apt/lists/*` 를 통해 **캐시 파일을 삭제**

이렇게 `&&` 를 통해 여러 Linux 명령어를 연속해서 실행하는 경우를 많이 보게 될겁니다.

## 결과 확인

해당 Dockerfile을 `my-ubuntu-optimize` 라는 이름으로 빌드한 후, Layer 수를 확인해봅시다

```bash
docker build -t my-ubuntu-optimize .
docker history my-ubuntu-optimize
```

```bash:OUTPUT
IMAGE          CREATED        CREATED BY                                       SIZE      COMMENT
fa3a20a98584   27 hours ago   CMD ["/bin/bash"]                                0B        buildkit.dockerfile.v0
<missing>      27 hours ago   RUN /bin/sh -c apt-get update &&     apt-get…   430MB     buildkit.dockerfile.v0
<missing>      5 weeks ago    /bin/sh -c #(nop)  CMD ["/bin/bash"]             0B
<missing>      5 weeks ago    /bin/sh -c #(nop) ADD file:59e67123ba6a5d9ee…   87.5MB
<missing>      5 weeks ago    /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      5 weeks ago    /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      5 weeks ago    /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH      0B
<missing>      5 weeks ago    /bin/sh -c #(nop)  ARG RELEASE                   0B
```

* `RUN` 명령어가 하나로 합쳐져 Layer 수가 줄어듬
* 결과적으로 Layer 수가 감소했고, Image 크기도 줄어듬

Docker desktop 에서 확인해 보면 용량또한 줄어든 것을 확인할 수 있습니다.

TODO: Image 필요

***

# React 앱 최적화

먼저 어떤 문제가 있는지 아래 Dockerfile을 보고 생각해봅시다.

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 문제점
* 불필요한 파일 포함: 최종적으로 필요한 건 `dist/` 폴더 안의 정적 파일뿐인데, **소스 전체가 이미지에 들어**갑니다.
* 의존성 분리: 빌드에 필요한 의존성과 실행(서빙)에 필요한 의존성이 **한 이미지에 섞여 있**습니다. 이로 인해 이미지가 무거워지고 보안상 바람직하지 않습니다.


## Multi-stage builds
결국 문제는, **빌드 환경과 실행 환경이 섞여 있다는 점**입니다.

이러한 문제를 해결하기 위한 도커의 기능이 바로 **Multi-stage build** 입니다.

이를 Docker에서는 **Multi-stage build** 라는 기능으로 구현할 수 있습니다.

> Multi-stage build는 하나의 Dockerfile에서 **여러 단계를 정의**하고, **마지막 단계에 필요한 파일만 가져오는 방식**입니다.

Multi-stage build 를 사용하면 다음과 같은 장점이 있습니다.

* 빌드 도구 및 개발 의존성이 최종 이미지에 포함되지 않음
* 이미지 용량 감소
* 보안 취약점 노출 가능성 감소

## stage

Docker에서 stage는 **이미지를 만드는 중간 작업 공간**입니다.

`FROM` 명령어를 사용할 때마다 새로운 stage가 시작되며, 이 안에서 각각의 작업이 수행됩니다.

> stage는 작업 단계를 나누는 구역이며, **각 구역은 독립적으로 동작**합니다.

예를 들어 React 앱을 Docker로 빌드할 때는 다음과 같은 두 가지 작업이 필요합니다.
* 소스코드를 바탕으로 앱을 빌드
* 빌드된 정적 파일을 서빙

이 두 작업은 성격이 다르기 때문에, 각각의 작업을 별도의 stage로 나누는 것이 좋습니다.

이렇게 여러 stage 를 나누어 작업을 수행하는것이 **Multi-stage build** 입니다.


```dockerfile:예시-코드
# stage 1: 빌드용 Node 환경
FROM node:18-alpine AS builder
RUN npm run build


# stage 2: serve만 포함된 Node 환경
FROM node:18-alpine AS runner
RUN npm install -g serve
```

`FROM` 이 두번 쓰는걸로 쉽게 구분할 수 있습니다. 각 stage는 독립적으로 작업을 수행하며, **마지막 stage에서만 최종 이미지를 생성**합니다.

또한 `AS` 키워드를 사용하여 **stage 에 이름을 붙일 수 있**습니다.

이를 통해 **이전 단계의 작업 결과 중 필요한 파일만 정확하게 선택해서 복사할 수 있**는 거죠.


## Dockerfile 작성


위 개념을 실제로 적용한 최적화된 Dockerfile은 다음과 같습니다.

아래 예시는 두 개의 stage로 구성되어 있으며, 빌드와 실행(서빙)을 분리했습니다.

```dockerfile
# 1단계: 빌드용 Node 환경
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# 2단계: serve만 포함된 경량 Node 환경
FROM node:18-alpine AS runner

WORKDIR /app

RUN npm install -g serve

# 빌드된 정적 파일만 복사
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### 빌드 단계
이 단계는 개발 도구와 소스코드를 기반으로 React 앱을 빌드하는 역할을 합니다.

1. `FROM node:18-alpine AS builder`: 경량 Alpine 기반 Node.js 환경을 사용하고, 이 단계에 builder라는 이름을 붙임임
2. `WORKDIR /app`: 모든 작업은 /app 디렉토리 안에서 수행
3. `COPY package*.json ./` + `RUN npm install`: dependency 설치
4. `COPY . .` + `RUN npm run build`: 전체 소스를 복사하고, 빌드 명령을 실행, 이 결과는 /app/dist에 저장.

### 실행 단계
이 단계는 빌드 결과만 가져와 실제 사용자에게 정적 파일을 서빙(serve) 하는 데 필요한 최소한의 구성만 포함합니다.

1. `FROM node:18-alpine AS runner`: 같은 base 이미지를 사용
2. `WORKDIR /app`: 작업 디렉토리 설정
3. `RUN npm install -g serve`: serve 패키지를 전역으로 설치
4. `COPY --from=builder /app/dist ./dist`: 앞서 빌드한 결과물(dist)을 복사, 이 부분이 **Multi-stage의 핵심**
5. `EXPOSE 3000`
6. `CMD ["serve", "-s", "dist", "-l", "3000"]`: 앱 실행



## 빌드 & 결과 확인

이제 최적화된 Dockerfile을 사용해 이미지를 빌드하고 실행해 보겠습니다.

```bash
docker build --tag my-app-optimize .
```

빌드 완료된 이미지를 확인해보면, 정적 파일(/app/dist)과 serve 실행 도구만 포함되어 있는 것을 볼 수 있습니다.

```bash:my-app-optimize
IMAGE          CREATED        CREATED BY                                       SIZE      COMMENT
505ac00ee819   28 hours ago   CMD ["serve" "-s" "dist" "-l" "3000"]            0B        buildkit.dockerfile.v0
<missing>      28 hours ago   EXPOSE map[3000/tcp:{}]                          0B        buildkit.dockerfile.v0
<missing>      28 hours ago   COPY /app/dist ./dist # buildkit                 225kB     buildkit.dockerfile.v0
<missing>      28 hours ago   RUN /bin/sh -c npm install -g serve # buildk…   20.2MB    buildkit.dockerfile.v0
<missing>      30 hours ago   WORKDIR /app                                     8.19kB    buildkit.dockerfile.v0
...
```


반면 이전 이미지는 빌드를 위한 도구, 전체 `소스코드`, `node_modules` 등 실행에 불필요한 파일들까지 모두 포함되어 있어 훨씬 무겁습니다.

```bash:my-app
IMAGE          CREATED        CREATED BY                                       SIZE      COMMENT
2af5733252e5   30 hours ago   CMD ["serve" "-s" "dist" "-l" "3000"]            0B        buildkit.dockerfile.v0
<missing>      30 hours ago   EXPOSE map[3000/tcp:{}]                          0B        buildkit.dockerfile.v0
<missing>      30 hours ago   RUN /bin/sh -c npm install -g serve # buildk…   19.6MB    buildkit.dockerfile.v0
<missing>      30 hours ago   RUN /bin/sh -c npm run build # buildkit          258kB     buildkit.dockerfile.v0
<missing>      30 hours ago   COPY . . # buildkit                              103MB     buildkit.dockerfile.v0
<missing>      30 hours ago   RUN /bin/sh -c npm install # buildkit            124MB     buildkit.dockerfile.v0
<missing>      30 hours ago   COPY package*.json ./ # buildkit                 131kB     buildkit.dockerfile.v0
<missing>      30 hours ago   WORKDIR /app                                     8.19kB    buildkit.dockerfile.v0
...
```


저같은 경우는 최적화 전후의 이미지 크기를 비교해보니 다음과 같은 결과가 나왔습니다. 해당 결과는 Docker 버전, 시스템 환경에 따라 다를 수 있습니다.

* ubuntu 799MB → 691MB
* react 490MB → 205MB

이처럼 Multi-stage build를 사용하면 빌드 환경과 실행 환경을 분리하여, 결과 이미지가 훨씬 작아지고 불필요한 파일도 제거됩니다. 보안적으로도 빌드 도구나 개발 코드가 포함되지 않기 때문에 더 안전합니다.