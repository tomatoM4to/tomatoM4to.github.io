---
title: "Big Data - Spark Basis APIs"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, Spark Basis APIs 소개"
date: "2026-06-12"
keywords: "Big Data, Spark, KNU"
---

## Transformations
Most transformations are element-wise(they work on one element at a time), but this is not true for all transformations.

> element = item

> RDD 의 변환 함수, 실슴 환경은 Google Colab 에서 진행됨, Google Drive 에서 실습파일 다운받고 사용

**setup code**
```python
import pyspark

from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .master("local") \
    .appName("practice_transformations") \
    .getOrCreate()

sc = spark.sparkContext
```

### map(f)
> 각 element 에 f 를 적용한 후 새로운 RDD를 만듬, 일반적인 Python 과 다를게 없지만, 여러개의 Core 가 분산적으로 수행하고 있음을 인지하고 있어야 함

```python
x = sc.parallelize(["b", "a", "c"])
y = x.map(lambda z: (z,1))
print (x.collect()) # ['b', 'a', 'c']
print (y.collect()) # [('b', 1), ('a', 1), ('c', 1)]
```


### filter(f)
> output 이 boolean 이어야 함

```python
x = sc.parallelize([1, 2, 3])
y = x.filter(lambda x: x%2 == 1)
print (x.collect()) # [1, 2, 3]
print (y.collect()) # [1, 3]
```

### flatMap(f, preservesPartitioning=False)
> map 처럼 각 element 에 f 를 적용하는건 똑같지만, 그 return 값이 Tuple 처럼 반복 가능한 객체여야함

```python
x = sc.parallelize([1, 2, 3])
y = x.flatMap(lambda x: (x, x*100, 42))
print (x.collect()) # [1, 2, 3]
print (y.collect()) # [1, 100, 42, 2, 200, 42, 3, 300, 42]
```

2차원을 1차원으로, 3차원을 2차원으로 변환할 수도 있음

```python
data = [[1, 2], [3, 4], [5, 6]]
x = sc.parallelize(data)
y_flatmap = x.flatMap(lambda row: row)
print(y_flatmap.collect())  # [1, 2, 3, 4, 5, 6]
```

```python
data_3d = [
    [[1, 2], [3, 4]],
    [[5, 6], [7, 8]]
]
x = sc.parallelize(data_3d)
y_flatmap = x.flatMap(lambda row: row)

print(y_flatmap.collect())  # [[1, 2], [3, 4], [5, 6], [7, 8]]
```


### groupBy(f)
Group the data in the original RDD. Create pairs where the key is the output of a user function, and the value is all items for which the function yields this key.

```python
x = sc.parallelize(['John', 'Fred', 'Anna', 'James'])
y = x.groupBy(lambda w: w[0])
print (x.collect())  # ['John', 'Fred', 'Anna', 'James']
print ([(t[0], [i for i in t[1]]) for t in y.collect()])  # [('J', ['John', 'James']), ('F', ['Fred']), ('A', ['Anna'])]
```

### groupByKey()
Group the values for each key in the original RDD. Create a new pair where the original key corresponds to this collected group of values.

```python
x = sc.parallelize([('B', 5), ('B', 4), ('A', 3), ('A', 2), ('A', 1)])
y = x.groupByKey()
print(x.collect())  # [('B', 5), ('B', 4), ('A', 3), ('A', 2), ('A', 1)]
print([(t[0], [i for i in t[1]]) for t in y.collect()])  # [('B', [5, 4]), ('A', [3, 2, 1])]
```

> 데이터가 미리 Pair 로 정의되어 있어야 함

### Simulating GroupBy using GroupByKey
```python
f = lambda name: name[0]
x = sc.parallelize(['John', 'Fred', 'Anna', 'James'])
y = x.map(lambda name: (f(name), name))
z = y.groupByKey()
print(x.collect())
print(y.collect())
print([(t[0], [i for i in t[1]]) for t in z.collect()])
```

```text
['John', 'Fred', 'Anna', 'James']
[('J', 'John'), ('F', 'Fred'), ('A', 'Anna'), ('J', 'James')]
[('J', ['John', 'James']), ('F', ['Fred']), ('A', ['Anna'])]
```

