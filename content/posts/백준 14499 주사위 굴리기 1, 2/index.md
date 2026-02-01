---
title: "백준 14499 주사위 굴리기 1, 2"
description: "[삼성 SW 역량 테스트 기출 문제][골드4] 백준 14499번 주사위 굴리기, [골드3] 백준 23288번 주사위 굴리기 2, 구현, 그래프 이론, 그래프 탐색, 시뮬레이션, bfs"
date: "2026-01-29"
keywords: "백준, cpp"
---

## 백준 14499 주사위 굴리기

> [https://www.acmicpc.net/problem/14499](https://www.acmicpc.net/problem/14499)

`deque` 를 매 턴마다 재할당 하는게 좀 아쉽긴 한데 코드가 훨씬 직관적이라 이렇게 풀었다.

문제 설명에 `x` 와 `y` 좌표가 좀 헷갈리게 나와있는데 그냥 `cin >> y >> x` 로 받으면 된다.

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

## 주사위 굴리기 2

> [https://www.acmicpc.net/problem/23288](https://www.acmicpc.net/problem/23288)

주사위 전개도를 보며 **방향에 맞게 주사위를 정확히 굴렸는지 확인**하면서 문제를 풀어야 한다.

해당 문제에서 위 코드의 `move` 함수를 사용하면 마지막 테케에서 틀렸다고 나온다. 이유는 `move` 함수가 문제에서 요구하는 주사위의 방향과 반대로 굴리기 때문인데 그냥 간단히 숫자 매핑을 바꿔주면 된다. (동쪽으로 굴리면 실제론 서쪽으로 구르고, 북쪽으로 굴리면 남쪽으로 구르는 식)

나중에 알았는데 이 반대로 굴리는 `move` 함수를 위 문제에 그대로 사용해도 정답이 나온다? 흠.. 문제도 명확하지 않은게 테케도 충분하지 않나? 좋은 문제는 아닌거 같아 **삼성 SW 역량 테스트 기출 문제집** 이거 다 풀려고 하는거 아니면 굳이 시간 낭비하지 말자.

```cpp
#include <bits/stdc++.h>

using namespace std;

int N, M, k, r = 1;
deque<int> dq;
vector<vector<int>> m, v(21, vector<int>(21, 0));
vector<vector<int>> dice = {
    {0, 2, 0},
    {4, 1, 3},
    {0, 5, 0},
    {0, 6, 0}
};

int bfs(int y, int x) {
    if (v[y][x] != 0) {
        return v[y][x];
    }
    queue<vector<int>> q;
    q.push({y, x});
    v[y][x] = -1;
    int check = m[y][x];

    int dy[] = {0, 0, -1, 1};
    int dx[] = {-1, 1, 0, 0};
    while (!q.empty()) {
        vector<int> node = q.front();
        q.pop();

        for (int i = 0; i < 4; i++) {
            int ny = node[0] + dy[i];
            int nx = node[1] + dx[i];
            if (0 <= ny and ny < N and 0 <= nx and nx < M) {
                if (m[ny][nx] == check and v[ny][nx] == 0) {
                    q.push({ny, nx});
                    v[ny][nx] = -1;
                }
            }
        }
    }

    int ans = 0;
    for (int i = 0; i < N; i++) {
        for (int t = 0; t < M; t++) {
            if (v[i][t] == -1) ans += check;
        }
    }
    for (int i = 0; i < N; i++) {
        for (int t = 0; t < M; t++) {
            if (v[i][t] == -1) v[i][t] = ans;
        }
    }
    return ans;
}

void move(int c) {
    // 동, 서
    if (c <= 2) {
        dq = {dice[1][1], dice[1][2], dice[3][1], dice[1][0]};
        if (c == 2) {
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
        if (c == 4) {
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
    cin >> N >> M >> k;

    int a;
    for (int i = 0; i < N; i++) {
        m.push_back(vector<int>());
        for (int t = 0; t < M; t++) {
            cin >> a;
            m[i].push_back(a);
        }
    }
    int y = 0;
    int x = 0;
    int ans = 0;
    int dy[] = {0, 0, -1, 1};
    int dx[] = {1, -1, 0, 0};
    for (int i = 0; i < k; i++) {
        // next
        int ny = y + dy[r - 1];
        int nx = x + dx[r - 1];
        // check
        if (!(0 <= ny and ny < N and 0 <= nx and nx < M)) {
            if (r == 1) r = 2;
            else if (r == 2) r = 1;
            else if (r == 3) r = 4;
            else if (r == 4) r = 3;
            ny = y + dy[r - 1];
            nx = x + dx[r - 1];
        }
        // move
        move(r);
        y = ny;
        x = nx;
        ans += bfs(y, x);
        // r update
        int A = dice[3][1];
        int B = m[y][x];
        if (A > B) {
            if (r == 1) r = 4;
            else if (r == 2) r = 3;
            else if (r == 3) r = 1;
            else if (r == 4) r = 2;
        }
        else if (A < B) {
            if (r == 1) r = 3;
            else if (r == 2) r = 4;
            else if (r == 3) r = 2;
            else if (r == 4) r = 1;
        }
    }
    cout << ans;
    return 0;
}
```