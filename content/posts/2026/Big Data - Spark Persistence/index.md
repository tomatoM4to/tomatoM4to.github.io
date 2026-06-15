---
title: "Big Data - Spark Persistence"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, Spark Persistence"
date: "2026-06-14"
keywords: "Big Data, Spark, KNU"
---

## Example: Log Mining

Load error message from a log into memory, then interactively search for various patterns

```python
# 1. 하둡 시스템에서 파일 읽기 (아직 안 읽음)
lines = sc.textFile("hdfs://...")

# 2. "error"로 시작하는 줄만 필터링 (아직 안 함)
errors = lines.filter(lambda s: s.startswith("error"))

# 3. 탭(\t)으로 쪼개서 3번째 인덱스(소프트웨어 이름)만 추출 (아직 안 함)
messages = errors.map(lambda s: s.split("\t")[2])

# 4. 추출한 데이터를 메모리에 저장하겠다고 '선언' (아직 캐싱 안 됨)
messages.cache()

# Action 함수 호출 -> 여기서 Job이 생성되고 실제 연산이 시작됨
messages.filter(lambda s: "mysql" in s).count()
```
1. **Serialization**: Driver 가 User가 작성한 lambda 함수 코드들을 ByteStream 으로 Serialize 하여 각 Worker Node 들에게 던져줌
2. **데이터 로드(Data Locality)**: Worker Node 들은 네트워크 통신을 최소화하기 위해, 각자 자기 Disk(HDFS 블록) 에 있는 Log Data 를 직접 읽음, 이때 Hadoop의 1개의 Block이 Spark 의 1개의 Partition 으로 1:1 매핑됨
3. **연산 수행**: 각 Worker는 자기가 맡은 Partition 의 데이터에 대해 `filter("error")`, `map(split)` 연산을 몰아서 처리 (Shuffle 없음)
4. **Caching**: `messages.cache()` 를 만났기 때문에, 정제된 데이터를 Worker Node 의 RAM 에 저장
5. **최종 필터 및 카운트**: RAM에 방금 올라간 그 데이터에서 `filter("mysql")`을 수행하고, 조건에 맞는 에러가 몇 개인지 Count

```python
# 두 번째 Action 함수 호출
messages.filter(lambda s: "php" in s).count()
```
1. **코드 전송**: Driver가 새로운 lambda 함수`("php" in s)`를 Worker들에게 전송
2. **데이터 로드**: RAM에 캐싱해 두었던 **messages RDD 데이터**를 가져옴
3. **최종 필터 및 카운트**: 메모리에 있는 정제된 데이터에서 `filter("php")`만 수행한 뒤 개수를 Count


## Memory & Persistence
Spark 의 Persistence 는 `rdd.cache()`와 동일한 의미를 가짐

* **Recommended** to use at most **75% of a machine's memory** for Spark
* Minimum Executor heap size should be 8GB
* Max Executor heap size depends... maybe 40GB (watch GC)
* Memory usage is greatly affected by storage level and serialization format

### Executor Heap Size
Spark 는 JVM 위에서 동작함, **Heap 영역은** RDD 데이터, 셔플 중간 결과물, 사용자가 생성한 대용량 배열 등이 적재되는 Main Memory 공간

* 메모리 할당 권장량: 머신 전체 RAM 의 최대 75% 까지 Spark 용으로 사용할 것을 권장
* Heap Size 가이드: 최소 8GB 이상이어야 하며, 너무 크면(40GB 이상) GC 지연으로 성능이 떨어질 수도 있음
* 메모리 사용량은 Storage Level 과 Serialization 에 큰 영향을 받음

## RAM vs Disk
Spark 는 Memory 를 사용할때 크게 두가지 옵션이 있음

1. Memory only (RAM 만 사용)
2. Memory and Disk (RAM + Disk)

> `rdd.cache()` 사용시 오리지널 데이터 크기가 RAM 보다 크면 out of memory 에러 발생함, 혹은 아예 그냥 Memory + Disk 옵션을 사용

### Persist

`rdd.cache()` 를 다양하게 사용하는법
```python
RDD.persist(storage-level)
```
**storage-level**
1. `MEMORY_ONLY`, `RDD.cache() == RDD.persist(MEMORY_ONLY)`, most CPU-efficient option
2. `MEMORY_ONLY_SER`: Data 를 byte stream 으로 직렬화 한 다음 RAM 에 올려둔다란 의미
3. `MEMORY_AND_DISK`: Spark EX 는 Memory 상에 RDD 를 저장할 수 있지만, 가장 예전에 접근했던 파티션을 Disk 에 보내 버림, 이땐 직렬화 과정을 한 후에 보냄, 그리고 새로운 RDD 추가 하는 방식, **LRU 방식 사용**
4. `MEMORY_AND_DISK_SER`: RAM 상에도, Disk 상에도 직렬화된 형태로 저장함
5. `DISK_ONLY`: Disk 만 사용, Disk 를 사용시 반드시 직렬화 과정을 거쳐야 함
6. `MEMORY_ONLY_2`: Data Replication 을 위해, Fault Tolerance 에 의해 한 Node 에 접근이 불가능한 경우, 다른 Node 에 있는 RDD 파티션을 위한
7. `MEMORY_AND_DISK_2`: RDD Partition 이 서로다른 node 에 이루어짐

> `rdd.unpersist()` 사용 시 해당 RDD 가 메모리 에서 즉시 해제하여 공간 확보 가능

> `join`, `reduceByKey` 등 셔플(Shuffle)이 일어날 때 발생하는 중간 데이터(Intermediate data)는 재계산 비용이 너무 크기 때문에 사용자가 명시하지 않아도 Spark가 자동으로 Persist 함

> Excuter(JVM) 내에 4개의 Partition 이 있따고 가정하고, 하나의 새로운 Partitoin 이 추가된다고 가정해보면 가장 오래전에 사용된 데이터를 방출함

* If RDD fits in memory, chose `MEMORY_ONLY`
* If not, use `MEMORY_ONLY_SER`, fast serialization library
* **Don’t spill to disk** unless functions that computed the datasets are very expensive or they filter a large amount of data. (recomputing may be as fast as reading from disk)
* Use replicated storage levels sparingly and only if you want
fast fault recovery

### Spark Executor Memory
전체 Spark Executor Memory(예: 100GB)는 용도에 따라 크게 3가지 공간으로 나뉨. (환경변수로 튜닝 가능)

1. **Cached RDDs (60%)**: `cache()`나 `persist()`를 통해 저장된 RDD 데이터 스토리지
2. **User Programs (20%)**: 사용자가 작성한 코드(콜백 함수 등)와 임시 데이터가 사용하는 공간
3. **Shuffle memory (20%)**: 셔플 및 집계(Aggregation) 연산을 위한 버퍼 공간

## Data Serialization

> Original Data를 통신 및 저장을 위해 0101001...(Byte Stream)로 변환하는 과정. 메모리 공간을 크게 절약할 수 있음. 역과정은 Deserialization(역직렬화)

직렬화가 발생하는 4가지 주요 상황
* Transferring data over the networks
* Spilling data to disk
* Caching to memory serialized
* Broadcasting variables

직렬화 라이브러리
* Java 기본 API 사용
* KRYO 라이브러리 사용 (권장사항)
* PySpark: Python 환경에선 객체를 주고받기 위해 기본적으로 Pickle 라이브러리를 사용하여 직렬화를 수행함