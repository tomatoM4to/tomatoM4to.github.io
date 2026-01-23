---
title: "백준 16940 BFS 스페셜 저지"
description: "[골드3] 백준 16940번 BFS 스페셜 저지, BFS, 그래프, Python"
date: "2022-05-04"
keywords: "백준, Python"
---

> [https://www.acmicpc.net/problem/16940](https://www.acmicpc.net/problem/16940)

BFS 이해도 검증하기 좋은 문제, 탐색할때 노드를 체크하는것도 중요하지만 q 에 넣는 순서도 고려해야 한다.

```python
from sys import stdin
from collections import deque

def bfs(x):
    global graph, visit, check
    visit[x] = 1
    q = deque([x])

    while q:
        node = q.popleft()
        for i in range(len(graph[node])-1):
            c = check.popleft()
            if c in graph[node]:
                visit[c] = 1
                q.append(c)
            else:
                print(0)
                exit(0)

N = int(stdin.readline())
graph = [[] for _ in range(N+1)]
graph[1].append(0)
visit = [0] * 100001
for i in range(N-1):
    x, y = map(int, stdin.readline().split())
    graph[x].append(y)
    graph[y].append(x)
check = deque(list((map(int, stdin.readline().split()))))
if check[0] != 1:
    print(0)
    exit(0)

bfs(check.popleft())
print(1)
```
