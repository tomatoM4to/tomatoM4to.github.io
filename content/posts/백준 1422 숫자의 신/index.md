---
title: "백준 1422 숫자의 신"
description: "[플래티넘4] 백준 1422번 숫자의 신, 그리디, 정렬, Python"
date: "2022-06-08"
keywords: "백준, Python"
---

> [https://www.acmicpc.net/problem/1422](https://www.acmicpc.net/problem/1422)

버블 소트 응용 문제

```python
from sys import stdin
from copy import deepcopy

input = stdin.readline

def main():
    N, K = map(int, input().split())
    arr = []
    for i in range(N):
        arr.append(input().strip("\n"))

    for i in range(N-1, -1, -1):
        for j in range(i):
            if int(arr[j] + arr[j+1]) < int(arr[j+1] + arr[j]):
                arr[j], arr[j+1] = arr[j+1], arr[j]

    num = str(max(map(int, arr))) * (K-N)

    ans = []
    for i in range(N):
        dummy = deepcopy(arr)
        dummy.insert(i, num)
        dummy = int("".join(dummy))
        ans.append(dummy)

    ans = max(ans)

    print(ans)

main()
```