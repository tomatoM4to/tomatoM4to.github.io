---
title: "Docker 로 Ubuntu 실행하기"
description: "Ubuntu 22.04 이미지를 기반으로 Python, pip, vim을 설치하는 Dockerfile 작성법과 기본 명령어를 알아봅니다."
date: "2025-06-02"
keywords: "Docker"
---

# Dockerfile

Dockerfile 은 **Docker 이미지 생성을 자동화하기 위한 스크립트 파일**입니다.

보통 처음부터 모든 내용을 작성하기보다는, Docker Hub에서 제공하는 **기존 이미지를 기반으로 필요한 구성 요소만 추가**하는 방식으로 작성합니다.

## 기본 명령어

| 명령어 | 의미 |
| --- | --- |
| FROM | 베이스 이미지 지정 |
| RUN | 명령어 실행 |
| COPY | 파일을 이미지에 복사 |
| CMD | 컨테이너 시작 시 실행할 명령어 |
| ENV | 환경 변수 설정 |

> 이런 명령어들을 전부 외우는건 별로 좋은 방식이 아니라 생각합니다. 그냥 필요할때마다 검색해서 찾아 쓰는게 훨씬 좋다 생각해요.

***

# Dockerfile: Python + Vim 설치

이번 예제에서는 **Ubuntu 22.04** 이미지를 기반으로, `Python3`, `pip`, `vim` 을 설치하는 Dockerfile 을 작성해보겠습니다.

먼저, 적당한 디렉토리를 생성한 후 Dockerfile 이라는 이름의 파일을 만듭니다. **확장자는 필요 없**습니다.

```dockerfile
FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y vim
RUN apt-get clean

CMD ["/bin/bash"]
```

## 구성 설명

이 Dockerfile은 다음과 같은 순서로 동작합니다.

1. `FROM Ubuntu:22.04` - Ubuntu 22.04 이미지를 기반으로 사용
2. `RUN apt-get update` - 패키지 목록을 업데이트
3. `RUN apt-get install -y python3` - Python 3 설치
4. `RUN apt-get install -y python3-pip` - Python 용 패키지 관리자 pip 설치
5. `RUN apt-get install -y vim` - 텍스트 편집기 vim 설치
6. `RUN apt-get clean` - 설치 후 불필요한 캐시 정리
7. `CMD ["/bin/bash"]` - 컨테이너 실행 시 기본으로 bash 쉘을 실행

## 이미지 빌드

이제 Dockerfile이 있는 디렉토리에서 아래 명령어를 실행해 이미지를 생성합니다.

```bash
docker build --tag my-ubuntu: .
```

> `--tag` 또는 `-t` 옵션을 사용하면 이미지에 이름을 붙일 수 있습니다, 이 옵션을 사용하지 않으면, 나중에 이미지 ID 로만 접근해야 해서 꽤 불편합니다. `-t` 옵션은 필수라 생각해요.

결과적으로 `my-ubuntu:latest` 라는 이미지가 생성됩니다.

```bash
docker build --tag my-ubuntu:dev .
```

Image 가 제대로 생성되었는지 확인해 봅시다.

```bash
docker image ls
```

```perl:출력-예시
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
my-ubuntu    latest    425841af221b   4 minutes ago   799MB
ubuntu       22.04     67cadaff1dca   4 weeks ago     117MB
nginx        latest    fb39280b7b9e   6 weeks ago     279MB
```

## 컨테이너 실행


이제 `my-ubuntu:latest` Image 를 사용하여 컨테이너를 실행할 수 있습니다.

```bash
docker container run -it --name my-ubuntu-container my-ubuntu
```

이후 Container 에 진입한 뒤, 간단한 Python 스크립트를 작성하고나, Python 버전을 확인할 수 있습니다.

전 간단히 `print("Hello, Dockerfile!!!")` 이라는 코드를 작성해서 잘 실행되는지 확인해봤습니다.

정상적으로 실행된다면 컨테이너가 제대로 구성된 것입니다.

```bash
root@044a0ac689e9:/# vim test.py
root@044a0ac689e9:/# ls
bin  boot  dev  etc  home  lib  lib32  lib64  libx32  media  mnt  opt  proc  root  run  sbin  srv  sys  test.py  tmp  usr  var
root@044a0ac689e9:/# python3 test.py
Hello, Dockerfile!!!
root@044a0ac689e9:/# python3 --version
Python 3.10.12
```