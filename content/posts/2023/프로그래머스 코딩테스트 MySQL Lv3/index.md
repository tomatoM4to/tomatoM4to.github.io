---
title: "프로그래머스 코딩테스트 MySQL Lv3"
description: "프로그래머스 코딩테스트 MySQL Lv3 문제 풀이 전체 정리"
date: "2023-02-23"
keywords: "SQL, Database"
---

## 없어진 기록 찾기
2023-02-23
```sql
SELECT ANIMAL_OUTS.ANIMAL_ID, ANIMAL_OUTS.NAME
FROM ANIMAL_OUTS LEFT JOIN ANIMAL_INS ON ANIMAL_OUTS.ANIMAL_ID = ANIMAL_INS.ANIMAL_ID
WHERE ANIMAL_INS.NAME IS NULL AND ANIMAL_OUTS.NAME IS NOT NULL
ORDER BY ANIMAL_OUTS.ANIMAL_ID
```

## 있었는데요 없었습니다
2023-02-24

```sql
-- 코드를 입력하세요
SELECT ANIMAL_INS.ANIMAL_ID, ANIMAL_INS.NAME
FROM ANIMAL_INS LEFT JOIN ANIMAL_OUTS ON ANIMAL_INS.ANIMAL_ID = ANIMAL_OUTS.ANIMAL_ID
WHERE ANIMAL_INS.DATETIME > ANIMAL_OUTS.DATETIME
ORDER BY ANIMAL_INS.DATETIME
```

## 오랜 기간 보호한 동물(1)
2023-02-24
```sql
-- 코드를 입력하세요
SELECT ANIMAL_INS.NAME, ANIMAL_INS.DATETIME
FROM ANIMAL_INS LEFT JOIN ANIMAL_OUTS ON ANIMAL_INS.ANIMAL_ID = ANIMAL_OUTS.ANIMAL_ID
WHERE ANIMAL_OUTS.ANIMAL_TYPE IS NULL
ORDER BY ANIMAL_INS.DATETIME
LIMIT 3
```

## 헤비 유저가 소유한 장소
2023-03-02
```sql
SELECT ID, 	NAME, 	HOST_ID
FROM PLACES
WHERE HOST_ID IN (
    SELECT HOST_ID
    FROM PLACES
    GROUP BY HOST_ID
    HAVING COUNT(*) >= 2
)
ORDER BY ID
```

## 즐겨찾기가 가장 많은 식당 정보 출력하기
2024-01-01
```sql
select
    rest_info.food_type,
    rest_info.rest_id,
    rest_info.rest_name,
    rest_info.favorites
from
    rest_info
join
    (
        select
            food_type,
            max(favorites) as favorites
        from
            rest_info
        group by
            food_type
    ) as sub
on
    rest_info.food_type = sub.food_type
    and rest_info.favorites = sub.favorites
order by
    rest_info.food_type desc
```

## 조건에 맞는 사용자와 총 거래금액 조회하기
2024-01-02
```sql
SELECT
    board.writer_id,
    user.nickname,
    SUM(board.price)
FROM
    used_goods_board board
LEFT JOIN
    used_goods_user user
on
    board.writer_id = user.user_id
WHERE
    board.status = "DONE"
GROUP BY
    board.writer_id
HAVING
    SUM(board.price) >= 700000
ORDER BY
    SUM(board.price)
```


## 카테고리 별 도서 판매량 집계하기
2024-01-03
```sql
SELECT
    book.category,
    SUM(book_sales.sales)
FROM
    book
JOIN
    book_sales
ON
    book.book_id = book_sales.book_id
WHERE
    book_sales.sales_date like '2022-01%'
GROUP BY
    book.category
ORDER BY
    book.category
```

## 자동차 대여 기록에서 대여중 / 대여 가능 여부 구분하기
2024-01-27
```sql
SELECT
    main.car_id,
    if (sum(subQ.AVAILABILITY) > 0, "대여중", "대여 가능") as AVAILABILITY
FROM
    CAR_RENTAL_COMPANY_RENTAL_HISTORY main
LEFT JOIN
    (
        SELECT
            subCar.history_id,
            if (subCar.start_date <= "2022-10-16" AND "2022-10-16" <= subCar.end_date, 1, 0) as AVAILABILITY
        FROM
            CAR_RENTAL_COMPANY_RENTAL_HISTORY subCar
    ) as subQ
    ON
        main.history_id = subQ.history_id
GROUP BY
    main.car_id
ORDER BY
    main.car_id DESC
```

