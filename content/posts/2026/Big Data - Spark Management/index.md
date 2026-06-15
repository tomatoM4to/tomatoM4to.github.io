---
title: "Big Data - Spark Management"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, Spark 를 실행시키는 여러 가지 방법과 각 방법들이 자원을 어떻게 관리하는지 소개"
date: "2026-06-13"
keywords: "Big Data, Spark, KNU"
---

## Spark Resource Managers
> Resource: Core & RAM

Spark는 자체적인 클러스터 리소스 관리 시스템을 내장하기보다, **외부의 범용 리소스 매니저 플러그인에 자원 할당을 의존**하는 방식을 취함. Storage File System(HDFS 등) 역시 Spark의 영역이 아님.

이렇듯 다양한 Mode 로 Spark 를 실행 가능함
1. **Local**: Static Partitioning
2. **Standalone**: Static Partitioning
3. **YARN**: Dynamic Partitioning
4. **Mesos**: Dynamic Partitioning

> * Static Partitioning 은 한 App 을 한번 할당 받으면 변함이 없음을 의미
> * Dynamic Partitioning 은 한 App 을 실행할 때도 리소스에 변화를 줌

> Task 를 병렬 수행 단위, 즉 코어의 단위로 보기에 171 페이지는 12코어를 다루게 됨

* **Driver**: 사용자가 작성한 코드(Transformation 및 Action)를 선언하고, 이를 실행하기 위해 데이터를 분산 처리해달라고 Master에게 요청을 보냄
* **Executor**: 클러스터의 각 Worker Machine(워커 노드) 내부에 JVM 프로세스 형태로 생성되며, 쪼개진 RDD의 파티션들에 대해 할당된 Task를 병렬로 처리

### Executor Structure
1. Worker Node: 물리적/가상 하드웨어
2. Executor: JVM Process, 성능 튜닝에 따라 한 컴퓨터 1대에 3~4대의 Executor 를 띄울 수도 있음
3. Task: JVM 내의 Thread, Thread 이므로 JVM 내의 Heap 메모리를 서로 공유함

### Local Mode
> 단일 머신 환경에서 실행

하나의 JVM 내부에서 Driver 와 Executor 가 공존하며, 내부 스레드(Internal Threads) 를 생성해 병렬 처리함


### Standalone Mode
> Spark 자체에 내장된 간단한 독립 클러스터 매니저를 사용하는 방식.

외부 리소스 매니저가 없을 때 가장 간편하게 멀티 노드 분산 환경을 구축할 수 있기 때문에, 대규모 엔터프라이즈 멀티 테넌트 환경(YARN 선호)이 아닌 Spark 전용 소규모~중규모 실제 운영 클러스터에서도 사용

Static Partitioning 이 기본이며, 제출된 App 들은 기본적으로 FIFO 방식으로 동작함

자원은 `conf/spark-env.sh` 파일 설정을 통해 각 워커 인스턴스 개수, 사용할 코어, 메모리 등을 고정으로 관리
* `SPARK_WORKER_INSTANCE`: 워커 인스턴스 개수
* `SPARK_WORKER_CORES`: 사용할 코어 수
* `SPARK_WORKER_MEMORY`: 메모리

### YARN
> Hadoop v2의 리소스 관리 아키텍처인 YARN 위에서 Spark를 구동하는 방식, Enterprise...

핵심 구성 요소 3가지
1. **ResourceManager**: Cluster 전체의 자원을 총괄하고 분배하는 Master
2. **NodeManager**: 각 Machine 마다 존재하는 Agent로 자원 모니터링 및 Container 의 생명 주기 관리
3. **ApplicationMaster**: 제출된 App 하나당 하나씩 생성되는 관리자, RM 과 자원을 협상하고, NM 에게 컨테이너 구동을 요청

**YARN 의 2가지 배포 모드**
* **Client Mode**: Driver 가 Cluster 외부(명령어를 입력한 사용자 PC 등)에서 실행, Spark Shell 지원
* **Cluster Mode**: Driver 가 Cluster 내부(AM 컨테이너 안)로 들어가서 실행, 터미널을 꺼도 작업이 유지됨, Spark Shell 미지원


**YARN 의 Dynamic Allocation**

> 작업량(워크로드)에 따라 Executor의 수를 유동적으로 조절하는 기능

* Scale Up: 대기 중인 작업(Pending tasks)이 쌓이면 Executor를 추가로 요청함, (시간이 지날수록 요청량을 기하급수적으로 늘림)
* Scale Down: 설정된 시간(executorIdleTimeout, 예: 5초) 동안 Executor 가 아무 일도 안 하고 놀고 있으면(idle) 즉시 System 에서 제거함

## Mesos
YARN을 대체할 수 있는 또 다른 선택지 정도로 수업에선 매우 짧게 등장함

> 애플리케이션 실행 중 자원을 유동적으로 조절하는 Dynamic Partitioning(동적 자원 할당)을 지원하는 클러스터 리소스 매니저
