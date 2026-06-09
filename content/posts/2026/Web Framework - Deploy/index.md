---
title: "Web Framework - Deploy"
description: "202601 웹프레임워크, Render 로 배포하기"
date: "2026-06-10"
keywords: "Express, JavaScript, KNU"
---

> Render 는 Vercel, Railway 와 같은 PaaS 기업

## Deployment
필요사항
1. Github
2. MongoDB Atlas
3. Render

순서
1. Local Dev
2. Github Upload
3. MongoDB Atlas setup
4. Render

> Render 와 Github Repository 를 연결해 놓으면 해당 Repository 의 특정 Branch(보통 main) 가 업데이트 될 시, 자동으로 빌드 및 배포를 해준다.

> 기존 사용하던 `.env` 같은 설정 파일은 Render 의 Environment Variables 에 설정 가능

> `0.0.0.0/0`: 모든 ipv4 주소, MongoDB Atlas 에 접속하기 위해 Access List 에 추가