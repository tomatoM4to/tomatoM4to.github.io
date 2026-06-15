---
title: "Big Data - Spark SQL"
description: "강원대학교 컴퓨터공학과 202601 DB Programming, Spark SQL"
date: "2026-06-15"
keywords: "Big Data, Spark, KNU"
---

## Spark SQL & DataFrame

> 기존 RDD 의 한계를 극복하고, 구조화된 데이터를 효율적으로 처리하기 위한 모듈

기존 RDD 는 데이터의 내부 구조(Schema)를 알 수 없어 최적화가 어려웠음

* **DataFrame 의 특징**: RDD 에 Schema 즉 Column 과 Data Type 를 부여하여 RDBMS 의 Table 과 유사하게 동작함, 내부적으런 Catalyst Optimizer 를 통해 쿼리 실행 계획을 최적화하여 일반 RDD 연산보다 압도적으로 빠름
* 하나의 DataFrame 은 여러개의 Row(Item) 들로 구성되어 있음, Row 타입만 다루는 RDD 라 해석해도 무방

## Parquet
Spark SQL 은 JSON, CSV, TXT, JDBC 등 다양한 형태의 데이터를 DataFrame 으로 읽어올 수 있음.

* JSON: Key-Value 형태의 반정형 데이터
* Parquet: 빅테이터 스토리지의 핵심이며, Column-oriented 데이터 포맷, 필요한 Column 만 읽어올 수 있어 Disk I/O 가 획기적으로 줄고, 데이터 압축률이 매우 높음

## Spark SQL 을 다루는 2가지 방식
DataFrame 을 조작할 때는 Python 함수를 페이닝 하는 방식과, 실제 SQL 문법을 사용하는 방식 두가지를 모두 지원함.

### DataFrame API (프로그래밍 방식)
메서드를 연속해서 호출하여 데이터를 조작
```python
df.select("col1").filter(df["col1"] > 10).show()
df.createOrReplaceTempView("myTable")
spark.sql("SELECT col1 FROM myTable WHERE col1 > 10").show()
```

### SQL Queries (전통적 쿼리)
DataFrame 을 임시 View 로 등록한 뒤, 문자열 형태의 SQL 쿼리를 실행

```python
df.createOrReplaceTempView("myTable")
spark.sql("SELECT col1 FROM myTable WHERE col1 > 10").show()
```

### Core DataFrame APIs

**Inspect**
* `show()`: 데이터프레임의 내용을 표 형태로 출력
* `printSchema()`: 컬럼명과 데이터 타입(스키마) 출력
* `describe().show()`: 데이터의 요약 통계(개수, 평규느 표준편차 등) 출력

**Select & Filter**
* `select()`: 원하는 컬럼만 출출 (SQL 의 SELECT)
* `filter()` or `where()`: 특정 조건을 만족하는 행만 추출 (SQL 의 WHERE)
* `when().otherwise()`: 조건에 따른 값 분기 (SQL 의 CASE WHEN)

**GroupBy & Aggregation**
* `groupBy("col")`: 특정 컬럼을 기준으로 그룹화
* `agg()`: 여러 집계 함수(sum, max, min, count)를 동시에 적용

> e.g. `df.groupBy('col1').agg(F.min('col2'), F.max('col2')).show()`

**Add, Update, Remove**
* `withColumn("newCol", ...)`: 새로운 컬럼 추가 또는 기존 컬럼 업데이트
* `withColumnRenamed("old", "new")`: 컬럼명 변경
* `drop("col")`: 컬럼 삭제

**Missing Values(결측치 처리)**
* `df.na.fill(val)`: NULL 값을 지정한 값으로 채움
* `df.na.drop()`: NULL 값이 포함된 행(Row)을 제거

## UDF (User-Defined Functions)
Spark SQL 내장 함수로 해결할 수 없는 복잡한 로직이 필요할 때, 사용자가 직접 파이썬 함수를 만들어 SQL 쿼리 내에서 사용할 수 있도록 등록하는 기능

```python
spark.udf.register("square", lambda x: x * x, IntegerType())
df.createOrReplaceTempView("myTable")
spark.sql("SELECT square(someNumericField) FROM myTable")
```