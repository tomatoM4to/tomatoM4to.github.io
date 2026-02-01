---
title: "백준 13460 구슬 탈출 2"
description: "[삼성 SW 역량 테스트 기출 문제][골드1] 백준 13460 번 구슬 탈출 2, 구현, 그래프 이론, 그래프 탐색, 시뮬레이션, bfs"
date: "2026-02-01"
keywords: "백준, cpp"
---

> [https://www.acmicpc.net/problem/13460](https://www.acmicpc.net/problem/13460)

최소 이동 횟수를 구하는 문제라 bfs 로 푸는게 정석이지만, 구현의 편의를 위해 dfs 로 풀었다.

핵심 아이디어
1. red, blue 구슬을 각각 2번씩 이동시킨다. (총 4번)
2. 함수가 실행하기 board 상태를 초기화 한다. (파란 구슬이 구명에 빠졌을시 바로 return 하기 위해)

```cpp
#include <bits/stdc++.h>

using namespace std;

int N, M, ans = 987654321;
vector<vector<char>> arr;
int dy[] = {0, 0, -1, 1};
int dx[] = {-1, 1, 0, 0};
struct Red {
    int y;
    int x;
};
struct Blue {
    int y;
    int x;
};

void dfs(Red red, Blue blue, int d, int cnt) {
    if (cnt > 10) return;

    // reset
    for (int y = 0; y < N; y++) {
        for (int x = 0; x < M; x++) {
            if (arr[y][x] == 'R' or arr[y][x] == 'B') arr[y][x] = '.';
        }
    }

    arr[red.y][red.x] = 'R';
    arr[blue.y][blue.x] = 'B';
    Red nred;
    Blue nblue;
    bool red_goal = false;
    bool redm = false, bluem = false;

    // red, blue, red, blue
    for (int _ = 0; _ < 2; _++) {
        int y = red.y;
        int x = red.x;
        while (!redm) {
            int ny = y + dy[d];
            int nx = x + dx[d];
            if (arr[ny][nx] == '#') {
                nred = {y, x};
                arr[red.y][red.x] = '.';
                arr[y][x] = 'R';
                if (!(y == red.y and x == red.x)) redm=true;
                break;
            }
            else if (arr[ny][nx] == 'B') {
                nred = {y, x};
                arr[red.y][red.x] = '.';
                arr[y][x] = 'R';
                break;
            }
            else if (arr[ny][nx] == 'O') {
                arr[red.y][red.x] = '.';
                red_goal = true;
                break;
            }
            y = ny;
            x = nx;
        }

        y = blue.y;
        x = blue.x;
        while (!bluem) {
            int ny = y + dy[d];
            int nx = x + dx[d];
            if (arr[ny][nx] == '#') {
                nblue = {y, x};
                arr[blue.y][blue.x] = '.';
                arr[y][x] = 'B';
                if (!(y == blue.y and x == blue.x)) bluem=true;
                break;
            }
            else if (arr[ny][nx] == 'R') {
                nblue = {y, x};
                arr[blue.y][blue.x] = '.';
                arr[y][x] = 'B';
                break;
            }
            else if (arr[ny][nx] == 'O') {
                return;
            }
            y = ny;
            x = nx;
        }
    }

    if (red_goal) {
        ans = min(cnt, ans);
        return;
    }

    for (int i = 0; i < 4; i++) {
        if (i != d) dfs(nred, nblue, i, cnt + 1);
    }
}

int main() {
    cin >> N >> M;

    string a;
    Red red;
    Blue blue;
    for (int i = 0; i < N; i++) {
        arr.push_back(vector<char>());
        cin >> a;
        for (int t = 0; t < M; t++) {
            if (a[t] == 'R') red = {i, t};
            if (a[t] == 'B') blue = {i, t};
            arr[i].push_back(a[t]);
        }
    }

    for (int i = 0; i < 4; i++) {
        dfs(red, blue, i, 1);
    }

    if (ans == 987654321) cout << -1;
    else cout << ans;
    return 0;
}
```