---
title: "프로그래머스 코딩테스트 MySQL Lv2"
description: "프로그래머스 코딩테스트 MySQL Lv2 문제 풀이 전체 정리"
date: "2023-02-22"
keywords: "SQL, Database"
---

## 조건에 맞는 도서와 저자 리스트 출력하기
2023-02-22
```sql
SELECT BOOK_ID, AUTHOR_NAME, DATE_FORMAT(PUBLISHED_DATE, '%Y-%m-%d')
FROM book LEFT JOIN author ON book.AUTHOR_ID = author.author_id
WHERE CATEGORY = '경제'
ORDER BY PUBLISHED_DATE
```

## 자동차 종류 별 특정 옵션이 포함된 자동차 수 구하기
2023-02-22
```sql
SELECT car_type AS 'CAR_TYPE' , COUNT(*) AS 'CARS'
FROM car_rental_company_car
WHERE OPTIONS LIKE '%통풍시트%'
OR OPTIONS LIKE '%열선시트%'
OR OPTIONS LIKE '%가죽시트%'
GROUP BY car_type
ORDER BY car_type
```

```sql
SELECT
    car_type,
    count(*)
FROM
    car_rental_company_car c
WHERE
    options REGEXP "통풍시트|열선시트|가죽시트"
GROUP BY
    car_type
ORDER BY
    car_type
```


## 상품 별 오프라인 매출 구하기
2023-02-23
```sql
SELECT PRODUCT_CODE, (PRICE * sum(SALES_AMOUNT)) AS 'SALES'
FROM PRODUCT LEFT JOIN OFFLINE_SALE ON PRODUCT.PRODUCT_ID = OFFLINE_SALE.PRODUCT_ID
GROUP BY PRODUCT_CODE
ORDER BY (PRICE * sum(SALES_AMOUNT)) DESC, PRODUCT_CODE
```

## 상품 별 오프라인 매출 구하기
2023-02-23
```sql
SELECT PRODUCT_CODE, (PRICE * sum(SALES_AMOUNT)) AS 'SALES'
FROM PRODUCT LEFT JOIN OFFLINE_SALE ON PRODUCT.PRODUCT_ID = OFFLINE_SALE.PRODUCT_ID
GROUP BY PRODUCT_CODE
ORDER BY (PRICE * sum(SALES_AMOUNT)) DESC, PRODUCT_CODE
```

## 3월에 태어난 여성 회원 목록 출력하기
2023-04-27
```sql
select MEMBER_ID, MEMBER_NAME, GENDER, DATE_FORMAT(DATE_OF_BIRTH, "%Y-%m-%d")
from MEMBER_PROFILE
where gender LIKE "W"
and DATE_OF_BIRTH like "%-03-%"
and tlno is NOT NULL
ORDER BY MEMBER_ID
```

## 재구매가 일어난 상품과 회원 리스트 구하기
2023-04-27
```sql
select USER_ID, PRODUCT_ID FROM ONLINE_SALE
GROUP BY user_id, product_id
HAVING COUNT(*) >= 2
order by user_id, product_id desc
```

## 자동차 종류 별 특정 옵션이 포함된 자동차 수 구하기
2024-01-22
```sql
SELECT
    car_type,
    count(*)
FROM
    car_rental_company_car c
WHERE
    options REGEXP "통풍시트|열선시트|가죽시트"
GROUP BY
    car_type
ORDER BY
    car_type
```

## 진료과별 총 예약 횟수 출력하기
2024-01-22
```sql
SELECT
    mcdp_cd as "진료과 코드",
    count(*) as "5월예약건수"
FROM
    appointment
WHERE
    apnt_ymd LIKE "2022-05-%"
GROUP BY
    mcdp_cd
ORDER BY
    COUNT(*), mcdp_cd
```

## 성분으로 구분한 아이스크림 총 주문량
2024-01-27
```sql
SELECT
    sub.ingredient_type,
    SUM(main.total_order)
FROM
    first_half main
LEFT JOIN
    icecream_info sub
ON
    main.flavor = sub.flavor
GROUP BY
    sub.ingredient_type
ORDER BY
    SUM(main.total_order)
```

## 동명 동물 수 찾기
2024-01-31
```sql
SELECT
    main.name,
    COUNT(*)
FROM
    animal_ins main
WHERE
    main.name != ""
GROUP BY
    main.name
HAVING
    COUNT(*) >= 2
ORDER BY
    main.name
```

## 고양이와 개는 몇 마리 있을까
2024-01-31
```sql
SELECT
    main.animal_type as ANIMAL_TYPE,
    COUNT(main.animal_type) as count
FROM
    animal_ins main
GROUP BY
    main.animal_type
ORDER BY
    main.animal_type
```

