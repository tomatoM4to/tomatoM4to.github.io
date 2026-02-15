---
title: "코테를 위한 SQL"
description: "코딩테스트를 준비하면서 자주 쓰이는 SQL 문법과 함수들을 정리한 글입니다. (MySQL 기준)"
date: "2026-02-13"
keywords: "SQL"
---

## SELECT & FROM & WHERE & AS
* `SELECT`: 조회할 컬럼(Column)을 지정, `*`를 사용하면 모든 컬럼(Column)을 조회
* `FROM`: 조회할 테이블을 지정, `SUBQUERY` or `JOIN` 을 사용할 수 있음
* `WHERE`: 조회할 데이터를 필터링, `AND`, `OR`, `NOT` 등의 논리 연산자와 비교 연산자(`=`, `!=`, `<`, `>`, `<=`, `>=`)를 사용할 수 있음
* `AS`: 컬럼(Column) 또는 테이블에 별칭(alias)을 지정, 가독성을 높이기 위해 자주 사용

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

> 컬럼(Column or 열) 은 테이블에서 특정 데이터 타입(숫자, 문자, 날짜 등)과 구조를 정의하는 가장 작은 저장 단위

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
* `OFFSET`: 조회할 행(row)의 시작 위치를 지정, `LIMIT` 과 함께 사용하여 **Pagination 구현 가능**

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition = 'value'
ORDER BY column1 DESC, column2 ASC  -- column1 기준 내림차순, column2 기준 오름차순 정렬
LIMIT 10 OFFSET 20                  -- 21~ 30 row 조회
```

## GROUP BY & HAVING

* `GROUP BY`: 특정 컬럼의 데이터를 기준으로 행을 그룹화함, 주로 집계 함수(`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`)와 함께 사용됨
* `HAVING`: `GROUP BY`로 그룹화된 데이터에 대한 조건을 지정, `WHERE` 절과 달리 집계 함수의 결과를 필터링할 때 사용됨

```sql
SELECT column1, COUNT(column2) AS count_val
FROM table_name
GROUP BY column1            -- 1. column1 기준으로 그룹화
HAVING COUNT(column2) >= 3  -- 2. 그룹화된 결과(집계 함수)에 필터링 적용
ORDER BY count_val DESC;    -- 3. 최종 결과 정렬
```

> `GROUP BY` 를 사용하면 해당 SQL 의 결과는 **그룹화의 기준이 되는 컬럼 이나 집계함수의 결과로만 구성된 행(Row) 들로 반환 해야 함**

> 잘 떠올려지지 않는다면 해당 순서로 동작한다고 생각해보자
> 1. `GROUP BY column1` : `column1`의 값을 Key로 삼아서 같은 Key를 가진 행(row)들을 작은 가상 테이블(버킷)들로 묶음
> 2. 결과를 반환하거나 `HAVING` 으로 조건을 걸어야 하는데, 행(row) 이 여러개인체로는 반환할 수 없으므로 집계함수(`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`) 를 사용해 그룹 안의 데이터를 하나의 값으로 축약 or 압축
> 3. 하나의 값으로 축약된 결과를 가지고 값을 반환하거나 `HAVING` 으로 조건을 걸어서 최종 결과를 반환


## 집계 함수(Aggregate Function)

여러 행(row) 의 값을 입력받아 **하나의 값을 반환하는 함수**, 보통 `GROUP BY` 절과 함께 사용되지만, `GROUP BY` 없이 전체 행(row) 에 대한 집계 결과를 반환할 수도 있음

```sql
SELECT
  COUNT(*) AS total_rows,        -- 1. NULL을 포함한 전체 행 수
  COUNT(score) AS valid_count,   -- 2. NULL을 제외한 행 수 (값이 있는 것만 셈)
  SUM(score) AS total_sum,       -- 3. NULL을 제외한 값들의 합계
  AVG(score) AS average_val,     -- 4. NULL을 제외한 평균 (합계 / valid_count)
  MIN(score) AS min_score        -- 5. NULL을 제외한 최소값
  MAX(score) AS max_score,       -- 6. NULL을 제외한 최대값
  MAX(reg_date) AS last_updated  -- 7. 가장 최근 날짜 (문자/날짜도 가능)
