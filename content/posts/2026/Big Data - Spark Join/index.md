---
title: "Big Data - Spark Join"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, Spark Join"
date: "2026-06-15"
keywords: "Big Data, Spark, KNU"
---

## Types of Joins
분산 환경에선 Join 알고리즘이 다양하며, 두 데이터셋(R, S)의 파티셔닝 상태에 따라 셔플(데이터 이동) 비용이 크게 달라짐

### Collected join
> 가장 이상적

* **정의**: Shuffle 없이 각 노드 내에서 로컬로 수행되는 조인
* **조건**: R과 S의 Key가 동일한 파티션 함수(same partition function)로 분할되어 있어야 함
* **특징**: $R = R_1 \cup \dots \cup R_k$, $S = S_1 \cup \dots \cup S_k$ 일 때, 서로 다른 파티션 간의 조인(즉, $i \neq j$ 일 때 $R_i \bowtie S_j = \emptyset$)은 공집합이 됨. 즉, 각 머신 간 데이터 이동이 전혀 필요 없음

### Directed join
> 한쪽판 Shuffle

* **정의**: R이나 S 둘 중 하나만 Shuffling 하여 수행하는 조인
* **조건**: R과 S가 서로 다른 파티션 함수($f$, $g$)로 분할되어 있을 때 발생함
* **특징**: 특징: R(또는 S)을 대상 데이터셋 S의 파티션 함수인 $g$(또는 $f$)에 맞춰 셔플(재분배)한 뒤, Collocated join을 수행함

### Repartition join
> 가장 무거움, 양 쪽 다 Shuffle

* **정의**: R과 S 양쪽 모두를 셔플(Shuffling)하여 수행하는 조인
* **조건**: 파티션 함수 $f$, $g$ 자체를 사용할 수 없거나(unavailable) 알 수 없을 때 발생함
* **특징**: 두 데이터셋 모두 완전히 새로운 파티션 함수를 기준으로 셔플한 뒤, Collocated join을 수행함. 대규모 네트워크 통신이 발생하여 비용이 가장 큼


### Broadcast join
> Spark 의 핵심 최적화

* **정의**: 정의: 한쪽 데이터셋이 다른 쪽보다 압도적으로 작을 때($R \ll |S|$), 작은 데이터셋 R 전체를 모든 Executor에 브로드캐스트(복사/전송)하여 수행하는 조인
* **특징**: 각 Executor $E_i$ 가 자신이 가진 큰 데이터셋의 파티션 $S_i$ 와 복사받은 전체 $R$ 을 로컬에서 조인($R \bowtie S_i$)함. 큰 데이터셋의 셔플을 방지할 수 있어 매우 효율적임
