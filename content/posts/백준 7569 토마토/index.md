---
title: "백준 7569 토마토 (3차원)"
description: "[골드5] 백준 7569번 토마토, BFS, 그래프, Python"
date: "2021-08-31"
keywords: "백준"
---

> [https://www.acmicpc.net/problem/7569](https://www.acmicpc.net/problem/7569)

3차원 격자 위에서의 BFS 문제, 헷갈린다면 `7576` 번 부터 풀어보자.

```python
import collections
import sys
import copy
a, b, c = map(int, sys.stdin.readline().split())

data = []
data_1 = []
for i in range(0, c):
    for t in range(0, b):
        data_1.append(list(map(int,sys.stdin.readline().split())))
    data.append(data_1[-b:])
#print(data)

# 익은토마토
check = collections.deque([])
for z in range(c):
    for y in range(b):
        for x in range(a):
            if data[z][y][x] == 1:
                check.append([z,y,x])
#print(check)

dz = [1, -1, 0, 0, 0, 0]
dy = [0, 0, 1, -1, 0, 0]
dx = [0, 0, 0, 0, 1, -1]
while check:
    z, y, x = check.popleft()
    for q in range(0, 6):
        az = z + dz[q]
        ay = y + dy[q]
        ax = x + dx[q]
        if 0 <= az <= (c-1) and 0 <= ay <= (b-1) and 0 <= ax <= (a-1) and data[az][ay][ax] == 0:
            data[az][ay][ax] = data[z][y][x] + 1
            check.append([az, ay, ax])
#print(data)

day = 0
for a in data:
    for s in a:
        for d in s:
            if d == 0:
                print(-1)
                exit(0)
        day = max(day, max(s))
print(day-1)
```