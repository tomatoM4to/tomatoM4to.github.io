---
title: "백준 4485 녹색 옷 입은 애가 젤다지?"
description: "[골드4] 백준 4485번 녹색 옷 입은 애가 젤다지?, 다익스트라, 그래프, Python"
date: "2022-05-26"
keywords: "백준"
---

> https://www.acmicpc.net/problem/4485

야숨 클리어 기념

```python
from sys import stdin
from heapq import heappush, heappop

inf = 9999999999999999999
input = stdin.readline

def di(graph, N):
    dy = [1, -1, 0, 0]
    dx = [0, 0, 1, -1]
    dist = [[inf for i in range(N)] for i in range(N)]
    heap = [(graph[0][0], (0, 0))]
    while heap:
        w, v = heappop(heap)
        y, x = v

        if dist[y][x] < w:
            continue

        for i in range(4):
            ny = y + dy[i]
            nx = x + dx[i]
            if 0 <= ny < N and 0 <= nx < N:
                vw = w + graph[ny][nx]
                if dist[ny][nx] > vw:
                    dist[ny][nx] = vw
                    heappush(heap, (vw, (ny, nx)))

    return dist[N-1][N-1]

def main():
    cnt = 1
    while 1:
        graph = []
        N = int(input())

        if N == 0:
            exit(0)

        for i in range(N):
            graph.append(list(map(int, input().split())))

        print("Problem {}: {}".format(cnt, di(graph, N)))
        cnt += 1
if __name__ == "__main__":
    main()
```