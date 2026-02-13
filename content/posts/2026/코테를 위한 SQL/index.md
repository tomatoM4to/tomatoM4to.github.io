---
title: "코테를 위한 SQL"
description: "코딩테스트를 준비하면서 자주 쓰이는 SQL 문법과 함수들을 정리한 글입니다. (MySQL 기준)"
date: "2026-02-13"
keywords: "SQL"
---

## SELECT & FROM & WHERE & AS
* `SELECT`: 조회할 컬럼을 지정, `*`를 사용하면 모든 컬럼을 조회
* `FROM`: 조회할 테이블을 지정, `SUBQUERY` or `JOIN` 을 사용할 수 있음
* `WHERE`: 조회할 데이터를 필터링, `AND`, `OR`, `NOT` 등의 논리 연산자와 비교 연산자(`=`, `!=`, `<`, `>`, `<=`, `>=`)를 사용할 수 있음
* `AS`: 컬럼 또는 테이블에 별칭(alias)을 지정, 가독성을 높이기 위해 자주 사용

```sql
SELECT column1, column2 AS alias_name, ...
FROM table_name
WHERE condition1 IS NOT NULL
    AND condition1 > 10
    AND condition2 = 'value'
```

> 프로그래밍 언어와는 다르게 `=` 등호는 하나만 사용

> `NULL` 값은 `IS NULL` 또는 `IS NOT NULL`로 비교해야 함

> `AS` 키워드는 생략 가능

## NULL & UNKNOWN
SQL 은 `TRUE` 와 `FALSE` 외에 `UNKNOWN` 이라는 **3중 논리값**을 가짐

**예시**
* `1 = 1` → `TRUE`
* `1 = 0` → `FALSE`
* `NULL = 1` → `UNKNOWN`
* `NULL = NULL` → `UNKNOWN`

외울 필요는 없고 **`NULL` 에 대한 비교 연산의 논리적 결과는 항상 `UNKNOWN`** 이라고 보면 됨

**`WHERE` 절은 `TRUE` 인 행만 반환**하기 때문에 `UNKNOWN` 값은 필터링 됨

따라서 반드시 `NULL` 값을 체크할 때는 `IS NULL` 또는 `IS NOT NULL` 을 사용해야 함

아래 문제는 프로그래머스 SQL 문제 [이름이 없는 동물의 아이디](https://school.programmers.co.kr/learn/courses/30/lessons/59039) 의 예시 답안

```sql
SELECT animal_id
FROM animal_ins
WHERE name IS NULL
ORDER BY animal_id
```

자주 사용되는 함수 `ifnull(expr, alt_value)`, `expr` 가 `NULL` 인 경우 `alt_value` 를 반환, 그렇지 않으면 `expr` 를 반환

아래 문제는 프로그래머스 SQL 문제 [경기도에 위치한 식품창고 목록 출력하기](https://school.programmers.co.kr/learn/courses/30/lessons/131114) 의 예시 답안

```sql
SELECT WAREHOUSE_ID, WAREHOUSE_NAME, ADDRESS, IFNULL(FREEZER_YN, 'N')
FROM FOOD_WAREHOUSE
WHERE ADDRESS LIKE '경기도%'
```

> `NULL` 은 테이블에 들어있는 데이터의 상태, `UNKNOWN` 은 논리 연산의 결과 값이라는 점에서 차이가 있음

> `UNKNOWN` 은 `TRUE` 도 `FALSE` 도 아니기 때문에, 논리 연산자(`AND`, `OR`, `NOT`) 에서 주의가 필요함
> 1. `TRUE and UNKNOWN` → `UNKNOWN`
> 2. `FALSE and UNKNOWN` → `FALSE`
> 3. `UNKNOWN and UNKNOWN` → `UNKNOWN`
> 4. `TRUE or UNKNOWN` → `TRUE`
> 5. `FALSE or UNKNOWN` → `UNKNOWN`
> 6. `UNKNOWN or UNKNOWN` → `UNKNOWN`
> 7. `NOT UNKNOWN` → `UNKNOWN`
>
> 주의고 뭐고 `NULL` 연산은 버그로 취급하고 아예 이런일이 없도록 하는게 제일 좋음

## ORDER BY & LIMIT & OFFSET
* `ORDER BY`: 조회된 데이터를 정렬. 기본값은 오름차순(ASC), 내림차순은 DESC를 명시해야 함. 쉼표(,)로 구분하여 여러 조건으로 다중 정렬 가능
* `LIMIT`: 출력할 행(Row)의 개수를 제한. 코딩 테스트에서 '가장 비싼 제품 3개' 등을 조회할 때 사용
* `OFFSET`: 조회할 행(row)의 시작 위치를 지정, `LIMIT` 과 함께 사용하여 페이지네이션 구현 가능

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition = 'value'
ORDER BY column1 DESC, column2 ASC  -- column1 기준 내림차순, column2 기준 오름차순 정렬
LIMIT 10 OFFSET 20                  -- 21~ 30 row 조회
```

## GROUP BY & HAVING

## 집계 함수(Aggregate Function)

## JOIN