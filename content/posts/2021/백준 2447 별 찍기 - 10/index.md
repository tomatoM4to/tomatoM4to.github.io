---
title: "백준 2447 별 찍기 - 10"
description: "[골드5] 백준 2447번 별 찍기 - 10, 재귀, 분할 정복, Python"
date: "2021-08-14"
keywords: "백준, Python"
---

> [https://www.acmicpc.net/problem/2447](https://www.acmicpc.net/problem/2447)

재귀함수 배우기 전이라 반복문으로 풀었던 기억이..

```python
lst = ['***', '* *', '***']
main = []
a = int(input())
b = 3
c = 1
while a > b:

    if c == 1:
        for i in range(0, 3):
            for lsts in lst:
                main.append(lsts * 3)

        for jum in range(0, b):
            main[b + jum]  = main[b + jum][:b] + ' '*b + main[b + jum][b*2:]

        c = 0
        lst.clear()
    else:
        for i in range(0, 3):
            for j in main:
                lst.append(j * 3)

        for jum in range(0, b):
            lst[b + jum]  = lst[b + jum][:b] + ' '*b + lst[b + jum][b*2:]
        c = 1
        main.clear()
    b = b*3

if len(lst):
    for tt in lst:
        print(tt)
else:
    for jj in main:
        print(jj)
```