---
title: "Big Data - History of Spark"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, Spark 의 역사와 가장 기본이 되는 용어 소개"
date: "2026-06-11"
keywords: "Big Data, Spark, KNU"
---

## Spark
Cluster 내에 있는 Core 내에서 병렬(Parallel)로 처리 하기 위한 **Distributed Computing Framework**

다양한게 있는데 해당 수업에선 Apache Spark 를 다룰 예정

> [https://spark.apache.org/community.html](https://spark.apache.org/community.html)

## History of Spark
2011년에 65명 정도의 매우 큰 규모의 연구실에서 시작 (UC Berkeley)

Spark 는 데이터에 관해 다음과 같은 기능을 제공함
* Scheduling
* Monitoring
* Distributing

Spark 이전엔 Hadoop/MapReduce 를 사용했지만, 해당 시스템은 비순환 데이터 플로우 모델과 잦은 디스크 접근 이라는 한계를 가지고 있기에 Spark 연구가 시작됨

가장 큰 차이점이라면 **Hadoop/MapReduce 는 Disk 의 사용량이 높**았고, **Spark 는 근본적인 처리 방식은 안바꾸는 대신 Memory 사용량을 늘리는 방식**으로 연구, 최대 100배까지 빠르다고 알려져 있음

User 가 사영하게 될 API 들도 굉장히 유사하도고 함

> Google Colab 에서 별도의 설치 과정 없이 사용 가능

### Spark Ecosystem
![https://velog.velcdn.com/images/jskim/post/412a3850-79fc-4ca4-92fd-d65daf8f62d8/image.png](https://velog.velcdn.com/images/jskim/post/412a3850-79fc-4ca4-92fd-d65daf8f62d8/image.png)

[Reference](https://velog.io/@jskim/Apache-Spark%EB%9E%80)

이미지를 보면 SQL, Streaming, Graph, MLBase ML 등등 여러 데이터들을 다룰수 있도록 통합되어 있음, 또한 Hadoop Storage 같은 HDFS 를 기반으로 돌아감

그밖에 Mesos, YARN 같은 Cluster 의 Resource 를 관리하는 소프트웨어 등등이 추가되는 형태

> 수업에서 사용한 이미지는 HDFS 가 속한 레이어 의 위치와 Mesos, YARN 이 속한 의 위치가 반대로 되어 있음

### Hardware 와 Spark
> * RAM: 10GB/s
> * HDD: 100MB/s
> * SSD: 600MB/s

추가로 Spark 는 **Distributed Computing Framework** 이기에 **Network 통신도 사용**함, 근데 Network 도 무시할 수 없을 정도로 매우 큰 비용이 드는 작업, 그리고 RAM 에 비하면 턱없이 부족한 속도

결론적으로 Big Data 를 빠르게 처리하는 방법은, Disk 의 활용은 줄이고 Network 통신도 줄이는것, 이상적인 방향이긴 하지만, 지금 현재 Spark 가 이부분을 가장 잘 수행하고 있는 중

### BlinkDB
> Apache Spark 와 Shark를 기반으로 구축된 근사 쿼리 엔진으로, 쿼리 정확도를 다소 희생하는 대신 매우 빠른 응답 속도를 제공하여 대규모 데이터 세트에서 대화형 SQL 쿼리를 실행하도록 설계

```sql
SELECT AVG(sessionTime)
FROM Table
WHERE city="San Francisco"
WHININ 2 SECONDS
```
평균값을 2초 내에 계산해라

```sql
SELECT AVG(sessionTime)
FROM Table
WHERE city="San Francisco"
ERROR 0.1 CONFIDENCE 95.0%
```
평균값을 구하는데, 아래의 신뢰구간을 만족하면서 구해라

이런식으로 **근사치**를 구하는것이 Spark 의 Feature 중 하나

## RDD (Resilient Distributed Dataset)
> DBMS 의 Table 과 대응되는 개념으로서 Spark 의 주요 처리 단위

* **Resilient**: 복원 가능한
* **Distributed**: 분산된
* **Dataset**: 데이터셋

### RDD structure
![RDD structure](/img/bigdata/RDD-structure.webp)

하나의 RDD 는 N개의 Partition 으로 구성되고 또 그 Partition 들이 M 개의 Items 로 나누어짐 이때의 Item 하나가 Row 에 대응되게 됨

> Hardware 적인 예기를 추가하면, 하나의 Partition 은 하나의 Core 로 실행됨, 즉 Partition 이 많이질수록 병렬(Parallel)성이 높아짐

### Driver Program
* The program that **declares the transformations** and actions on RDDs of data and submits such requests to the master.
* Creates the SparkContext, connecting to a given Spark Master.
* Its location is independent of the master/slaves.

> Driver Program은 RDD에 대한 변환(transformations)과 액션(actions)을 선언하고 , 주어진 Spark Master에 연결하여 SparkContext를 생성하는 주체

* **transformations**: 기존 RDD의 데이터를 조작하여 새로운 RDD를 생성
* **action**: 미뤄두었던 Transformation 연산들을 실제로 실행(Trigger)시키는 작업

> lazy Evaluation: Transformation 연산들은 즉시 실행되지 않는 Lazy Evaluation 방식을 따름. 즉, 코드가 실행될 때 데이터를 바로 연산하는 것이 아니라, "어떤 연산들을 수행할 것인지"에 대한 기록(Lineage)만 해두고 연산을 미룬다.