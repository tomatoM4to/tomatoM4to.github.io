---
title: "Docker 이미지 기본 개념"
description: "Docker Image의 개념과 레이어 구조, 그리고 Docker Hub와 Tag를 활용한 이미지 관리 방법을 알아봅니다."
date: "2025-05-28"
keywords: "Docker"
---

# Image
Docker에서 Image는 **Container를 실행하기 위한 일종의 템플릿** 입니다. 모든 Container는 Image를 기반으로 생성되며, 이 Image에는 애플리케이션을 실행하는 데 필요한 파일 시스템과 설정 정보가 포함되어 있습니다.

Image는 계층(Layer) 구조로 구성되어 있으며, 각 레이어는 읽기 전용(Read-only)으로 저장됩니다. 이러한 구조는 동일한 레이어를 여러 Image 간에 공유할 수 있게 하여, 저장 공간을 절약하고 효율적인 관리가 가능하게 합니다.

일반적으로 Image는 Docker Hub와 같은 Image 저장소에서 제공되며, 사용자는 원하는 Image를 pull 명령어를 통해 로컬로 가져와 사용할 수 있습니다.

## 로컬 Image 확인
로컬 환경에 어떤 Image들이 존재하는지 확인하려면 다음 명령어를 사용합니다.
```bash
docker image ls
```

## Image 커스터마이징
보통 커스텀 Image를 만들 때는, 기존 Image 위에 새로운 명령어나 파일을 추가하여 새로운 Image를 생성합니다.

이 작업은 Dockerfile을 사용하여 정의하며, 전체 과정을 빌드(build) 라고 부릅니다.

예를 들어 아래와 같은 Dockerfile이 있다고 가정해 봅시다.

```dockerfile
FROM ubuntu:22.04
RUN apt update && apt install -y curl
CMD ["/bin/bash"]
```
이 Dockerfile은 다음 단계를 거쳐 새로운 Image를 생성합니다.

1. `ubuntu:22.04` Image를 기반으로 시작
2. `apt update` 와 `apt install -y curl` 명령어를 실행하여 curl 을 설치
3. Container가 시작될 때 `/bin/bash` 를 실행하도록 설정

다음 장에서는 이 Dockerfile을 이용해 실제로 Image를 빌드하는 방법을 실습해 보겠습니다.

## Docker Hub
Docker Hub는 Docker에서 제공하는 공식 Image 저장소로, GitHub처럼 누구나 Image를 검색하고 공유할 수 있는 플랫폼입니다.

운영체제, 데이터베이스, 웹 서버, 프로그래밍 언어 런타임 등 수많은 공식 및 커뮤니티 Image들이 업로드되어 있으며, 우리가 앞서 사용한 nginx Image도 Docker Hub에 등록된 공식 Image(official image) 중 하나입니다.

Docker Hub에서 nginx를 검색해보면 다음과 같은 정보를 확인할 수 있습니다.

TODO: nginx Image overview 사진

## Tags
Docker Image에는 각 버전을 구분하기 위한 태그(tag) 가 붙습니다. 예를 들어 `nginx:1.28`, `nginx:mainline`, `nginx:latest` 와 같이 사용됩니다.

태그를 명시하지 않고 Image를 pull 하면, **기본적으로 latest 태그가 적용**됩니다. 이전에 `docker container run -d --name nginx -p 8080:80 nginx` 명령어를 실행했을 때 사실 `nginx:latest` Image를 사용한 것입니다.

`latest` 역시 태그이기 때문에 Docker Hub 에서 `latest` 태그를 검색하면 다음과 같은 정보가 나옵니다.

TODO: nginx latest tag 사진

## OS/ARCH
`OS/ARCH` 는 Image의 기반이 되는 OS 정보를 나타냅니다.

앞서 **Container는 마치 OS처럼 보이지만 실제 OS는 아니며, Host OS의 커널을 공유한다** 라는 내용을 설명했었죠?

따라서 **Image 가 설계된 플랫폼과 실제 실행 환경이 다르면 호환성 문제가 발생할 수 있**습니다. 그렇기에 보통 사람들이 자주 사용하는 Image의 경우 **여러 아키텍처용 빌드를 함께 제공**합니다.

필요한 경우 `--platform` 옵션을 통해 명시적으로 원하는 아키텍처를 지정할 수 있습니다.

```bash
docker pull --platform=linux/amd64 nginx
```

다만 **일반적인 경우 Docker는 자동으로 호스트 머신의 아키텍처에 맞는 Image를 선택**하므로, 대부분의 상황에서는 명시적으로 지정할 필요는 없습니다.

예를 들어

* 일반적인 Windows 환경: `linux/amd64`
* Apple M 시리즈(M1/M2) Mac: `linux/arm64`

Mac을 사용하는 경우, 일부 Image가 amd64 아키텍처만 지원할 수도 있기 때문에 이때는 명시적으로 `--platform=linux/amd64` 옵션을 추가해야 할 수 있습니다.


## Image 레이어 구조 보기

Docker Hub의 Digest 탭에서는 각 Image가 어떤 레이어로 구성되어 있는지, 그리고 각 레이어에 어떤 명령이 포함되어 있는지를 확인할 수 있습니다.

예를 들어 `nginx` Image의 마지막 레이어에는 다음과 같은 명령어가 포함되어 있는 것을 볼 수 있습니다.

TODO: nginx image digest 사진
