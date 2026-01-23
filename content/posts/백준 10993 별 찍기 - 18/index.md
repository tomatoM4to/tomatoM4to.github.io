---
title: "백준 10993 별 찍기 - 18"
description: "[골드3] 백준 10993번 별 찍기 - 18, 재귀, 분할 정복, Python"
date: "2021-10-28"
keywords: "백준, Python"
---

> [https://www.acmicpc.net/problem/10993](https://www.acmicpc.net/problem/10993)

별찍기 마스터

```python
from sys import stdin
from collections import deque

star = deque(['*', '***', '*****'])

def stars(star, t):
    t += 1
    count = len(star[-1])
    y = count - 1
    for i in range(len(star)):
        star[i] = "*" + (y * " ") + star[i] + (y * " ") + "*"
        y -= 2
    y = count - 2
    while y >= 1:
        star.append("*" + y*" " + "*")
        y -= 2
    star.append("*")
    star.appendleft("*"*(count*2 + 3))
    if t == a:
        return star
    star.reverse()
    return stars(star, t)


a = int(stdin.readline())
if a == 1:
    print("*")
    exit(0)
if a == 2:
    star.reverse()
    for i in range(3):
        print(" "*i + star[i])
    exit(0)

star = stars(star, 2)
if a % 2 == 1:
    star.reverse()
    t = len(star) - 1
    for i in range(len(star)):
        print(" "*(t - i) + star[i])
else:
    for i in range(len(star)):
        print(" "*i + star[i])
```