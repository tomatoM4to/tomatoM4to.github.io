---
title: "백준 9251 LCS, 백준 9252 LCS 2"
description: "[골드4] 백준 9251번 LCS, dp, 문자열, cpp [골드3] 백준 9252번 LCS 2, dp, 문자열, 역추적, cpp"
date: "2026-01-22"
keywords: "백준, cpp"
---

## LCS (Longest Common Subsequence)

> [https://www.acmicpc.net/problem/9251](https://www.acmicpc.net/problem/9251)

먼저 아래 dp 테이블을 선언하자.

| - | 0 | A | C | A | Y | K | P |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| C | 0 |   |   |   |   |   |   |
| A | 0 |   |   |   |   |   |   |
| P | 0 |   |   |   |   |   |   |
| C | 0 |   |   |   |   |   |   |
| A | 0 |   |   |   |   |   |   |
| K | 0 |   |   |   |   |   |   |

그리고 답이 되는 공통된 문자열만 숫자를 채워보자.

| - | 0 | A | C | A | Y | K | P |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| C | 0 |   | 1 |   |   |   |   |
| A | 0 | 1 |   | 2 |   |   |   |
| P | 0 |   |   |   |   |   | 3 |
| C | 0 |   | 2 |   |   |   |   |
| A | 0 |   |   | 3 |   |   |   |
| K | 0 |   |   |   |   | 4 |   |

답에 맞게 나머지 칸도 상,하,좌,우 규칙을 찾아가며 채워넣어 보면 아래의 결과가 나온다.

| - | 0 | A | C | A | Y | K | P |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| C | 0 | 0 | 1 | 1 | 1 | 1 | 1 |
| A | 0 | 1 | 1 | 2 | 2 | 2 | 2 |
| P | 0 | 1 | 1 | 2 | 2 | 2 | 3 |
| C | 0 | 1 | 2 | 2 | 2 | 2 | 3 |
| A | 0 | 1 | 2 | 3 | 3 | 3 | 3 |
| K | 0 | 1 | 2 | 3 | 3 | 4 | 4 |

해당 dp 테이블을 채우는 코드는 다음과 같다. 인풋이 2개가 주어지는데 해당 **데이터들의 길이가 다를수 있다는 점을 유의**하자 (이거 때문에 2시간 날림)

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);
    string a, b;
    cin >> a >> b;

    vector<vector<int>> dp(1001, vector<int>(1001, 0));
    a = "-" + a;
    b = "-" + b;

    int ans = 0;
    for (int i = 1; i < b.size(); i++) {
        for (int t = 1; t < a.size(); t++) {
            if (b[i] == a[t]) {
                dp[i][t] = dp[i-1][t-1] + 1;
            }
            else {
                dp[i][t] = max(dp[i-1][t], dp[i][t-1]);
            }
            ans = max(ans, dp[i][t]);
        }
    }
    cout << ans;
    return 0;
}
```

## LCS 2

> [https://www.acmicpc.net/problem/9252](https://www.acmicpc.net/problem/9252)

dp 테이블 이외에 path 를 추적하는 테이블을 하나 더 선언하여, dp 테이블을 채울 때마다 어느 방향에서 왔는지 기록해준다.

* `0` : 문자가 일치할 때, 이후 대각선으로 이동
* `-1` : 위에서 내려옴
* `1` : 왼쪽에서 넘어옴

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    string a, b;
    cin >> a >> b;

    vector<vector<int>> dp(1001, vector<int>(1001, 0));
    vector<vector<int>> path(1001, vector<int>(1001, 0));

    a = "-" + a;
    b = "-" + b;

    int ans = 0;
    for (int i = 1; i < b.size(); i++) {
        for (int t = 1; t < a.size(); t++) {
            if (b[i] == a[t]) {
                dp[i][t] = dp[i-1][t-1] + 1;
                path[i][t] = 0;
            }
            else {
                if (dp[i-1][t] > dp[i][t-1]) {
                    dp[i][t] = dp[i-1][t];
                    path[i][t] = -1;
                }
                else {
                    dp[i][t] = dp[i][t-1];
                    path[i][t] = 1;
                }
            }
            ans = max(ans, dp[i][t]);
        }
    }


    string s = "";
    int y = b.size() - 1;
    int x = a.size() - 1;
    while (s.size() != ans) {
        if (path[y][x] == 1) {
            x -= 1;
        }
        else if (path[y][x] == -1) {
            y -= 1;
        }
        else if (path[y][x] == 0) {
            s.push_back(b[y]);
            x -= 1;
            y -= 1;
        }
    }
    reverse(s.begin(), s.end());
    cout << ans << "\n" << s;
    return 0;
}
```