FROM student_scores;
```
* `COUNT(*)` 는 `NULL` 을 포함한 전체 행(row) 수를 반환, `COUNT(column)` 은 `NULL` 을 제외한 행(row) 수를 반환
* `SUM()`, `AVG()` 은 숫자만 가능
* `MIN()`, `MAX()` 는 숫자, 문자, 날짜 모두 가능

> 집계 함수는 `NULL` 을 기본적으로 무시함

> `AVG(column)`은 `NULL`인 행을 분모(나누는 수)에서도 뺌, ex) 데이터가 `[100, 50, NULL]` 이면 `AVG(score)` 는 `150 / 2 = 75` 가 됨
>
> 만약 `NULL` 을 `0` 으로 취급하고 싶다면 `AVG(IFNULL(score, 0))` 을 사용

## JOIN

두개 이상의 테이블에서 관련된 컬럼(Column)을 기준으로 행(row)을 결합하는 연산, 직관적으로 생각하면 **`FROM` 절에서 사용된 테이블에 다른 테이블을 우측으로 이어 붙이는 방식**

여러 종류의 `JOIN` 이 존재하지만, 코딩 테스트에서는 `INNER JOIN` 과 `LEFT JOIN` 만 알아도 충분

* `INNER JOIN`: 두 테이블에서 조인 조건을 만족하는 행(row)들만 반환, 조인 **조건을 만족하지 않는 행(row)은 결과에 포함되지 않음**
* `LEFT JOIN`: 왼쪽 테이블의 모든 행(row)을 반환, 오른쪽 테이블에서 조인 조건을 만족하는 행(row)이 있으면 해당 데이터를 함께 반환, **조인 조건을 만족하는 행(row)이 없으면 오른쪽 테이블의 컬럼은 `NULL` 값으로 채워져서 반환**

아래의 테이블을 예시로 `INNER JOIN` 과 `LEFT JOIN` 의 차이를 살펴보자

| user_id | user_name |
|---------|-----------|
| 1       | Alice     |
| 2       | Bob       |
| 3       | Charlie   |


| order_id | user_id | product_name |
|----------|---------|--------------|
| 101      | 1       | Laptop       |
| 102      | 2       | Smartphone   |
| 103      | 2       | Tablet       |

### `INNER JOIN`
```sql
SELECT u.user_id, u.user_name, o.product_name
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
```

**결과**
| user_id | user_name | product_name |
|---------|-----------|--------------|
| 1       | Alice     | Laptop       |
| 2       | Bob       | Smartphone   |
| 2       | Bob       | Tablet       |

> 1. `Bob`은 주문이 2건이라 결과도 2행으로 늘어남 (1:N 관계)
> 2. `Charlie`는 주문 내역이 없어서(매칭 안 됨) 결과에서 제외됨

### `LEFT JOIN`

```sql
SELECT u.user_id, u.user_name, o.product_name
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
```

**결과**
| user_id | user_name | product_name |
|---------|-----------|--------------|
| 1       | Alice     | Laptop       |
| 2       | Bob       | Smartphone   |
| 2       | Bob       | Tablet       |
| 3       | Charlie   | NULL         |

> 1. `Charlie`는 주문 내역이 없지만, `LEFT JOIN`이라 살아남음. 대신 빈 정보는 `NULL`로 채워짐.
> 2. 차집합(difference of sets): 이후 `WHERE` 절에서 `product_name IS NULL` 조건을 추가하면 주문이 없는 사용자만 조회할 수 있음 (`Charlie`만 조회됨)


## 서브쿼리(Subquery) & IN
SQL 은 쿼리의 결과를 마치 변수처럼 다른 쿼리에서 사용할 수 있음, 이 말은 쿼리문 안에 또 다른 쿼리문을 작성할 수 있다는 뜻이며, 이를 **서브쿼리(Subquery)** 라고 부름

그렇다고 해서 어디든 사용할 수 있는건 아니고 특정 위치에서만 사용할 수 있음
1. Scalar Subquery: `SELECT` 절에서 단일 값으로 반환되는 서브쿼리
2. Inline View: `FROM` 절에서 테이블처럼 사용할 수 있는 서브쿼리
3. Nested Subquery: `WHERE` 절에서 다른 쿼리의 조건으로 사용되는 서브쿼리

### Scalar Subquery
* `SELECT` 절에서 단일 값으로 반환되는 서브쿼리, **반드시 결과가 1행 1열이어야 함**
* 보통 다른 테이블의 값 하나(AVG, MAX, MIN 등 집계 함수의 결과)를 조회해서 메인 쿼리의 컬럼으로 사용하고 싶을 때 활용
* 아래 예시는 `users` 테이블에서 각 유저별 주문 수를 조회하는 쿼리문
```sql
SELECT
    u.user_name,
    (
        SELECT COUNT(*) FROM orders o WHERE o.user_id = u.user_id
    ) AS order_count -- 각 유저별 주문 수
