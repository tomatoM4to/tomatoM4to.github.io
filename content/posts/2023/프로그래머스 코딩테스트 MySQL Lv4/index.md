---
title: "프로그래머스 코딩테스트 MySQL Lv4"
description: "프로그래머스 코딩테스트 MySQL Lv4 문제 풀이 전체 정리"
date: "2023-02-24"
keywords: "SQL, Database"
---

## 보호소에서 중성화한 동물
2023-02-24

```sql
SELECT ANIMAL_INS.ANIMAL_ID, ANIMAL_INS.ANIMAL_TYPE, ANIMAL_INS.NAME
FROM ANIMAL_INS LEFT JOIN ANIMAL_OUTS ON ANIMAL_INS.ANIMAL_ID = ANIMAL_OUTS.ANIMAL_ID
WHERE ANIMAL_INS.SEX_UPON_INTAKE LIKE 'Intact%'
AND (ANIMAL_OUTS.SEX_UPON_OUTCOME LIKE 'Spayed%'
OR ANIMAL_OUTS.SEX_UPON_OUTCOME LIKE 'Neutered%')
ORDER BY ANIMAL_INS.ANIMAL_ID
```

## 5월 식품들의 총매출 조회하기
2023-02-24
```sql
-- 코드를 입력하세요
SELECT FOOD_PRODUCT.PRODUCT_ID,
FOOD_PRODUCT.PRODUCT_NAME,
FOOD_PRODUCT.PRICE * SUM(FOOD_ORDER.AMOUNT) AS TOTAL_SALES
FROM FOOD_PRODUCT LEFT JOIN FOOD_ORDER ON FOOD_PRODUCT.PRODUCT_ID = FOOD_ORDER.PRODUCT_ID
WHERE PRODUCE_DATE LIKE '2022-05%'
GROUP BY FOOD_PRODUCT.PRODUCT_ID
ORDER BY TOTAL_SALES DESC, FOOD_PRODUCT.PRODUCT_ID
```

## 우유와 요거트가 담긴 장바구니
2023-03-02

```sql
-- 코드를 입력하세요
SELECT CART_ID
FROM CART_PRODUCTS
WHERE CART_ID IN (
    SELECT CART_ID
    FROM CART_PRODUCTS
    WHERE NAME = 'Milk'
) AND CART_ID IN (
    SELECT CART_ID
    FROM CART_PRODUCTS
    WHERE NAME = 'Yogurt'
)
GROUP BY CART_ID
ORDER BY CART_ID
```

## 주문량이 많은 아이스크림들 조회하기
2023-03-04
```sql
-- 코드를 입력하세요
SELECT FIRST_HALF.FLAVOR
FROM FIRST_HALF LEFT JOIN JULY ON FIRST_HALF.FLAVOR = JULY.FLAVOR
GROUP BY FIRST_HALF.FLAVOR
ORDER BY SUM(FIRST_HALF.TOTAL_ORDER) + SUM(JULY.TOTAL_ORDER) DESC
LIMIT 3
```

## 입양 시각 구하기(2)
2023-03-04
```sql
SET @hour := -1;

SELECT (@hour := @hour + 1),
(
    SELECT COUNT(*)
    FROM ANIMAL_OUTS
    WHERE HOUR(DATETIME) = @hour
)
FROM ANIMAL_OUTS
WHERE @hour < 23
```

## 그룹별 조건에 맞는 식당 목록 출력하기
2023-03-04
```sql
SELECT MEMBER_NAME, REVIEW_TEXT, DATE_FORMAT(REVIEW_DATE, "%Y-%m-%d")
FROM REST_REVIEW JOIN MEMBER_PROFILE ON REST_REVIEW.MEMBER_ID = MEMBER_PROFILE.MEMBER_ID
WHERE REST_REVIEW.MEMBER_ID = (
    SELECT MEMBER_ID
    FROM REST_REVIEW
    GROUP BY MEMBER_ID
    ORDER BY COUNT(*) DESC
    LIMIT 1
)
ORDER BY DATE_FORMAT(REVIEW_DATE, "%Y-%m-%d"), REVIEW_TEXT
```

## 서울에 위치한 식당 목록 출력하기
2023-03-04
```sql
SELECT REST_INFO.REST_ID, REST_INFO.REST_NAME, REST_INFO.FOOD_TYPE, REST_INFO.FAVORITES, REST_INFO.ADDRESS, ROUND(AVG(REVIEW_SCORE), 2)
FROM REST_INFO JOIN REST_REVIEW ON REST_INFO.REST_ID = REST_REVIEW.REST_ID
WHERE ADDRESS LIKE '서울%'
GROUP BY REST_INFO.REST_ID
ORDER BY ROUND(SUM(REVIEW_SCORE) / COUNT(*), 2) DESC, REST_INFO.FAVORITES DESC
```

