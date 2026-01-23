---
title: "백준 14500 테트로미노"
description: "[골드4] 백준 14500번 테트로미노, 브루트포스, 구현, cpp"
date: "2026-01-24"
keywords: "백준, cpp"
---

뇌는 약한놈들이나 쓰는것

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