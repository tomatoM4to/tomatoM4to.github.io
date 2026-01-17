---
title: "백준 14891 톱니바퀴"
description: "[골드5] 백준 14891번 톱니바퀴, 삼성 SW 역량 테스트 기출 문제, 시뮬레이션, 구현, cpp"
date: "2026-01-15"
keywords: "백준"
---

> https://www.acmicpc.net/problem/14891

삼성 코딩 테스트 기출 문제인 톱니바퀴 문제입니다.

```cpp
#include <bits/stdc++.h>

using namespace std;

int N;
vector<deque<int>> arr;
vector<int> a_lst = {0, 0, 0, 0};
vector<int> b_lst = {0, 0, 0, 0};

void solve(int ci, int di) {
    a_lst[ci] = 1;
    b_lst[ci] = di;
    for (int i = ci; i < 3; i++) {
        if (arr[i][2] != arr[i + 1][6] and a_lst[i] != 0) {
            a_lst[i + 1] = 1;
            b_lst[i + 1] = -b_lst[i];
        }
    }
    for (int i = ci; i > 0; i--) {
        if (arr[i][6] != arr[i - 1][2] and a_lst[i] != 0) {
            a_lst[i - 1] = 1;
            b_lst[i - 1] = -b_lst[i];
        }
    }
    for (int i = 0; i < 4; i++) if (a_lst[i] == 1) {
        // 반시계 방향
        if (b_lst[i] == -1) {
            int a = arr[i].front();
            arr[i].pop_front();
            arr[i].push_back(a);
        }
        // 시계 방향
        if (b_lst[i] == 1) {
            int a = arr[i].back();
            arr[i].pop_back();
            arr[i].push_front(a);
        }
    }
}

int main() {
    string s;
    for (int i = 0; i < 4; i++) {
        arr.push_back({});
        cin >> s;
        for (int t = 0; t < s.size(); t++) {
            if (s[t] == '1') arr[i].push_back(1);
            else if (s[t] == '0') arr[i].push_back(0);
        }
    }

    cin >> N;
    int a, b;
    for (int i = 0; i < N; i++) {
        cin >> a >> b;
        solve(a - 1, b);
        a_lst = {0, 0, 0, 0};
        b_lst = {0, 0, 0, 0};
    }

    int ans = 0;
    if (arr[0][0] == 1) ans += 1;
    if (arr[1][0] == 1) ans += 2;
    if (arr[2][0] == 1) ans += 4;
    if (arr[3][0] == 1) ans += 8;
    cout << ans;
    return 0;
}
```
