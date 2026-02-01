---
title: "백준 18809 Gaaaaaaaaaarden"
description: "[골드1] 백준 18809 번 Gaaaaaaaaaarden, 구현, 그래프 이론, 브루트 포스 알고리즘, 그래프 탐색, 시뮬레이션, bfs, 백트래킹, python"
date: "2021-09-24"
keywords: "백준, python"
---

끔찍한 문제

```python
import sys
import collections
import itertools
import copy


row, column, red, green = map(int, sys.stdin.readline().split())

garden = []
for i in range(row):
    garden.append(list(map(int,sys.stdin.readline().split())))

copy_garden = garden[:]

# 배양액을 뿌릴수 있는 땅
solution = []
solution_append = solution.append
for y in range(row):
    for x in range(column):
        if garden[y][x] == 2:
            solution_append([y,x])


# 총 경우의 수
red_solution = collections.deque(itertools.combinations(solution, red))
bfs_green_solution = collections.deque([])
bfs_green_solution_append = bfs_green_solution.append
for i in red_solution:
    copy_solution = copy.deepcopy(solution)
    for t in i:
        copy_solution.remove(t)
    green_solution = collections.deque(itertools.combinations(copy_solution, green))
    bfs_green_solution_append(green_solution)

dy = [-1, 1, 0, 0]
dx = [0, 0, -1, 1]

stop_green = False
stop_red = False

flower_count = 10
first = True

a = []
append = a.append

new_grgr = collections.deque([])
new_copy_rd = collections.deque([])

new_grgr_append = new_grgr.append
new_copy_rd_append = new_copy_rd.append

while red_solution:
    rd = collections.deque(red_solution.popleft())
    gr = bfs_green_solution.popleft()

    while gr:
        grgr = collections.deque(gr.popleft())
        copy_rd = copy.deepcopy(rd)
        garden = copy.deepcopy(copy_garden)

        grgr_append = grgr.append
        copy_rd_append = copy_rd.append

        flower_count = 10

        for i in grgr:
            garden[i[0]][i[1]] = -1
        for n in copy_rd:
            garden[n[0]][n[1]] = -2
        while grgr or copy_rd:
            while grgr:
                gy, gx = grgr.popleft()
                if garden[gy][gx] % 10 == 0:
                    continue
                else:
                    for i in range(4):
                        new_gy = gy + dy[i]
                        new_gx = gx + dx[i]
                        if 0 <= new_gy < row and 0 <= new_gx < column:
                            if garden[new_gy][new_gx] == 1 or garden[new_gy][new_gx] == 2:
                                garden[new_gy][new_gx] = garden[gy][gx] - 2
                                new_grgr_append([new_gy, new_gx])

            while copy_rd:
                ry, rx = copy_rd.popleft()
                for i in range(4):
                    new_ry = ry + dy[i]
                    new_rx = rx + dx[i]
                    if 0 <= new_ry < row and 0 <= new_rx < column:
                        if garden[new_ry][new_rx] == 1 or garden[new_ry][new_rx] == 2:
                            garden[new_ry][new_rx] = garden[ry][rx] - 2
                            new_copy_rd_append([new_ry, new_rx])
                        elif garden[new_ry][new_rx] == garden[ry][rx] - 1:
                            garden[new_ry][new_rx] = flower_count
                            flower_count += 10

            while new_grgr:
                gy, gx = new_grgr.popleft()
                if garden[gy][gx] % 10 == 0:
                    continue
                else:
                    for i in range(4):
                        new_gy = gy + dy[i]
                        new_gx = gx + dx[i]
                        if 0 <= new_gy < row and 0 <= new_gx < column:
                            if garden[new_gy][new_gx] == 1 or garden[new_gy][new_gx] == 2:
                                garden[new_gy][new_gx] = garden[gy][gx] - 2
                                grgr_append([new_gy, new_gx])

            while new_copy_rd:
                ry, rx = new_copy_rd.popleft()
                for i in range(4):
                    new_ry = ry + dy[i]
                    new_rx = rx + dx[i]
                    if 0 <= new_ry < row and 0 <= new_rx < column:
                        if garden[new_ry][new_rx] == 1 or garden[new_ry][new_rx] == 2:
                            garden[new_ry][new_rx] = garden[ry][rx] - 2
                            copy_rd_append([new_ry, new_rx])
                        elif garden[new_ry][new_rx] == garden[ry][rx] - 1:
                            garden[new_ry][new_rx] = flower_count
                            flower_count += 10

        answ = 0
        for i in garden:
            answ = max(answ,max(i))
        append(answ)
print(max(a)//10)
```