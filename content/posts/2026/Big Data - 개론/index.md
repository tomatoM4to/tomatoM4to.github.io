---
title: "Big Data - 개론"
description: "강원대학교 컴퓨터공학과 202601 DB Programming 1, 2주차 Big Data 개론"
date: "2026-03-08"
keywords: "Big Data, KNU"
---

## What is DB?
* **Database**: 조직화된 데이터의 모음
* **DBMS (Database Management System)**: **end-user**, **Application**, **Database** 와 상호작용 하는 소프트웨어 시스템, 데이터를 캡쳐하거나 분석하는것을 목적으로 둠

## 데이터 포맷
Database 는 Structured Data 를 집중으로 발전하여 왔으며, 최근에는 Semi-Structured Data 와 Unstructured Data 까지 포함하는 다양한 데이터 포맷을 포함하며 점점 확장되어 가고 있다.

### Structured Data
전통적인 Database 로서 행(row) 과 열(column) 로 이루어진 일종의 표(Table) 형태로 데이터를 표현하는 방식이다. Excel 이나 CSV 파일이 대표적인 예시, 추가로 Relational Data 도 이에 해당한다.

Alice 와 Bob 이라는 학생의 취미를 담은 Structured Data 의 예시를 들어보자.

**Students Table**
| Student | ID |
|---------|----|
| Alice   | 1  |
| Bob     | 2  |


**Participants Table**
| ID |  Activity  |
|----|------------|
| 1  | Basketball |
| 1  | Game       |
| 2  | Game       |



### Semi-Structured Data
XML 이나 JSON 과 같이 구조화된 요소와 자유로운 텍스트가 혼합된 데이터 포맷을 말한다. Rule 이 존재하는 데이터라고 생각하해도 무방하다. `JSON`, `XML` 이 대표적이고 `Graph=(V, E)` 도 이에 해당한다.

아래는 key-value 쌍으로 이루어진 JSON 포맷의 Semi-Structured Data 예시

```json
{
  "students": [
    {
      "name": "Alice",
      "id": 1,
      "activity": [ "Basketball", "Game" ],
    },
    {
      "name": "Bob",
      "id": 2,
      "activity": [ "Game" ],
    }
  ]
}
```

### Unstructured Data

어떠한 Rule 이 존재하지 않는 데이터 포맷, `.pdf`, `.jpg`, `.mp4` 같은 Binary 데이터가 대표적인 예시, 지금 보는 줄글도 Unstructured Data 의 한 예시라고 할 수 있다.


## What is Big Data?
> 기존의 **전통정인 DBMS 으로 다룰수 없을만큼 too large 한 Data set** 을 의미한다.

이러한 Big Data 는 4Vs 라고 불리는 특징들을 가지고 있다.

1. **Volume**: 데이터의 사이즈
2. **Velocity**: 빠른 데이터의 생성 속도
3. **Variety**: 데이터의 다양한 포맷, Structured, Semi-Structured, Unstructured 모두 포함
4. **Veracity**: 부정확하거나, 불완전한 데이터가 포함될 수 있다.

### Volume
> Measure describing the size of generated data

이렇게 방대한 데이터는 Youtube, Instagram, Netflix 와 같은 기업들에서 사용자들이 생성하는 데이터, IoT 센서에서 생성되는 데이터, 금융 거래에서 생성되는 데이터 등 다양한 출처에서 생성된다.

### Velocity
> Speed at which the data is generated and processed

* Google web index: `10+ PB`
* Meta's daily logs: `60 TB`

오늘날은 `ZB` 단위까지 산업에서 다루어 지고 있음

### Variety
> Diverse formats of data: structured, semi-structured, unstructured

* Structured: Relational databases, CSV files, Excel sheets
* Semi-Structured: JSON, XML, Graph data
* Unstructured: Text documents, images, videos, audio files

### Veracity
> Measure of how truthful, accurate, and reliable data is

데이터의 신뢰성, 실제로 특정 테이블의 특정 벨류들이 빠져있는 경우가 있을 수 있다. 예를들어 설문조사를 하는데 특정 질문에 답을 하지 않은 경우나, 유저가 올바르지 않은 정보를 입력하는 경우가 있을 수 있다.

이렇게 부정확한 데이터를 어떻게하면 올바른 값으로 추정할건가, 라는것도 Big Data 분야에서 중요한 문제다. 이런 문제를 풀기 위해 최근에는 머신러닝을 활용하는 경우도 많다.

## Distribution File System
이렇게 방대한 데이터를 저장하기 위해 여러 Node 에 데이터를 분산하여 저장하는 시스템이 필요하다. 대표적으로 **Hadoop Distributed File System (HDFS)** 이 있다(오픈소스)

실제로 Youtube나, Netflix 같은 기업들은 한 동영상의 파일을 단일로 저장하지 않고, **여러 Node 에 분산하여 저장**한다. 이렇게 분산하여 저장하는 이유는 단일 Node 에 저장하는 경우에 비해 **데이터의 안정성과 접근 속도가 향상**되기 때문
* 한 노드가 사용 불가능 하더라도 다른 노드에서 데이터 접근 가능
* 여러 노드에서 병렬적으로 데이터에 접근할 수 있기 때문에 빠른 데이터 처리 가능

이러한 DFS 에는 **Replication** 이라는 기능을 조건적으로 제공해야 하는데, 가령 한 Node 가 화제나, 정전으로 멈췄을때, 파일이 손실되지 않도록 **같은 파일들을 두대 이상의 Node 에다가 복사하는 기능**이다. 완전히 동일한 파일을 복사하지는 않고 여러 기술을 통해 1.8배 정도의 저장 공간만 추가로 사용하면서도 데이터의 안정성을 보장할 수 있는 방법들이 존재한다.

> Node = 컴퓨터 시스템의 단위

## Distributed Data Processing

## 본 수업의 목표
1. Understand and apply big data processing techniques
2. Acquire advanced database and application development skills
3. Strengthen your ability to process large-scale data using Apache Spark and Python
4. Practice data cleaning and transformation methods in hands-on sessions
5. Reinforce theoretical concepts through practical exercises and real-world tasks

별도의 교과서는 사용하지 않는다
