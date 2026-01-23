---
title: "백준 21608 상어 초등학교"
description: "[골드5] 백준 21608 상어 초등학교, 삼성 SW 역량 테스트 기출 문제, 시뮬레이션, 구현, cpp"
date: "2026-01-23"
keywords: "백준"
---

> [https://www.acmicpc.net/problem/21608](https://www.acmicpc.net/problem/21608)

학생들이 앉을 수 있는 모든 자리들을 `vector<vector<int>> arr;` 에 담아놓고 정렬을 통해 조건에 맞는 자리를 찾았다.

정렬 조건
1. `-love`: 인접한 칸 중에서 좋아하는 학생이 가장 많은 칸
2. `-empty`: 인접한 칸 중에서 빈 칸이 가장 많은 칸
3. `y`: 행의 번호가 가장 작은 칸
4. `x`: 열의 번호가 가장 작은 칸

```cpp
#include <bits/stdc++.h>

using namespace std;

int N;
vector<vector<int>> students, st(401);
vector<vector<int>> m(21, vector<int>(21, 0));

void seat(int idx) {
    vector<int> &v = students[idx];
    int dy[] = {0, 0, 1, -1};
    int dx[] = {1, -1, 0, 0};
    vector<vector<int>> arr;
    for (int y = 0; y < N; y++) {
        for (int x = 0; x < N; x++) {
            // 상하좌우 탐색
            if (m[y][x] != 0) continue;
            int love = 0;
            int empty = 0;
            for (int d = 0; d < 4; d++) {
                int ny = y + dy[d];
                int nx = x + dx[d];
                if (0 <= ny and ny < N and 0 <= nx and nx < N) {
                    if (m[ny][nx] == 0) empty++;
                    else {
                        auto it = find(v.begin(), v.end(), m[ny][nx]);
                        if (it != v.end()) love++;
                    }
                }
            }
            // love, empty 가 최댓값, 그 중 y 와 x 가 최소 기준으로 정렬
            arr.push_back({-love, -empty, y, x});
        }
    }
    sort(arr.begin(), arr.end());
    m[arr[0][2]][arr[0][3]] = v[0];
}

int main() {
    cin >> N;

    int a, b, c, d, e;
    for (int i = 0; i < N * N; i++) {
        cin >> a >> b >> c >> d >> e;
        students.push_back({a, b, c, d, e});
        st[a] = {b, c, d, e};
    }

    for (int i = 0; i < N * N; i++) {
        seat(i);
    }

    int ans = 0;
    int dy[] = {0, 0, -1, 1};
    int dx[] = {-1, 1, 0, 0};
    for (int y = 0; y < N; y++) {
        for (int x = 0; x < N; x++) {
            // 상하 좌우 탐색
            int good = 0;
            int students_id = m[y][x];
            vector<int> &a = st[students_id];
            for (int i = 0; i < 4; i++) {
                int ny = y + dy[i];
                int nx = x + dx[i];
                if (0 <= ny and ny < N and 0 <= nx and nx < N) {
                    // 만족도
                    for (int t = 0; t < 4; t++) {
                        if (m[ny][nx] == a[t]) good++;
                    }
                }
            }
            if (good == 1) ans += 1;
            if (good == 2) ans += 10;
            if (good == 3) ans += 100;
            if (good == 4) ans += 1000;
        }
    }
    cout << ans;
    return 0;
}
```