---
title: "DB Programming 1주차"
description: "강원대학교 컴퓨터공학과 2026년 1학기 DB Programming 수업 1주차 강의 내용 정리, 추가 및 보충"
date: "2026-03-08"
keywords: "Database, KNU"
---

## What is DB Programming?
먼저 시작하기 전 몇개의 용어를 정의해보자.

* **Database**: 조직화된 데이터의 모음
* **DBMS (Database Management System)**: end-user, Application 그리고 DB 와 상호작용 하는 소프트웨어 시스템, 데이터를 캡쳐하거나 분석하는것을 목적으로 둠

## 데이터 포맷
Database 는 Structured Data 를 집중으로 발전하여 왔으며, 최근에는 Semi-Structured Data 와 Unstructured Data 까지 포함하는 다양한 데이터 포맷을 포함하며 점점 확장되어 가고 있다.

### Structured Data
전통적인 Database 로서 행(row) 과 열(column) 로 이루어진 일종의 표(Table) 형태로 데이터를 표현하는 방식이다. Excel 이나 CSV 파일이 대표적인 예시, 추가로 Relational Data 도 이에 해당한다.

Alice 와 Bob 이라는 학생이 각각 농구와 축구에 참여한다고 생각해보자. 이 데이터를 Structured Data 로 표현하면 다음과 같다.

**Students Table**
| Student | ID |
|---------|----|
| Alice   | 1  |
| Bob     | 2  |


**Participants Table**
| ID | Activity |
|----|----------|
| 1  | Basketball |
| 2  | Soccer     |

**Activities Table**
| Activity | Cost |
|----------|------|
| Basketball | $100 |
| Soccer     | $150 |


### Semi-Structured Data
XML 이나 JSON 과 같이 구조화된 요소와 자유로운 텍스트가 혼합된 데이터 포맷을 말한다.

```json
{
  "students": [
    {
      "name": "Alice",
      "id": 1,
      "activity": "Basketball",
      "cost": "$100"
    },
    {
      "name": "Bob",
      "id": 2,
      "activity": "Soccer",
      "cost": "$150"
    }
  ]
}
```

### Unstructured Data

어떠한 Rule 이 존재하지 않는데, 예를들어, `.pdf`, `.jpg`, `.mp4` 같은 Binary 데이터를 말한다.