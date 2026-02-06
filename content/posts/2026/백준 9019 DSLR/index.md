---
title: "백준 9019 DSLR"
description: "[골드4] 백준 9019번 DSLR, 그래프 이론, 그래프 탐색, bfs, 역추적, cpp"
date: "2026-01-19"
keywords: "백준, cpp"
---

> [https://www.acmicpc.net/problem/9019](https://www.acmicpc.net/problem/9019)

`L`, `R` 커멘드를 최적화 하기 위한 수학적 아이디어가 핵심인 문제

```cpp
#include <bits/stdc++.h>

using namespace std;

int T, N, target;

struct Path {
    int before;
    string cal;
};

void solve() {
    cin >> N >> target;
    vector<bool> vis(10001, false);
    vector<Path> p(10001, {0, "0"});
    queue<int> q;

    q.push(N);
    vis[N] = 1;

    while (!q.empty()) {
        int node = q.front();
        q.pop();

        if (node == target) break;

        // D
        int a = node * 2 % 10000;
        if (!vis[a]) {
            q.push(a);
            vis[a] = true;
            p[a] = {node, "D"};
        }

        // S
        a = node == 0 ? 9999 : node - 1;
        if (!vis[a]) {
            q.push(a);
            vis[a] = true;
            p[a] = {node, "S"};
        }

        // L
        a = (node % 1000) * 10 + (node / 1000);
        if (!vis[a]) {
            q.push(a);
            vis[a] = true;
            p[a] = {node, "L"};
        }

        // R
        a = (node % 10) * 1000 + (node / 10);
        if (!vis[a]) {
            q.push(a);
            vis[a] = true;
            p[a] = {node, "R"};
        }
    }
    string ans = "";
    int n = target;
    while (n != N) {
        ans += p[n].cal;
        n = p[n].before;
    }
    reverse(ans.begin(), ans.end());
    cout << ans << "\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);
    cin >> T;
    while (T--) solve();
    return 0;
}
```