---
title: "Software Engineering - DevOps"
description: "202601 소프트웨어 공학 기말고사 대비 DevOps 정리"
date: "2026-06-17"
keywords: "KNU, DevOps"
---

## DevOps
새로운 기능과 기술에 대한 요구사항을 빠르게 따라가면서, 시스템의 안정성고 고성능을 유지하기 위해 등장한 Software Engineering 접근 방식

## CALMS Model
> DevOps 방법론 도입에 대한 조직의 준비 상태와 성숙도를 평가하는 데 사용되는 기본 프레임워크

* **Culture**: 협업과 오너십을 중시하며, 작게 시작하여 확장하는 문화를 만듬
* **Automation**: 자동화를 통해 빠른 피드백을 얻음
* **Lean IT**: 시스템적 사고를 바탕으로 불필요한 낭비를 줄이고 가치있는 일에 집중
* **Measurement**: 올바른 지표를 측정하고 경험적인 통계를 기반으로 의사결정을 내림
* **Sharing**: 공통의 목적을 위해 목표를 공유하고, 학습을 장려하기 위해 경험을 나눔

## CI/CD 파이프라인

![CI/CD Pipeline](https://www.redhat.com/rhdc/managed-files/styles/default_1600/private/ci-cd-flow-desktop.png.webp?itok=4O45tdWd)

[Resource](https://www.redhat.com/ko/topics/devops/what-is-ci-cd)

* **CI**: 개발자가 코드를 Commit 하면, 자동으로 Build 하고 Unit Tests 와 Integration Tests 를 수행하여, 코드를 지속적으로 통합하는 과정
* **CD**: Test, 스테이징을 거쳐 프로덕션 환경까지 모든 과정이 완전 Automatic 으로 배포됨

> CD 는 최종 프로덕션 배포까지 모든 과정이 완전 자동으로 이루어지는 Continuous Deployment 도 있지만, 최종 배포는 수동으로 승인하고 진행하게 만드는 Continuous Delivery 도 존재함

## Dev env
* **Dev Environment**: 코드 개발 및 테스트 코드를 생성하는 환경 (VSCode)
* **Test Environment**: 유닛, 통합, API, E2E, 성능, 보안 테스트 등을 수행하여 코드를 검증합 (Gh Action)
* **Staging Environment**: 실제 운영 환경과 유사한 조건에서 검증(Production-like validation)을 진행 (Gh Action)
* **Production Environment**: 실제 사용자가 접근하는 운영 환경으로, 카나리(Canary), 블루/그린(Blue/green), 롤링(Rolling) 배포 등의 전략이 사용 (실제 운영중인 서버)



## GH Actions
> GitHub 저장소 내에서 소프트웨어 워크플로우를 자동화할 수 있는 CI/CD 플랫폼

* **동작 원리**: 특정 이벤트(예: push, pull_request)가 발생하면 트리거되어 정의된 작업을 수행
* **구조**: 워크플로우는 여러 개의 Job으로 구성되며, 각 Job은 지정된 Runner(서버)에서 실행. Job 안에는 여러 Step이 있고, Step은 개별 Action이나 스크립트를 실행
* **설정 방식**: .github/workflows/ 디렉토리에 YAML(yml) 형식의 파일로 파이프라인을 정의
* **CI 건너뛰기**: 커밋 메시지에 `[skip ci]`, `[no ci]` 등의 키워드를 포함하면 해당 커밋에서는 워크플로우 실행을 건너뛸 수 있습

## VM vs Container
![VM vs Container](/img/Docker/vm-vs-docker.webp)

* **VM**: Hypervisor 위에 각각 Guest OS 를 띄워 앱을 실행
* **Container**: Guest OS 없이 Host OS 의 커널을 공유하면서 격리된 환경을 제공, 이로 인해 배포 속도가 훨씬 빠르고, 오버헤드가 적으며, 마이그레이션과 재시작이 용이

## Docker
> Container를 쉽게 만들고 관리할 수 있도록 도와주는 도구

* **Dockerfile**: Docker Image 를 만들기 위한 명령어가 적힌 Text File
* **Image**: Dockerfile 을 통해 빌드된 **정적**이고 **불변**하는 컨테이너 **템플릿**
* Registry/Hub: 빌드된 이미지를 저장하고 공유하는 공간 (Docker Hub 이 대표적)
* Container: 이미지를 기반으로 System 위에서 실제로 실행중인 App Process

> Container 는 Linux 의 내장 기능인 Namespace 와 cgroups 를 조합해 만든 격리된 Process 란 점을 유의


## Docker Compose
> 여러개의 Docker Container 로 구성된 App 을 정의하고 실행하기 위한 도구

**Compose 의 구성 요소**
* **Services**: Dockerfile 이나 기존 이미지를 바탕으로 생성될 각각의 컨테이너를 정의
* **Networking**: Container 들이 서로 통신할 수 있도록 내부 Docker Network(bridge, host 등) 를 구성
* **Volumes**: DB 의 데이터나 소스코드처럼 Container 가 삭제되어도 보존되어야 하는 영구 데이터를 저장하고 마운트

**도입 효과**
* **단일 명령어 제어**: 개별 Container 를 하나씩 수동으로 빌드하고 네트워크를 연결할 필요 없이, 단일 명령어(`docker compose up`) 로 전체 앱을 배포하고 시작 가능
* **의존성 관리**: `depends_on` 같은 설정을 통해 Container 간의 실행 순서와 의존성을 자동으로 알아서 처리함

## Check Exam

1. 개발팀과 운영팀의 장벽을 허물기 위한 DevOps 환경에서, CI(Continuous Integration)와 CD(Continuous Delivery/Deployment)가 파이프라인 내에서 수행하는 핵심 역할로 가장 올바르게 짝지어진 것은?

	- A. CI: 인프라 프로비저닝 자동화 / CD: 소스 코드의 버전 관리
	- B. CI: 코드 변경 사항 병합, 빌드 및 자동화 테스트 / CD: 테스트 완료된 코드를 스테이징 및 프로덕션 환경으로 릴리스 자동화
	- C. CI: 프로덕션 환경의 실시간 모니터링 / CD: 사용자 데이터베이스 백업
	- D. CI: 정적인 컨테이너 이미지 생성 / CD: 코드 보안 취약점 정적 분석
  > 2
2. 서버 운영 효율성을 위해 기존의 가상 머신(VM) 대신 도커(Docker)와 같은 컨테이너 기술을 도입하고자 한다. 가상 머신과 비교하여 컨테이너가 가지는 구조적 특징과 장점으로 가장 적절한 것은?

	- A. 컨테이너는 각각 독립적인 하이퍼바이저(Hypervisor)를 사용하여 운영체제 종속성을 완전히 제거한다.
	- B. 컨테이너는 각 앱마다 무거운 Guest OS를 포함하여 높은 수준의 보안 격리를 제공한다.
	- C. 컨테이너는 별도의 Guest OS 없이 호스트(Host) OS의 커널을 공유하며 프로세스 수준에서 격리되므로, 가볍고 시작 속도가 매우 빠르다.
	- D. 가상 머신은 리눅스 커널의 네임스페이스(Namespace)와 cgroups만을 활용하여 시스템 자원을 분할하므로 오버헤드가 적다.
  > 3
3. 다음은 Docker 환경에서 애플리케이션을 배포하는 과정의 핵심 요소들을 나열한 것이다. 이들의 관계와 작동 흐름(Pipeline)을 논리적으로 올바르게 설명한 것은?

	- A. 컨테이너(Container)를 먼저 실행한 뒤, 그 상태를 저장하여 도커파일(Dockerfile)을 생성하고 이를 레지스트리(Registry)에 보관한다.
	- B. 레지스트리(Registry)에서 컨테이너(Container)를 직접 빌드하면 불변의 템플릿인 이미지(Image)가 만들어진다.
	- C. 실행 중인 앱 프로세스인 컨테이너(Container)를 레지스트리(Registry)에 푸시(Push)하여 다른 서버와 환경을 공유한다.
	- D. 도커파일(Dockerfile)의 명령어를 바탕으로 정적인 템플릿인 이미지(Image)를 빌드하고, 이 이미지를 실행하여 실제 동작하는 컨테이너(Container)를 만든다.
> 4
4. 단일 서버에 웹 서버, 백엔드 애플리케이션, 데이터베이스 등 여러 개의 컨테이너를 띄워야 하는 복잡한 시스템을 구축할 때, 순수 Docker 명령어 대신 Docker Compose를 도입하는 본질적인 이유(이점)로 가장 거리가 먼 것은?

	- A. `compose.yml` 파일 하나에 여러 컨테이너의 네트워크, 볼륨, 환경 변수 등 전체 시스템 구성을 코드로 정의(IaC)할 수 있다.
	- B. 복잡한 의존성을 가진 여러 컨테이너를 수동으로 하나씩 실행할 필요 없이 단일 명령어(`docker compose up`)로 일괄 실행 및 종료할 수 있다.
	- C. `depends_on` 설정을 통해 애플리케이션 컨테이너가 실행되기 전에 데이터베이스 컨테이너가 먼저 실행되도록 순서를 보장할 수 있다.
	- D. 코드를 원격 저장소에 Push하면, Compose가 이를 감지하여 자동으로 유닛 테스트(Unit Test)를 수행하고 GitHub에 결과를 보고한다.
  > 4
5. 코드의 안정성을 확보하기 위해 CI/CD 파이프라인은 여러 단계의 배포 환경(Deployment Environment)을 거친다. 다음 중, 실제 운영 환경(Production)으로 배포하기 직전에, 실제 운영 환경과 가장 유사한 조건(Production-like validation)에서 시스템 통합 및 성능을 최종 검증하는 환경은 무엇인가?

	1. Dev Environment
	2. Test Environment
	3. Staging Environment
	4. Local Environment
  > 3