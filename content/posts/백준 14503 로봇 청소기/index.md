---
title: "백준 14503 로봇 청소기"
description: "백준 14503 로봇 청소기 cpp 코드"
date: "2026-01-12"
keywords: "백준"
---

> [https://www.acmicpc.net/problem/14503](https://www.acmicpc.net/problem/14503)

동, 서, 남, 북 처리할때 버그가 많이 났던 문제.

```cpp
#include <bits/stdc++.h>

using namespace std;

int max_y, max_x, y, x, robot_state;
vector<vector<int>> arr;
queue<vector<int>> q;

void print() {
    int cnt = 0;
    for (int i = 0; i < max_y; i++) {
        for (int t = 0; t < max_x; t++) {
            if (arr[i][t] == -1) cnt++;
        }
    }
    cout << cnt << endl;
}

int main() {
    cin >> max_y >> max_x;
    cin >> y >> x >> robot_state;

    int a;
    for (int i = 0; i < max_y; i++) {
        arr.push_back({});
        for (int t = 0; t < max_x; t++) {
            cin >> a;
            arr[i].push_back(a);
        }
    }
    q.push({y, x});
    arr[y][x] = -1;

    int dy[] = {-1, 0, 1, 0};
    int dx[] = {0, 1, 0, -1};
    while (!q.empty()) {
        int cy = q.front()[0];
        int cx = q.front()[1];
        q.pop();
        bool toggle = false;
        for (int i = 0; i < 4; i++) {
            int ny = cy + dy[i];
            int nx = cx + dx[i];
            if (0 <= ny and ny < max_y and 0 <= nx and nx < max_x) {
                if (arr[ny][nx] == 0) toggle = true;
            }
        }

        // 주변에 청소할 칸이 있을 때
        if (toggle) {
            for (int i = 0; i < 4; i++) {
                robot_state--;
                if (robot_state == -1) robot_state = 3;
                int ny = cy + dy[robot_state];
                int nx = cx + dx[robot_state];
                if (0 <= ny and ny < max_y and 0 <= nx and nx < max_x) {
                    if (arr[ny][nx] == 0) {
                        q.push({ny, nx});
                        arr[ny][nx] = -1;
                        break;
                    }
                }
            }
        }
        // 주변에 청소할 칸이 없을 때
        else {
            int ny = cy + -dy[robot_state];
            int nx = cx + -dx[robot_state];
            if (0 <= ny and ny < max_y and 0 <= nx and nx < max_x) {
                if (arr[ny][nx] == -1) {
                    q.push({ny, nx});
                }
                else if (arr[ny][nx] == 1) {
                    print();
                    return 0;
                }
            }
        }
    }
    return 0;
}
```