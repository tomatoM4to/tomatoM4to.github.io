---
title: "프로그래머스 코딩테스트 MySQL Lv1"
description: "프로그래머스 코딩테스트 MySQL Lv1 문제 풀이 전체 정리"
date: "2023-02-18"
keywords: "SQL, Database"
---

## 가장 비싼 상품 구하기
2023-02-18
```sql
SELECT MAX(price) AS 'MAX_PRICE' FROM product
```

## 동물의 아이디와 이름
2023-02-18
```sql
SELECT ANIMAL_ID, NAME FROM ANIMAL_INS ORDER BY ANIMAL_ID
```

## 어린 동물 찾기
2023-02-18
```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE INTAKE_CONDITION != "Aged"
```

## 아픈 동물 찾기
2023-02-18
```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE INTAKE_CONDITION = "Sick";
```

## 역순 정렬하기
2023-02-18
```sql
SELECT NAME, DATETIME
FROM ANIMAL_INS
ORDER BY ANIMAL_ID DESC
```

## 모든 레코드 조회하기
2023-02-18
```sql
SELECT * from animal_ins
```

## 상위 n개 레코드
2023-02-18
```sql
SELECT name
FROM ANIMAL_INS
ORDER BY datetime
LIMIT 1
```

## 여러 기준으로 정렬하기
2023-02-18
```sql
SELECT animal_id, name, datetime
from animal_ins
order by name, datetime desc
```

## 최댓값 구하기
2023-02-18
```sql
SELECT MAX(datetime) FROM ANIMAL_INS
```
## 강원도에 위치한 생산공장 목록 출력하기
2023-02-18
```sql
select FACTORY_ID, FACTORY_NAME, ADDRESS from FOOD_FACTORY
where ADDRESS like '강원도%'
order by  FACTORY_ID
```

## 인기있는 아이스크림
2023-02-18
```sql
SELECT flavor
FROM first_half
ORDER BY total_order DESC, shipment_id
```
## 이름이 있는 동물의 아이디
2023-02-19
```sql
SELECT animal_id
FROM animal_ins
WHERE name IS NOT NULL
ORDER BY animal_id
```

## 이름이 없는 동물의 아이디
2023-02-19
```sql
SELECT animal_id
FROM animal_ins
WHERE name IS NULL
ORDER BY animal_id
```


## 조건에 맞는 도서 리스트 출력하기
2023-02-21
```sql
SELECT BOOK_ID, date_format(PUBLISHED_DATE, '%Y-%m-%d')
From book
Where CATEGORY = '인문' And '2021-01-01' <= PUBLISHED_DATE and PUBLISHED_DATE < '2022-01-01'
Order by PUBLISHED_DATE
```

## 평균 일일 대여 요금 구하기
2023-02-21
```sql
SELECT round(avg(DAILY_FEE)) from CAR_RENTAL_COMPANY_CAR where CAR_TYPE = 'SUV'
```
## 12세 이하인 여자 환자 목록 출력하기
2023-02-21
```sql
SELECT PT_NAME, PT_NO, GEND_CD, AGE, ifnull(tlno, 'NONE')
FROM PATIENT
WHERE AGE <= 12 and gend_cd = 'W'
ORDER BY AGE desc, pt_name
```

## 흉부외과 또는 일반외과 의사 목록 출력하기
2023-02-21
```sql
SELECT dr_name, dr_id, mcdp_cd, date_format(hire_ymd, '%Y-%m-%d')
FROM doctor
WHERE MCDP_CD = "CS" OR MCDP_CD = "GS"
ORDER BY hire_ymd DESC, dr_name
```

## 과일로 만든 아이스크림 고르기
2023-02-22
```sql
SELECT FIRST_HALF.FLAVOR
FROM FIRST_HALF LEFT JOIN ICECREAM_INFO ON FIRST_HALF.flavor = ICECREAM_INFO.flavor
WHERE TOTAL_ORDER >= 3000 AND ICECREAM_INFO.INGREDIENT_TYPE = 'fruit_based'
ORDER BY TOTAL_ORDER DESC
```

## 조건에 맞는 회원수 구하기
2023-02-22
```sql
SELECT COUNT(*) AS 'USERS'
FROM user_info
WHERE joined LIKE "2021%"
AND 20 <= age AND age < 30
```

```sql
SELECT COUNT(*) AS 'USERS'
FROM user_info
WHERE '2021-01-01' <= joined AND joined < '2022-01-01'
AND age BETWEEN 20 AND 29
```

## 나이 정보가 없는 회원 수 구하기
2023-02-22
```sql
SELECT COUNT(*) AS 'USERS'
FROM user_info
WHERE age IS NULL
```

## 경기도에 위치한 식품창고 목록 출력하기
2023-02-23
```sql
# 2024-02-03
SELECT
    main.warehouse_id,
    main.warehouse_name,
    main.address,
    CASE
        WHEN main.freezer_yn IS NULL THEN "N"
        ELSE main.freezer_yn
    END AS FREEZER_YN
FROM
    food_warehouse main
WHERE
    main.address LIKE "%경기도%"
ORDER BY
    main.warehouse_id
```

```sql
SELECT WAREHOUSE_ID, WAREHOUSE_NAME, ADDRESS, IFNULL(FREEZER_YN, 'N')
FROM FOOD_WAREHOUSE
WHERE ADDRESS LIKE '경기도%'
```

## 자동차 대여 기록에서 장기/단기 대여 구분하기
2024-02-06
```sql
SELECT
    main.history_id,
    main.car_id,
    DATE_FORMAT(main.start_date, "%Y-%m-%d"),
    DATE_FORMAT(main.end_date, "%Y-%m-%d"),
    CASE
        WHEN
            DATEDIFF(main.end_date, main.start_date) + 1 >= 30 THEN "장기 대여"
        ELSE
            "단기 대여"
    END AS RENT_TYPE
FROM
    car_rental_company_rental_history main
WHERE
    main.start_date LIKE "2022-09%"
ORDER BY
    main.history_id DESC
```


## 특정 옵션이 포함된 자동차 리스트 구하기
2024-02-08
```sql
SELECT *
FROM CAR_RENTAL_COMPANY_CAR
WHERE OPTIONS LIKE '%네비게이션%'
ORDER BY CAR_ID DESC
```