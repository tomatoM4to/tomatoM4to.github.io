---
title: "백준 14500 테트로미노"
description: "[삼성 SW 역량 테스트 기출 문제][골드4] 백준 14500번 테트로미노, 브루트포스, 구현, cpp"
date: "2026-01-24"
keywords: "백준, cpp"
---

> [https://www.acmicpc.net/problem/14500](https://www.acmicpc.net/problem/14500)

dfs 를 통해 깔끔하게 푸는 방법도 있지만 모든 도형을 일일이 정의하고 완탐 돌려도 5,000,000 연산 정도만 하면 되기 때문에 충분히 통과할 수 있다.

가능한 모든 도형은 19가지고 아래처럼 생겼으니 디버깅할 때 참고해보자

```
[ 1. I-Shape & O-Shape (3가지) ]

■ ■ ■ ■     ■       ■ ■
            ■       ■ ■
            ■
            ■


[ 2. L-Shape & J-Shape (8가지) ]

■       ■ ■ ■     ■ ■         ■        ■       ■         ■ ■     ■ ■ ■
■       ■           ■     ■ ■ ■        ■       ■ ■ ■     ■           ■
■ ■                 ■                ■ ■                 ■


[ 3. S-Shape & Z-Shape (4가지) ]

  ■ ■     ■       ■ ■        ■
■ ■       ■ ■       ■ ■    ■ ■
            ■              ■


[ 4. T-Shape (4가지) ]

■ ■ ■      ■        ■      ■
  ■      ■ ■      ■ ■ ■    ■ ■
           ■               ■
```

```cpp
#include <bits/stdc++.h>

using namespace std;

int N, M, ans = 0;
vector<vector<int>> m;

void solve(vector<int> &dy, vector<int> &dx) {
    for (int y = 0; y < N; y++) {
        for (int x = 0; x < M; x++) {
            int a = m[y][x];
            for (int i = 0; i < 3; i++) {
                int ny = y + dy[i];
                int nx = x + dx[i];
                if (0 <= ny and ny < N and 0 <= nx and nx < M) {
                    a += m[ny][nx];
                }
            }
            ans = max(ans, a);
        }
    }
}


int main() {
    cin >> N >> M;

    int a;
    for (int i = 0; i < N; i++) {
        m.push_back(vector<int>());
        for (int t = 0; t < M; t++) {
            cin >> a;
            m[i].push_back(a);
        }
    }
    // ㅡ
    vector<int> dy = {0, 0, 0};
    vector<int> dx = {1, 2, 3};
    solve(dy, dx);

    dy = {1, 2, 3};
    dx = {0, 0, 0};
    solve(dy, dx);

    // ㅁ
    dy = {0, 1, 1};
    dx = {1, 0, 1};
    solve(dy, dx);

    // ㄴ, 90도씩 회전
    dy = {1, 2, 2};
    dx = {0, 0, 1};
    solve(dy, dx);

    dy = {0, 0, 1};
    dx = {1, 2, 0};
    solve(dy, dx);

    dy = {0, 1, 2};
    dx = {1, 1, 1};
    solve(dy, dx);

    dy = {0, 0, -1};
    dx = {1, 2, 2};
    solve(dy, dx);

    // 대칭, 90도씩 회전
    dy = {1, 2, 2};
    dx = {0, 0, -1};
    solve(dy, dx);

    dy = {-1, 0, 0};
    dx = {0, 1, 2};
    solve(dy, dx);

    dy = {0, 1, 2};
    dx = {1, 0, 0};
    solve(dy, dx);

    dy = {0, 0, 1};
    dx = {1, 2, 2};
    solve(dy, dx);

    // ㅗ
    dy = {0, -1, 0};
    dx = {-1, 0, 1};
    solve(dy, dx);

    // ㅜ
    dy = {0, 1, 0};
    dx = {-1, 0, 1};
    solve(dy, dx);

    // ㅓ
    dy = {-1, 0, 1};
    dx = {0, -1, 0};
    solve(dy, dx);

    // ㅏ
    dy = {-1, 0, 1};
    dx = {0, 1, 0};
    solve(dy, dx);

    // etc
    dy = {-1, 0, 1};
    dx = {0, 1, 1};
    solve(dy, dx);

    dy = {0, -1, -1};
    dx = {1, 1, 2};
    solve(dy, dx);

    // etc 대칭
    dy = {0, -1, 1};
    dx = {1, 1, 0};
    solve(dy, dx);

    dy = {0, 1, 1};
    dx = {1, 1, 2};
    solve(dy, dx);

    cout << ans;
    return 0;
}
```