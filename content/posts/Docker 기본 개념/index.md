---
title: "Docker 기본 개념"
description: "Docker의 핵심인 Image와 Container의 개념을 Process와 비교하여 설명하고, Volume과 Dockerfile의 역할까지 다룹니다."
date: "2025-05-26"
keywords: "Docker"
---

# Docker 기본 개념

Docker를 사용할 때 가장 기본이 되는 개념은 Image 와 Container 입니다. 이 두 개념을 이해하기 위해선, Process 에 대한 이해가 필요합니다.


## Process

먼저 **Program** 과 **Process** 의 차이부터 살펴봅시다.

간단하게 설명하면, 우리가 웹 브라우저를 실행하고 싶을 때 `.exe` 실행 파일을 더블클릭합니다. 이 `.exe` 파일은 Program, 즉 정적인 코드와 리소스의 모음입니다. 그리고 이 프로그램이 실행되어 메모리에 올라간 인스턴스가 바로 Process 입니다.

각 Process 는 고유한 PID(Process ID) 를 가지며, OS 는 이 프로세스들의 자원(CPU, 메모리, I/O 등) 사용을 관리하고, 서로 간섭하지 않도록 격리된 실행 환경을 제공합니다.


## Image

Image 란 Container 를 생성하기 위한 템플릿으로, **파일 시스템과 실행 환경 정보를 포함한 Read Only 데이터**입니다. `.jpg` 와 같은게 아닙니다!

하나의 Image 는 여러 개의 Container 를 생성할 수 있으며, 보통 다음과 같은 정보들을 Layer 별로 포함합니다.

1. **베이스 이미지**: Ubuntu, Alpine, CentOS 등 어떤 기반 OS를 사용하는지
2. **설치된 소프트웨어**: 필요한 애플리케이션, 라이브러리 등
3. **환경 변수**: 실행 시 필요한 변수 설정
4. **설정 파일**: 애플리케이션 구성에 필요한 설정 값
5. **기본 명령어(CMD)**: 컨테이너가 시작되면 자동으로 실행할 명령

이 Layer 기반 구조 덕분에 Image 간의 중복을 줄이고, 변경된 부분만 저장하는 방식으로 효율적인 저장과 배포가 가능합니다.

예를 들어, PostgreSQL 의 공식 Image 를 사용하면, 해당 **Image 를 기반으로 여러 개의 독립적인 PostgreSQL Container 를 만들 수 있**습니다.

## Container

TODO: 컨테이너에 대한 이해는 Process 와 Kernel 에 대한 이해가 있다면 쉽게 할 수 있습니다. Kernel 은 OS 의 핵심 부분으로, 하드웨어와 소프트웨어 간의 상호작용을 관리합니다. 그리고 Process 는 Kernel 에 의해 관리되는 실행중인 프로그램의 인스턴스입니다. 합쳐서, Container 는 파일 시스템, Namespace 같은 kernel 의 일부 기능들과 함께 Process 를 격리하여 실행하는 방식 입니다. 그리고 추가적으로 Container 내부의 Process 의 행봉방경이 해당 Container 내부에서만 유효하도록 제한됩니다. 그렇기 때문에 컨테이너는 호스트 머신 과 격리된것 처럼 동작합니다. 지만 실제로 Host OS 의 Hardware 자원을 사용하는것은 같습니다.

**Container 란 Image 로부터 생성된 실행 환경**입니다. 좀 더 기술적으로 표현하자면, 파일 시스템과 리눅스 커널의 기능(Namespace, cgroups 등)을 조합하여 **격리된 실행 공간을 하나의 Process 로 구현한 것**이라 할 수 있습니다.

즉, Container 는 Host OS 의 커널을 공유하지만, 그 내부에서는 자신만의 파일 시스템, 환경 변수, 네트워크, PID 공간을 갖기 때문에, 마치 별도의 OS 처럼 동작합니다.

이러한 격리는 주로 리눅스 커널의 **Namespace 기능**을 통해 이루어지며, Docker는 이 기능들을 추상화하여 **간편하게 사용할 수 있도록 도와주는 플랫폼**이라 할 수 있습니다.

Container 는 Image Layer 위에 **Read/Write 가 가능한 Container Layer 를 추가하여 실행**됩니다. 이 구조 덕분에 다음과 같은 특징이 생깁니다.

* 같은 Image 를 기반으로 만들어진 Container 라도, 각자의 변경 사항은 독립적으로 Container Layer 에 기록되므로 서로 영향을 주지 않음
* 실행 중 변경된 모든 파일은 Container Layer 에 저장됨 (이미지 자체는 변하지 않음)

## Volume

**Container 는 기본적으로 삭제하면 그 안에서 변경된 데이터도 함께 사라지게 됩**니다. 그래서 영구적인 데이터를 저장하기엔 다소 적합한 방법은 아닙니다. 하지만 **이를 해결하기 위해 Docker 는 Volume 라는 기능을 제공**합니다.

Volume은 **호스트 머신의 디렉터리 또는 파일을 컨테이너와 공유하는 방식**으로, Container 를 재시작하거나 재생성해도 데이터는 그대로 유지됩니다.

대표적인 Volume 사용 예시
* 데이터베이스 컨테이너의 데이터 디렉토리를 호스트 디렉토리에 연결하여 데이터 보존
* 로그 파일이나 업로드 파일을 호스트에 저장하도록 설정

## Dockerfile

**Dockerfile은 Image를 만들기 위한 설정 파일**입니다. 기존 Image에 추가적인 소프트웨어를 설치하거나, 설정을 변경하는 등의 작업을 정의합니다.

예를 들어 Python이 설치된 베이스 이미지 위에 Flask를 설치하고, 특정 포트를 열고, Application을 실행하는 내용을 Dockerfile에 정의할 수 있습니다.

Dockerfile과 이미지의 관계는 다음과 같습니다.

* Dockerfile은 이미지를 만들기 위한 스크립트
* 이미지는 Dockerfile을 기반으로 생성된 실행 가능한 결과물

보통 Dockerfile은 GitHub 등에서 코드와 함께 공유되고, 완성된 이미지는 Docker Hub 같은 이미지 레지스트리에 업로드되어 사용됩니다.