### Simulating GroupByKey using GroupBy
```python
x = sc.parallelize([('B', 5), ('B', 4), ('A', 3), ('A', 2), ('A', 1)])
y = x.groupBy(lambda z: z[0])
z = y.map(lambda pair: [pair[0], [value[1] for value in pair[1]]])
print(x.collect())
print([(t[0], [u for u in t[1]]) for t in y.collect()])
print([(t[0], [i for i in t[1]]) for t in z.collect()])
```
```text
[('B', 5), ('B', 4), ('A', 3), ('A', 2), ('A', 1)]
[('B', [('B', 5), ('B', 4)]), ('A', [('A', 3), ('A', 2), ('A', 1)])]
[('B', [5, 4]), ('A', [3, 2, 1])]
```

### Word Counting Using GroupByKey

```python
words = sc.parallelize(['one', 'two', 'two', 'three', 'three', 'three'])
wordPairsRdd = words.map(lambda w: (w, 1))
wordPairsGrouped = wordPairsRdd.groupByKey()
wordCounts = wordPairsGrouped.map(lambda pair: (pair[0], sum(pair[1])))
print(words.collect())
print(wordPairsRdd.collect())
print([(t[0], [u for u in t[1]]) for t in wordPairsGrouped.collect()])
print(wordCounts.collect())
```
```text
['one', 'two', 'two', 'three', 'three', 'three']
[('one', 1), ('two', 1), ('two', 1), ('three', 1), ('three', 1), ('three', 1)]
[('one', [1]), ('two', [1, 1]), ('three', [1, 1, 1])]
[('one', 1), ('two', 2), ('three', 3)]
```

### Word Counting Using ReduceByKey
```python
words = sc.parallelize(['one', 'two', 'two', 'three', 'three', 'three'])
wordPairsRdd = words.map(lambda w: (w, 1))
wordPairsReduces = wordPairsRdd.reduceByKey(lambda cnt1, cnt2: cnt1 + cnt2)
print(words.collect())
print(wordPairsRdd.collect())
print(wordPairsReduces.collect())
```
```python
['one', 'two', 'two', 'three', 'three', 'three']
[('one', 1), ('two', 1), ('two', 1), ('three', 1), ('three', 1), ('three', 1)]
[('one', 1), ('two', 2), ('three', 3)]
```

* `groupBy`: 각 Worker Node 에 흩어져 있는 Data 를 Key 끼리 모으기 위해 Worker Node 끼리 데이터를 Shuffle
* `reduceByKey`: Shuffle 하기 전에, 먼저 각 Worker Node 내부에서 같은 Key 를 가진 데이터들을 자체적으로 부분 병합, 덩치가 줄어든 데이터들을 Worker Node들끼리 교환하여 최종 병합을 수행

> 결과적으로 Network 통신이 압도적으로 줄어듬, 가능한 reduceByKey 를 쓰는게 효율적임

> reduceByKey can reduce the number of rows to shuffle by combining rows before the shuffle

> Shuffle 연산은 Network 통신을 의미

### MapPartitions
`sc.parallelize(데이터_배열, 파티션_개수)` 이므로, `x` 는 이미 partition 이 나누어진 상태

MapPartitions 함수는 in 도 partition, out 도 partition 인 함수

```python
x = sc.parallelize([1,2,3],2)
def f(iterator):
  yield sum(iterator)
  yield 42
y=x.mapPartitions(f)
print(x.glom().collect())  # x: [[1], [2, 3]]
print(y.glom().collect())  # y: [[1,42], [5,42]]
```

> `mapPartitions` 에 넘겨주는 함수는 반드시 Iterator 를 반환해야 함

### MapPartitionsWithIndex
> 첫번째 인자로 index 넘겨줌

```python
x = sc.parallelize([1, 2, 3], 2)
def f(partitionIndex, iterator):
    yield partitionIndex, sum(iterator)
y = x.mapPartitionsWithIndex(f)
print(x.glom().collect())  # [[1], [2, 3]]
print(y.glom().collect())  # [[(0, 1)], [(1, 5)]]
```

### Sample
> 전체 데이터에서 지정한 비율만큼 무작위로 일부만 추출합니다
```python
x = sc.parallelize([1, 2, 3, 4, 5])
y = x.sample(False, 0.4, 24)
print(x.collect())  # [1, 2, 3, 4, 5]
print(y.collect())  # [4]
```
### Union
> 두 RDD를 위아래로 단순히 합침 (중복 제거 안 함, 셔플 없음)

```python
x = sc.parallelize([1, 2, 3], 2)
y = sc.parallelize([3, 4], 1)
z = x.union(y)
print(z.glom().collect())  # [[1], [2, 3], [3, 4]]
```

