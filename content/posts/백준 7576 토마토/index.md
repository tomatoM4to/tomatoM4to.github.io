---
title: "백준 7576 토마토"
description: "[골드5] 백준 7576번 토마토, BFS, 그래프, Python"
date: "2021-08-30"
keywords: "백준"
---

> [https://www.acmicpc.net/problem/7576](https://www.acmicpc.net/problem/7576)

격자위의 BFS 문제는 많이 나오는 주제이기도 하고 기본 패턴이 정해져 있어 반드시 한번쯤은 풀어보고 구조를 외워두는것이 좋다.

기본 아이디어는 익은 토마토를 모두 큐에 넣어두고, 하나씩 꺼내면서 주변의 익지 않은 토마토들이 있다면 `+1` 을 해주고, 다시 큐에 넣어주는 방식이다.

```python
import sys
import collections
a, b = map(int, sys.stdin.readline().split())

data = []
for i in range(b):
    data.append(list(map(int,sys.stdin.readline().split())))

check = collections.deque([])
for y in range(b):
    for x in range(a):
        if data[y][x] == 1:
            check.append([y,x])

while check:
    y, x = check.popleft()
    dy = [0, 0, -1, 1]
    dx = [-1, 1, 0, 0]
    for p in range(0, 4):
        ay = y +dy[p]
        ax = x +dx[p]
        if 0 <= ay <= (b-1) and 0 <= ax <= (a-1) and data[ay][ax] == 0:
            data[ay][ax] = data[y][x] +1
            check.append([ay,ax])
answ = 0
for i in data:
    for j in i:
        if j==0:
            print(-1)
            exit(0)
    answ = max(answ,max(i))
print(answ-1)
```