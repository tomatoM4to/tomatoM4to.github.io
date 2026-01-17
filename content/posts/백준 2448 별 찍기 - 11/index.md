---
title: "백준 2448 별 찍기 - 11"
description: "[골드4] 백준 2448번 별 찍기 - 11, 재귀, 분할 정복, Python"
date: "2021-10-24"
keywords: "백준"
---

> [https://www.acmicpc.net/problem/2448](https://www.acmicpc.net/problem/2448)

재귀함수를 이용하면 코드가 훨씬 간결해진다. (출력형식 주의)

```python
from sys import stdin


a = int(stdin.readline())

star = ["*****", "* *", "*"]

if a == 3:
    star = star[::-1]
    for i in range(1, 4):
        print(" "*(a-i) + star[i - 1] + " "*(a-i))
    exit(0)

def stars(star, count):
    star = star * 2
    for i in range(1, count + 1):
        star[i - 1] = star[i - 1] + " "*(2*i - 1) + star[i - 1]
    count *= 2
    if count == a:
        return star[::-1]
    return stars(star, count)

star = stars(star, 3)
for i in range(1, a + 1):
    print(" "*(a-i) + star[i - 1] + " "*(a-i))
```