### Join
> 두 RDD에서 같은 Key를 가진 데이터끼리 연결(Inner Join)
```python
x = sc.parallelize([("a", 1), ("b", 2)])
y = sc.parallelize([("a", 3), ("a", 4), ("b", 5)])
z = x.join(y)
print(z.collect())  #  [('b', (2, 5)), ('a', (1, 3)), ('a', (1, 4))]
```

### Distinct
> 데이터의 중복을 제거 (셔플 발생)

```python
x = sc.parallelize([1, 2, 3, 3, 4])
y = x.distinct()
print(y.collect())  # [1, 2, 3, 4]
```

### Coalesce
> 셔플 없이 기존 파티션들을 합쳐서 파티션 개수를 줄임

```python
x = sc.parallelize([1, 2, 3, 4, 5], 3)
y = x.coalesce(2)
print(x.glom().collect())  # [[1], [2, 3], [4, 5]]
print(y.glom().collect())  # [[1], [2, 3, 4, 5]]
```

### KeyBy
> 데이터의 특정 값을 추출해 Key로 지정하여 (Key, Value) 쌍으로 만듬

```python
x = sc.parallelize(["John", "Fred", "Anna", "James"])
y = x.keyBy(lambda w: w[0])
print(y.collect())  # [('J', 'John'), ('F', 'Fred'), ('A', 'Anna'), ('J', 'James')]
```

### PartitionBy
> 지정한 파티셔너(Partition) 기준에 따라 데이터를 각 파티션으로 강제 재배치

```python
x = sc.parallelize([("J", "James"), ("F", "Fred"), ("A", "Anna"), ("J", "John")])
y = x.partitionBy(2, lambda w: 0 if w[0] < "H" else 1)
print(x.glom().collect())  # [[('J', 'James'), ('F', 'Fred'), ('A', 'Anna'), ('J', 'John')]]
print(y.glom().collect())  # [[('F', 'Fred'), ('A', 'Anna')], [('J', 'James'), ('J', 'John')]]
```

### Zip
> 파티션 수와 요소 개수가 똑같은 두 RDD를 인덱스 순서대로 1:1로 묶어줌

```python
x = sc.parallelize([1, 2, 3])
y = x.map(lambda n: n*n)
z = x.zip(y)
print(z.collect())  # [(1, 1), (2, 4), (3, 9)]
```






## Actions
실제 병렬 연산을 트리거하고 결과를 가져오는 연산

### GetNumPartitions
> 현재 RDD가 몇 개의 파티션으로 쪼개져 있는지 그 개수를 반환

```python
x = sc.parallelize([1, 2, 3], 2)
y = x.getNumPartitions()
print(x.glom().collect())  # [[1], [2, 3]]
print(y)  # 2
```

### Collect
> 분산 처리된 모든 결과 데이터를 마스터 노드(Driver)의 메모리로 한 번에 다 가져옴
```python
x = sc.parallelize([1, 2, 3], 2)
y = x.collect()
print(x.glom().collect())  # [[1], [2, 3]]
print(y)  # [1, 2, 3]
```

### Reduce
> 모든 요소를 지정한 함수로 누적해서 하나의 최종 결과값으로 합침
```python
x = sc.parallelize([1, 2, 3, 4])
y = x.reduce(lambda a, b: a + b)
print (x.collect())  # [1, 2, 3, 4]
print (y)  # 10
```

### Max
```python
x = sc.parallelize([2, 4, 1])
y = x.max()
print (x.collect())  # [2, 4, 1]
print (y)  # 4
```
### Mean
```python
x = sc.parallelize([2, 4, 1])
y = x.mean()
print (x.collect())  # [2, 4, 1]
print (y)  # 2.3333333333333335
```

### STDEV
> 표준편차

```python
x = sc.parallelize([2, 4, 1])
y = x.stdev()
print (x.collect())  # [2, 4, 1]
print (y)  # 1.247219128924647
```

### CountByKey
> 각 Key가 몇 개씩 있는지 세어서 딕셔너리 형태로 반환
```python
x = sc.parallelize([("J", "James"), ("F", "Fred"), ("A", "Anna"), ("J", "John")])
y = x.countByKey()
print(x.collect())  # [('J', 'James'), ('F', 'Fred'), ('A', 'Anna'), ('J', 'John')]
print(y)  # defaultdict(<class 'int'>, {'J': 2, 'F': 1, 'A': 1})
```

### CountByValue
```python
x = sc.parallelize([1, 2, 2, 3, 3, 3])
y = x.countByValue()
print(x.collect())  # [1, 2, 2, 3, 3, 3]
print(y)  # defaultdict(<class 'int'>, {1: 1, 2: 2, 3: 3})
```