```sql
SELECT
    main.car_id,
    CASE
        WHEN
            main.car_id IN (
                SELECT
                    sub.car_id
                FROM
                    car_rental_company_rental_history sub
                WHERE
                     sub.start_date <= "2022-10-16" AND "2022-10-16" <= sub.end_date
                GROUP BY
                    sub.car_id
            ) THEN "대여중"
        ELSE
            "대여 가능"
    END as AVAILABILITY
FROM
    car_rental_company_rental_history main
GROUP BY
    main.car_id
ORDER BY
    main.car_id DESC
```

## 대여 횟수가 많은 자동차들의 월별 대여 횟수 구하기
2024-01-27
```sql
/* 2024-01-27 */
SELECT
    MONTH(main.start_date) as MONTH,
    main.car_id,
    COUNT(*) as RECORDS
FROM
    car_rental_company_rental_history as main
WHERE
    "2022-08-01" <= main.start_date AND main.start_date <= "2022-11-01" AND main.car_id IN (
        SELECT
            sub.car_id
        FROM
            car_rental_company_rental_history as sub
        WHERE
            "2022-08-01" <= sub.start_date AND sub.start_date <= "2022-11-01"
        GROUP BY
            sub.car_id
        HAVING
            COUNT(*) >= 5
    )
GROUP BY
    MONTH(main.start_date), main.car_id
ORDER BY
    MONTH(main.start_date), main.car_id DESC
```

## 조회수가 가장 많은 중고거래 게시판의 첨부파일 조회하기
2024-02-06
```sql
SELECT
    CONCAT("/home/grep/src/", main.board_id, "/", main.file_id, main.file_name, main.file_ext) as "FILE_PATH"
FROM
    used_goods_file main
WHERE
    main.board_id IN (
        SELECT
            sub.board_id
        FROM
            used_goods_board sub
        WHERE
            sub.views IN (
                SELECT
                    MAX(subsub.views)
                FROM
                    used_goods_board subsub
            )
    )
ORDER BY
    main.file_id DESC
```

## 조건에 맞는 사용자 정보 조회하기
2024-02-07
```sql
# 2024-02-07
SELECT
    main.user_id,
    main.nickname,
    CONCAT(main.city, " ", main.street_address1, " ", main.street_address2),
    CONCAT(
        SUBSTRING(main.tlno, 1, 3),
        "-",
        SUBSTRING(main.tlno, 4, 4),
        "-",
        SUBSTRING(main.tlno, 8, 4)
    )
FROM
    used_goods_user main
WHERE
    main.user_id IN (
        SELECT
            sub.writer_id
        FROM
            used_goods_board sub
        GROUP BY
            sub.writer_id
        HAVING
            COUNT(*) >= 3
    )
ORDER BY
    main.user_id DESC
```

## 대여 기록이 존재하는 자동차 리스트 구하기
2024-02-07
```sql
SELECT
    DISTINCT main.car_id
FROM
    car_rental_company_rental_history main
WHERE
    main.car_id IN (
        SELECT
            sub.car_id
        FROM
            car_rental_company_car sub
        WHERE
            sub.car_type LIKE "세단"
    )
AND
    main.start_date LIKE "%-10-%"
ORDER BY
    main.car_id DESC
```


## 조건별로 분류하여 주문상태 출력하기
2024-02-07
```sql
SELECT
    main.order_id,
    main.product_id,
    DATE_FORMAT(main.out_date, "%Y-%m-%d"),
    CASE
        WHEN
            main.out_date <= "2022-05-01"
        THEN
            "출고완료"
        WHEN
            main.out_date IS NULL
        THEN
            "출고미정"
        ELSE
            "출고대기"
    END AS "출고여부"
FROM
    food_order main
ORDER BY
    main.order_id
```

## 오랜 기간 보호한 동물(2)
2024-02-08
```sql
SELECT
    main.animal_id,
    main.name
FROM
    animal_ins main
LEFT JOIN
    animal_outs sub
ON
    main.animal_id = sub.animal_id
WHERE
    sub.datetime IS NOT NULL
ORDER BY
    DATEDIFF(sub.datetime, main.datetime) DESC
LIMIT
    2
```