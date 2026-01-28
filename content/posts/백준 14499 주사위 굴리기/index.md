---
title: "백준 14499 주사위 굴리기"
description: "[삼성 SW 역량 테스트 기출 문제][골드4] 백준 14499번 주사위 굴리기, 시뮬레이션, 구현, cpp"
date: "2026-01-29"
keywords: "백준, cpp"
---

> [https://www.acmicpc.net/problem/14499](https://www.acmicpc.net/problem/14499)

`deque` 를 매 턴마다 재할당 하는게 좀 아쉽긴 한데 코드가 훨씬 직관적이라 이렇게 풀었다.

디버깅 할때 사용할 주사위 모양
```
==기준==
   [2]
[4][1][3]
   [5]
   [6]

==동쪽==
   [2]
[1][3][6]
   [5]
   [4]

==서쪽==
   [2]
[6][4][1]
   [5]
   [3]

==북쪽==
   [6]
[4][2][3]
   [1]
   [5]

==남쪽==
   [1]
[4][5][3]
   [6]
   [2]
```

```cpp
#include <bits/stdc++.h>

using namespace std;

int N, M, y, x, k;
deque<int> dq;
vector<vector<int>> m;
vector<vector<int>> dice = {
    {0, 0, 0},
    {0, 0, 0},
    {0, 0, 0},
    {0, 0, 0}
};

void move(int c) {
    // 동, 서
    if (c <= 2) {
        dq = {dice[1][1], dice[1][2], dice[3][1], dice[1][0]};
        if (c == 1) {
            dq.push_back(dq[0]);
            dq.pop_front();
        }
        else {
            dq.push_front(dq[3]);
            dq.pop_back();
        }
        dice[1][1] = dq[0];
        dice[1][2] = dq[1];
        dice[3][1] = dq[2];
        dice[1][0] = dq[3];
        return;
    }
    // 남, 북
    if (c > 2) {
        dq = {dice[1][1], dice[2][1], dice[3][1], dice[0][1]};
        if (c == 3) {
            dq.push_front(dq[3]);
            dq.pop_back();
        }
        else {
            dq.push_back(dq[0]);
            dq.pop_front();
        }
        dice[1][1] = dq[0];
        dice[2][1] = dq[1];
        dice[3][1] = dq[2];
        dice[0][1] = dq[3];
    }
}

int main() {
    cin >> N >> M >> y >> x >> k;

    int a;
    for (int i = 0; i < N; i++) {
        m.push_back(vector<int>());
        for (int t = 0; t < M; t++) {
            cin >> a;
            m[i].push_back(a);
        }
    }

    int dy[] = {0, 0, -1, 1};
    int dx[] = {1, -1, 0, 0};
    for (int i = 0; i < k; i++) {
        cin >> a;
        int ny = y + dy[a - 1];
        int nx = x + dx[a - 1];
        if (0 <= ny and ny < N and 0 <= nx and nx < M) {
            move(a);
            if (m[ny][nx] == 0) {
                m[ny][nx] = dice[1][1];
            }
            else {
                dice[1][1] = m[ny][nx];
                m[ny][nx] = 0;
            }
            cout << dice[3][1] << "\n";
            y = ny;
            x = nx;
        }
    }

    return 0;
}
```