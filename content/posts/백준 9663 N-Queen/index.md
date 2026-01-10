---
title: "백준 9663 N-Queen"
description: "백준 9663번 N-Queen Python, cpp 코드"
date: "2022-04-22"
keywords: "백준"
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


2026 1월에 다시 풀어 봤는데.. AI 때문인가? 뭔가 실력이 줄어든 느낌

```cpp
#include <bits/stdc++.h>

using namespace std;

int N, ans = 0;
vector<int> arr_x, arr_y;

void queen(int y, int x) {
    arr_x[x] = 1;
    arr_y[x] = y;

    // break point
    if (y == N - 1) {
        ans++;
        arr_x[x] = 0;
        arr_y[x] = 0;
        return;
    }

    for (int i = 0; i < N; i++) {
        bool toggle = true;

        // x 좌표 체크
        if (arr_x[i] == 1) continue;
        // 다른 queen 과 공격할 수 없는지 체크
        for (int t = 0; t < N; t++) if (arr_x[t] == 1) {
            // queen 좌표
            int qy = arr_y[t];
            int qx = t;
            int dest_y = abs((y + 1) - qy);
            if (qx - dest_y == i || qx + dest_y == i) {
                toggle = false;
                break;
            }
        }
        if (toggle) queen(y + 1, i);
    }

    arr_x[x] = 0;
    arr_y[x] = 0;
}

int main() {
    cin >> N;
    for (int i = 0; i < N; i++) {
        arr_x.push_back(0);
        arr_y.push_back(0);
    }

    for (int i = 0; i < N; i++) {
        queen(0, i);
    }

    cout << ans;
    return 0;
}
```