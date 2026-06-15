---
title: "Big Data - Spark Job-Stage-Task"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, Spark Job-Stage-Task"
date: "2026-06-15"
keywords: "Big Data, Spark, KNU"
---

## Job, Stage, Task
* **DAG**: Spark 가 코드를 보면서 만든 논리적 작업 순서, 실행은 하지 않음
* **Job**: A job is a **parallel computation** triggered by a Spark action (e.g. 'count', 'save'), which is composed of **one or more stages.**, Action 하나당 하나의 Job 이 생성됨
* **Stage**: A stage is a **physical unit of execution** consisting of **a set of parallel tasks** that can be run together **without a data shuffle.**, Job 을 Shuffle 단위로 쪼갠것
* **Task**: A task is the **smallest unit of work in Spark**, representing **the execution of a series of transformations** on a **single partition of data.**, Core 하나가 맡은 가장 작은 노동 단위, `1Partition=1Task`


**Task와 Partition의 관계 예제 코드**
```python
# 데이터를 3개의 파티션으로 쪼개서 분산 환경(RDD)에 올림
rdd = sc.parallelize([1, 2, 3, 4, 5, 6], 3)

# Transformation: 각 요소에 10을 곱함
mapped_rdd = rdd.map(lambda x: x * 10)

# Action: Job 실행
print(mapped_rdd.collect())
```

> Spark 에선 1개의 Partition 이 1개의 Task 를 의미함

> `map` 은 데이터를 섞지 않는 연산이므로, 해당 작업은 쪼개지지 않고, 1개의 Stage 로 처리

## Scheduling Process
사용자가 Action 연산을 호출했을 때, Spark 엔진 내부에서 코드를 어떻게 쪼개서 실행하는지에 대한 파이프라인

1. **RDD Objects**: 코드(`join`, `groupBy`, `filter` 등)를 바탕으로 DAG을 그림
2. **DAG Scheduler**: Split graph into stages of tasks, Submit each stage into ready
3. **Task Scheduler**: Launches individual tasks, Retry failed or straggling tasks
4. **Executor**: Execute tasks, Stor and serve blocks

> DAG: 논리적인 실행 계획

## Lineage
* “One of the challenges in **providing RDDs** as an abstraction is **choosing** a **representation** for them **that can track lineage** across a **wide range of transformations.**
* “The most interesting question in **designing this interface** is how to represent **dependencies between RDDs.**

RDD는 데이터 자체를 다 들고 있는 것이 아니라, **"내가 어떤 부모 RDD에서 어떤 변환(Transformation)을 거쳐서 만들어졌는지"** 에 대한 족보(Lineage Graph)만을 기록해 둔다.

파티션 하나가 날아가도 이 Lineage Graph를 보고 처음부터 다시 계산해서 복구할 수 있음

이렇게 만들어진 는 부모 RDD 와 자식 RDD Partition 간의 관계는 크게 두가지로 분류한다.
1. Narrow Dependencies
2. Wide Dependencies

### Narrow Dependencies
> narrow dependencies, where each partition of the parent RDD is used by at most one partition of the child RDD

* **정의**: 부모 RDD의 각 파티션이 자식 RDD의 최대 1개 파티션에만 사용되는 경우
* **특징**: 데이터가 다른 노드로 이동할 필요 없이, 같은 노드 내에서 쭉 이어서 계산하면 됨 (Shuffle 없음)
* **해당 연산**: `map`, `filter`, `union`, 이미 같은 기준으로 파티셔닝된 `join`

### Wide Dependencies
> wide dependencies, where multiple child partitions may depend on it.

* **정의**: 부모 RDD의 파티션 1개가 자식 RDD의 여러 파티션으로 쪼개져 흩어지는 경우
* **특징**: 같은 Key를 가진 데이터를 모으기 위해 워커 노드들 간에 대규모 데이터 이동(네트워크 Shuffle)이 무조건 발생
* **해당 연산**: `groupByKey`, `reduceByKey`, 기준이 다른 `join`, 파티션 수를 바꾸는 `repartition` 등

## Example Problem
### How many Stages will this code require?
```python
sc.textFile("someFile.txt").
    map(mapFunc).
    flatMap(flatMapFunc).
    filter(filterFunc).
    count()
```
`map`, `flatMap`, `filter` 모두 Shuffle 이 일어나지 않기 때문에 하나의 Stage 로 구성이 된다.

### How many Stages will this DAG require?

![spark-stage-count-problem](/img/bigdata/spark-stage-count-problem.webp)

Wide Dependencies Transformation 을 찾고 해당 지점을 Stage 간의 경계로 생각, 총 4개의 Stage 로 구성되어짐