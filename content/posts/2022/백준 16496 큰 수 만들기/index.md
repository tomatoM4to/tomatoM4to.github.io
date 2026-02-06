---
title: "백준 16496 큰 수 만들기"
description: "[플래티넘5] 백준 16496번 큰 수 만들기, 그리디, 정렬, Python"
date: "2022-06-08"
keywords: "백준, Python"
---

> [https://www.acmicpc.net/problem/16496](https://www.acmicpc.net/problem/16496)

버블 소트 응용 문제

```python
from sys import stdin

input = stdin.readline

def main():
    N = int(input())
    arr = list(input().split())

    for i in range(N-1, -1, -1):
        for j in range(i):
            if int(arr[j] + arr[j+1]) < int(arr[j+1] + arr[j]):
                arr[j], arr[j+1] = arr[j+1], arr[j]

    print(int("".join(arr)))
main()
```