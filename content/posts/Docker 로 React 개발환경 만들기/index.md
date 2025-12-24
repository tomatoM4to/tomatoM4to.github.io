---
title: "Docker 로 React 개발환경 만들기"
description: "Vite와 React를 사용한 프로젝트를 Dockerfile로 작성하고, 정적 파일을 서빙하는 방법을 실습합니다."
date: "2025-06-02"
keywords: "Docker"
---

# Vite + React-ts

단순히 Ubuntu만 써보는 건 좀 재미없으니, 이번엔 **실제 프로젝트처럼 React를 사용**해 보겠습니다.

다음 명령어로 React 프로젝트를 생성합니다.

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

이제 브라우저에서 `http://localhost:5173` 으로 접속하면 Vite의 초기 화면을 확인할 수 있습니다.

단순히 React 프로젝트만 생성할 거고, 실제로 코드를 작성하진 않으니 **React 를 모르더라도 전혀 상관 없**습니다.

> 프론트엔드 생태계는 변화가 빠르기 때문에, 아래 명령어가 작동하지 않을 수도 있습니다. 그럴 경우엔 공식 문서를 참고해서 최신 명령어로 수정해 주세요.
>
> [https://vite.dev/guide/](https://vite.dev/guide/)


TODO: 사진

***

# Dockerfile

이제 위에서 만든 프로젝트를 기반으로 Dockerfile을 작성해보겠습니다.

이번 Dockerfile의 목적은, **Vite로 빌드된 정적 파일을 serve를 이용해 서빙**하는 것입니다.

> serve 는 별다른 설정 없이 정적 파일을 서빙할 수 있는 간단한 Node.js 패키지입니다. Vite로 빌드된 React 앱을 서빙하는 데 적합합니다. 자세한 내용은 공식문서를 참고해 주세요.
>
> [https://www.npmjs.com/package/serve](https://www.npmjs.com/package/serve)


## 새로운 명령어

`COPY`
* Host 의 파일이나 디렉토리를 Container 로 복사합니다.
* 첫번째 인자는 **Host 경로**, 두번째 인자는 **Container 내 경로** 입니다.

`WORKDIR`
* 컨테이너 안에서의 **작업 디렉토리**를 설정합니다.
* 이 명령어를 기준으로, 이후의 모든 명령어들은 해당 디렉토리 기준으로 실행됩니다.
* `mkdir` 후 `cd` 한 것과 같은 효과라고 보면 됩니다.

## Dockerfile 작성

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

각 명령어의 세부적인 설명은 다음과 간습니다.

* **FROM node:18-alpine**: `node:18-alpine` 이미지를 사용, Alpine 버전은 빌더 환경에 적합한 경량화된 Node.js 이미지
* **WORKDIR /app**: `/app` 디렉토리를 작업 디렉토리로 설정
* **COPY package*.json ./**
    * `package\*.json` 파일을 컨테이너의 `/app` 디렉토리로 복사
    * `package.json` 과 `package-lock.json` 파일 모두 복사
* **RUN npm install**: 프로젝트의 모든 의존성을 설치
* **COPY . .**: dockerfile 이 위치한 local 디렉토리의 모든 파일을 컨테이너의 `/app` 디렉토리로 복사
* **RUN npm run build**
    * React 앱을 프로덕션 빌드
    * 빌드된 파일은 `/app/dist` 디렉토리에 생성
* **RUN npm install -g serve**: `serve` 패키지를 전역으로 설치
* EXPOSE 3000
    * Container 의 3000번 포트를 외부에 열겠다는 선언
    * 이건 실제로 네트워크에 영향 주진 않고, 문서용 목적
    * 실제 포트를 연결하려면 `-p 3000:3000` 같이 명시적으로 매핑해야 함.
* **CMD ["serve", "-s", "dist", "-l", "3000"]**
    * `-s`: single-page application 모드
    * `dist`: 이 디렉토리를 서비스함
    * `-l 3000`: 3000번 포트로 서비스

## 빌드 & 실행

이제 이 Dockerfile 을 바탕으로 Image 를 빌드합니다.

```bash
docker build --tag my-app .
```

빌드가 완료되면 `my-app:latest` 라는 이름의 이미지가 생성됩니다. 이 이미지를 이용해 컨테이너를 실행합니다.

이후 `http://localhost:3000` 으로 접속하면 Vite로 빌드된 React 앱이 확인된다면 성공입니다.

```bash
docker container run -d -p 3000:3000 my-app
```

지금 한 방식은 **빌드 + 실행 이 모두 하나의 이미지 안에서 일어나는 단순한 구성**입니다. 작동은 잘 되지만, 실제 운영환경에 적용하기엔 비효율적인 부분도 존재합니다.

다음 장에서는 이 Dockerfile 을 최적화 하고, **빌드 이미지와 실행 이미지를 분리하는 방법**을 소개하겠습니다.