## 저자 별 카테고리 별 매출액 집계하기
2024-01-03
```sql
SELECT
    author.author_id,
    author.author_name,
    book.category,
    SUM(sales * PRICE)
FROM
    book
LEFT JOIN
    author
ON
    book.author_id = author.author_id
LEFT JOIN
    book_sales
ON
    book.book_id = book_sales.book_id
WHERE
    book_sales.sales_date LIKE '2022-01%'
GROUP BY
    author.author_name,
    author.author_id,
    book.category
ORDER BY
    author.author_id,
    book.category DESC
```

## 식품분류별 가장 비싼 식품의 정보 조회하기
2024-01-27
```sql
# 2024-01-27
SELECT
    main.category,
    subQ.maxprice,
    main.product_name
FROM
    food_product main
LEFT JOIN (
    SELECT
        sub.category,
        MAX(sub.price) as MAXPRICE
    FROM
        food_product sub
    GROUP BY
        sub.category
) as subQ
ON
    main.category = subQ.category
WHERE
    main.price = subQ.maxprice
AND
    (main.category LIKE '과자' OR
    main.category LIKE '국' OR
    main.category LIKE '김치' OR
    main.category LIKE '식용유')
ORDER BY
    subQ.maxprice DESC
```

## 년, 월, 성별 별 상품 구매 회원 수 구하기
2024-01-31
```sql
# 2024-01-31
# 쿼리 결과를 직접 써가면서 풀어야 할듯 하다..
SELECT
    YEAR(main.sales_date) as YEAR,
    MONTH(main.sales_date) as MONTH,
    subQ.gender as GENDER,
    COUNT(DISTINCT main.user_id) as USERS
FROM
    online_sale main
LEFT JOIN (
    SELECT
        sub.user_id,
        sub.gender
    FROM
        user_info sub
    WHERE
        sub.gender IS NOT NULL
) as subQ
ON
    main.user_id = subQ.user_id
WHERE
    subQ.gender IS NOT NULL
GROUP BY
    YEAR(main.sales_date), MONTH(main.sales_date), subQ.gender
ORDER BY
    YEAR(main.sales_date), MONTH(main.sales_date), subQ.gender
```

## 취소되지 않은 진료 예약 조회하기
2024-02-23
```sql
# 2024-02-23
SELECT
    main.apnt_no,
    patient.pt_name,
    patient.pt_no,
    main.mcdp_cd,
    doctor.dr_name,
    main.apnt_ymd
FROM
    appointment main
JOIN
    patient
ON
    patient.pt_no = main.pt_no
JOIN
    doctor
ON
    doctor.dr_id = main.mddr_id
WHERE
    main.apnt_ymd LIKE "2022-04-13%"
AND
    main.apnt_cncl_yn LIKE "N"
AND
    main.mcdp_cd LIKE "CS"
ORDER BY
    main.apnt_ymd
```

## 자동차 대여 기록 별 대여 금액 구하기
2024-02-23
```sql
# 2024-02-19
SELECT
    history.history_id,
    CASE
        WHEN
            DATEDIFF(history.end_date, history.start_date) + 1 < 7
        THEN
            (DATEDIFF(history.end_date, history.start_date) + 1) * car.daily_fee
        WHEN
            7 <= DATEDIFF(history.end_date, history.start_date) + 1 AND DATEDIFF(history.end_date, history.start_date) + 1 < 30
        THEN
            FLOOR((DATEDIFF(history.end_date, history.start_date) + 1) * (car.daily_fee * (
                SELECT
                    100 - discount.discount_rate
                FROM
                    car_rental_company_discount_plan discount
                WHERE
                    discount.car_type LIKE "트럭"
                AND
                    SUBSTRING(discount.duration_type, 1) LIKE "7%"
            ) / 100))
        WHEN
            30 <= DATEDIFF(history.end_date, history.start_date) + 1 AND DATEDIFF(history.end_date, history.start_date) + 1 < 90
        THEN
            FLOOR((DATEDIFF(history.end_date, history.start_date) + 1) * (car.daily_fee * (
                SELECT
                    100 - discount.discount_rate
                FROM
                    car_rental_company_discount_plan discount
                WHERE
                    discount.car_type LIKE "트럭"
                AND
                    SUBSTRING(discount.duration_type, 1) LIKE "3%"
            ) / 100))
        WHEN
            90 <= DATEDIFF(history.end_date, history.start_date) + 1
        THEN
            FLOOR((DATEDIFF(history.end_date, history.start_date) + 1) * (car.daily_fee * (
                SELECT
                    100 - discount.discount_rate
                FROM
                    car_rental_company_discount_plan discount
                WHERE
                    discount.car_type LIKE "트럭"
                AND
                    SUBSTRING(discount.duration_type, 1) LIKE "9%"
            ) / 100))
    END AS "FEE"
FROM
    car_rental_company_rental_history history
JOIN
    car_rental_company_car car
ON
    car.car_id = history.car_id
WHERE
    car.car_type LIKE "트럭"
ORDER BY
    FEE DESC, history.history_id DESC
```
