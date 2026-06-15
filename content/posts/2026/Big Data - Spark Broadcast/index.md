---
title: "Big Data - Spark Broadcast"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, Spark Broadcast"
date: "2026-06-15"
keywords: "Big Data, Spark, KNU"
---

## 기존 방식의 한계
Spark에서 일반적인 파이썬 변수를 연산(Transformation)에 사용하면, 마스터 노드(Driver)는 해당 변수의 복사본을 **각 Task마다 일일이 전송**해야 함.

만약 변수 크기가 크고 Task가 수만 개라면, 엄청난 네트워크 병목과 메모리 낭비가 발생, 이를 해결하기 위해 Spark는 두 가지 형태의 **Shared Variables**를 제공

1. **Broadcast Variables**: 모든 Worker Node 에 **딱 한번만 배포**되는 Read-only Cache Data
2. **Accumulators**: Worker Node에서는 Write만 가능하고, Master Node만 읽을 수 있는(Read-only) 글로벌 카운터

## Broadcast Variables
> 모든 Worker Node 에 딱 한번맨 배포되는 Read-only Cache Data
* Task 단위가 아니라 **Worker Node 단위**로 한번만 복사본을 전송하고 캐싱
* Task 들은 Node 에 이미 캐싱된 데이터를 공유해서 읽기만 하므로 통신 비용이 감소

### Use Cases
1. **대용량 Lookup Table (참조 테이블):** 예를 들어, 수백만 건의 로그 데이터에 우편번호 기반 도시 이름 매핑 테이블을 조인해야 할 때
2. **Machine Learning:** 각 노드에 거대한 Feature Vector나 가중치(Weight) 파라미터를 배포할 때

### 최적화 기술
* **과거 (HTTP 방식):** Driver가 모든 노드에게 1:1로 직접 데이터를 전송함 (병목 발생)
* **현재 (BitTorrent / Orchestra 방식):** * 데이터를 잘게 쪼개어(예: 4MB Chunk) **P2P(Peer-to-Peer) 방식**으로 워커 노드들끼리 서로 데이터를 주고받으며 배포함 (Driver 의 부하를 줄이고 배포 속도를 극대화하는 효율적인 알고리즘 적용)

### Code Example
```python
# 1. 생성 (Driver에서)
broadcastVar = sc.broadcast(list(range(1, 4))) # [1, 2, 3]

# 2. 사용 (Worker에서 읽기)
# Worker 노드의 Task 내부에서는 broadcastVar.value 형태로 값을 읽어서 사용함
broadcastVar.value
```

## Accumulators
> Worker Node에서는 Write만 가능하고, Master Node만 읽을 수 있는(Read-only) 글로벌 카운터
여러 Worker Node에 흩어진 데이터를 안전하게 병렬 연산(더하기 등 연관 법칙이 성립하는 연산)으로 누적시킬 수 있는 변수

**제약조건**
* **Task (Worker Node)**: 쓰기(Add)만 가능하며, 현재 Accumulator에 얼마가 쌓였는지 읽을 수 없음
* **Driver (Master Node)**: 최종적으로 누적된 결과를 읽을(Read) 수 있음

### Use Cases
* **디버깅 및 모니터링**: 수백 대의 노드에서 분산 처리되는 동안 발생한 에러(Corrupt records)의 총합 구하기
* **이벤트 카운팅**: 빈 줄(Blank lines)의 개수 등 특정 조건을 만족하는 **데이터의 총합 카운트**

### Code Example
```python
# 1. 생성 (Driver에서 초기값 0으로 설정)
accum = sc.accumulator(0)

rdd = sc.parallelize([1, 2, 3, 4])

# 2. 누적 (Worker에서 수행)
def f(x):
    global accum
    accum += x  # Worker는 오직 더하기만 수행

rdd.foreach(f)

# 3. 결과 확인 (Driver에서만 읽을 수 있음)
print(accum.value) # 결과: 10
```