FROM users u;
```

> 1. users 테이블에서 첫 번째 행(row)을 가져옴. (예: `Alice`)
> 2. 가져온 행의 `u.user_id` 값을 가지고 서브쿼리를 실행함. (WHERE o.user_id = 1) -> 결과: 5
> 3. `Alice`와 `5`를 합쳐서 결과 행 생성
> 4. 반복

> 상관 서브쿼리(correlated subquery) 라고도 불리는 형태로, 메인 쿼리의 컬럼을 참조하기 때문에 서브쿼리가 메인 쿼리의 각 행(row)마다 실행됨 (성능 이슈 주의)

### Inline View
* `FROM` 절에서 테이블처럼 사용할 수 있는 서브쿼리, 원본 테이블을 필터링 하거나 집계한 결과를 임시 테이블로 만들어서 메인 쿼리에서 활용할 때 사용, 반드시 하나의 테이블로 반환되어야 함

아래 예시는 `JOIN` 하기 전에 `orders` 테이블에서 유저별 총 주문 금액을 계산해서 가상의 테이블 B를 만든 다음, `users` 테이블과 조인하는 쿼리문
**Inline View는 반드시 별칭(alias)을 지정해야 함**
```sql
SELECT A.user_name, B.total_price
FROM users A
JOIN ( -- 가상의 테이블 B 생성
    SELECT user_id, SUM(price) as total_price
    FROM orders
    GROUP BY user_id
) B ON A.user_id = B.user_id;
```

> 1. `orders` 테이블을 `GROUP BY` 하여 집계함. -> 가상 테이블 `B` 생성 완료
> 2. `A` 테이블과 `B` 테이블을 `JOIN` 함.
> 3. 최종 결과 생성
>
> 괄호 안의 쿼리가 먼저 실행되어 가상테이블을 만들고, 그 뒤에 메인 쿼리가 붙는 가장 직관적인 형태의 서브쿼리

### Nested Subquery
* `WHERE` 절에서 다른 쿼리의 조건으로 사용되는 서브쿼리, 보통 `IN` 연산자와 함께 사용되어 서브쿼리의 결과에 포함되는 값을 필터링할 때 활용
* 보통 `IN`, `NOT IN`, `EXISTS`, `NOT EXISTS`, `=`, `>`, `<` 등의 연산자와 함께 사용됨

아래 예시는 `orders` 테이블에서 가격이 10000보다 큰 주문을 한 유저의 아이디와 이름을 조회하는 쿼리문

```sql
SELECT user_id, user_name
FROM users
WHERE user_id IN (
    SELECT user_id
    FROM orders
    WHERE product_price > 10000
);
```
> 1. `orders` 테이블에서 10000원 넘는 `user_id`를 모두 조회함. -> 결과 리스트 생성 (예: `[1, 3, 5]`)
> 2. `users` 테이블을 가져옴
> 3. `WHERE` 절에서 가져온 행(row) 의 `user_id`가 서브쿼리의 결과 리스트에 포함되는지 필터링
> 4. 최종 결과 생성
>
> 서브쿼리가 독립적인 비상관 서브쿼리로서, 서브쿼리가 딱 한 번 실행되고 그 결과가 메인 쿼리의 조건으로 사용됨


## Date & String 함수
