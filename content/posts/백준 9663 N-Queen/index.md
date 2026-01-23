---
title: "백준 9663 N-Queen"
description: "[골드4] 백준 9663번 N-Queen, 백트래킹, 재귀, Python"
date: "2022-04-22"
keywords: "백준, Python"
---

> [https://www.acmicpc.net/problem/9663](https://www.acmicpc.net/problem/9663)

2차원 배열로 매번 전수탐색 하는 방식은 시간초과가 난다. 그래서 1차원 배열로 퀸의 위치를 저장하고, 재귀호출로 퀸을 놓을 수 있는지 체크하는 방식으로 구현했다.

```python
from sys import stdin

a = int(stdin.readline())
cnt = 0
lst = []

def dfs(x, y):
    global cnt, lst, a
    if y >= a:
        cnt += 1
        return

    for i, line in enumerate(lst):
        if line == x:
            return
        elif line - (y - i) == x:
            return
        elif line + (y - i) == x:
            return

    lst.append(x)
    for j in range(a):
        dfs(j, y + 1)
    lst.pop()



for i in range(a):
    dfs(i, 0)
    lst.clear()
print(cnt // a)
```