## 입양 시각 구하기(1)
2024-02-01
```sql
SELECT
    HOUR(main.datetime),
    COUNT(*)
FROM
    animal_outs main
WHERE
    9 <= HOUR(main.datetime) AND HOUR(main.datetime) < 20
GROUP BY
    HOUR(main.datetime)
ORDER BY
    HOUR(main.datetime)
```

## 가격이 제일 비싼 식품의 정보 출력하기
2024-02-03
```sql
SELECT
    *
FROM
    food_product main
ORDER BY
    main.price DESC
LIMIT
    1
```

## 동물 수 구하기
2024-02-03
```sql
SELECT count(*) from ANIMAL_INS
```

## 최솟값 구하기
2024-02-03
```sql
SELECT
    MIN(main.datetime)
FROM
    animal_ins main
```

## NULL 처리하기
2024-02-03
```sql
# 2024-02-03
SELECT
    main.animal_type,
    CASE
        WHEN main.name IS NULL THEN "No name"
        ELSE main.name
    END AS NAME,
    main.sex_upon_intake
FROM
    animal_ins main
ORDER BY
    main.animal_id
```

```sql
SELECT animal_type, IFNULL(name, 'No name'), sex_upon_intake
FROM animal_ins
ORDER BY animal_id
```

## 가격대 별 상품 개수 구하기
2024-02-03
```sql
SELECT
    (main.price DIV 10000) * 10000,
    COUNT(*)
FROM
    product main
GROUP BY
    main.price DIV 10000
ORDER BY
    main.price DIV 10000
```

## 중복 제거하기
2024-02-03
```sql
SELECT
    COUNT(DISTINCT main.name)
FROM
    animal_ins main
WHERE
    main.name IS NOT NULL
```

## 조건에 부합하는 중고거래 상태 조회하기
2024-02-07
```sql
# 2024-02-07
SELECT
    main.board_id,
    main.writer_id,
    main.title,
    main.price,
    CASE
        WHEN
            main.status = "DONE"
        THEN
            "거래완료"
        WHEN
            main.status = "SALE"
        THEN
            "판매중"
        ELSE
            "예약중"
    END
FROM
    used_goods_board main
WHERE
    main.created_date LIKE "2022-10-05"
ORDER BY
    main.board_id DESC
```

## 자동차 평균 대여 기간 구하기
2024-02-07
```sql
# DATEDIFF 연습좀 해야할듯;;
SELECT
    car_id,
    ROUND(AVG(DATEDIFF(main.end_date, main.start_date)) + 1, 1) AS "AVERAGE_DURATION"
FROM
    car_rental_company_rental_history main
GROUP BY
    main.car_id
HAVING
    # AVG(DATEDIFF(main.end_date, main.start_date)) + 1 >= 7
    AVERAGE_DURATION >= 7
ORDER BY
    AVERAGE_DURATION DESC, main.car_id DESC
```


## DATETIME에서 DATE로 형 변환
2024-02-08
```sql
SELECT animal_id, name, DATE_FORMAT(DATETIME, '%Y-%m-%d')
FROM animal_ins
ORDER BY animal_id
```

## 중성화 여부 파악하기
2024-02-08
```sql
SELECT
ANIMAL_ID,
NAME,
CASE
    WHEN SEX_UPON_INTAKE LIKE '%Neutered%' OR SEX_UPON_INTAKE LIKE '%Spayed%' THEN 'O'
    ELSE 'X'
END AS '중성화'
FROM ANIMAL_INS
ORDER BY animal_id
```

## 루시와 엘라 찾기
2024-02-08
```sql
# 흠.. 서브쿼리의 결과가 저런식으로 괄호쳐서 나오는거라고 생각하면 될듯 한데.. 맞는진 모르겠네
SELECT
    main.animal_id,
    main.name,
    main.sex_upon_intake
FROM
    animal_ins main
WHERE
    main.name IN ("Lucy", "Ella", "Pickle", "Rogan", "Sabrina", "Mitty")
ORDER BY
    main.animal_id
```

## 이름에 el이 들어가는 동물 찾기
2024-02-08
```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE LOWER(NAME) LIKE '%el%' AND ANIMAL_TYPE like 'Dog'
ORDER BY NAME
```

## 카테고리 별 상품 개수 구하기
2024-02-08
```sql
SELECT
    SUBSTRING(main.product_code, 1, 2) AS "CATEGORY",
    COUNT(*)
FROM
    product main
GROUP BY
    SUBSTRING(main.product_code, 1, 2)
ORDER BY
    SUBSTRING(main.product_code, 1, 2)
```

## 조건에 맞는 아이템들의 가격의 총합 구하기
2024-02-18
```sql
SELECT
    SUM(main.price) as "TOTAL_PRICE"
FROM
    item_info main
WHERE
    main.RARITY LIKE "LEGEND"
```