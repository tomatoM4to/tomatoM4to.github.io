---
title: "코테를 위한 cpp STL 정리"
description: "코테(PS) 에서 자주 사용되는 C++ STL 정리, vector, queue, stack, set, map, string"
date: "2026-01-17"
keywords: "cpp"
---

## vector

```cpp
#include <vector>
using namespace std;

vector<int> v;          // int형 벡터 선언
vector<int> v1(5);      // 크기가 5인 int형 벡터 선언, 초기값은 0
vector<int> v2(5, 10);  // 크기가 5인 int형 벡터 선언, 초기값은 10

v.push_back(1);   // 벡터 뒤에 1 추가
v.pop_back();     // 벡터 뒤에 요소 제거
v.push_front(2);  // 벡터 앞에 2 추가, O(n)
v.pop_front();    // 벡터 앞에 요소 제거, O(n)
v.size();         // 벡터 크기 반환 (for loop 돌릴 때 자주 사용)

v.clear();      // 벡터 초기화, v = {}
v.resize(10);   // 벡터 크기를 10으로 조정, 비어있는 부분은 10으로 초기화
v.assign(5, 3); // 벡터를 크기 5, 값 3으로 초기화

v.empty();      // 비어있는지 확인

v.begin();      // 벡터의 시작 이터레이터 반환
v.end();        // 벡터의 끝(마지막 요소의 다음) 이터레이터 반환
*v.begin();     // 벡터의 첫 번째 요소 접근
*(--v.end());   // 벡터의 마지막 요소 접근
*v.end();       // error!

v.front();      // 벡터의 첫 번째 요소 반환, *v.begin() 과 동일
v.back();       // 벡터의 마지막 요소 반환, *(--v.end()) 과 동일

// v: {3, 3, 3, 3}
v.insert(v.begin() + 1, 1); // 벡터의 1번째 위치에 1 삽입
// v: {3, 1, 3, 3, 3}
v.erase(v.begin() + 1);     // 벡터의 1번째 위치 요소 제거
// v: {3, 3, 3, 3}
v.erase(v.begin() + 1, v.begin() + 3); // 벡터의 1번째부터 3번째 이전 위치 요소 제거
// v: {3, 3}
```

```cpp
#include <vector>
#include <algorithm>
using namespace std;

vector<int> v(5);                              // 크기 5인 벡터 선언
vector<vector<int>> graph(10, vector<int>());  // 2차원 벡터 선언


// 범위 기반 for-loop, 변수 수정 '불가', v: {0, 0, 0, 0, 0} (변화 없음)
for (int i: v) i = 1;

// 범위기반 for-loop, 변수 수정 '가능', v: {1, 1, 1, 1, 1}
for (int &i: v) i = 1;

// 인덱스 기반 for-loop, 변수 수정 '가능', v: {0, 1, 2, 3, 4}
for (int i = 0; i < v.size(); i++) v[i] = i;

// return type 이 iterator 이기에 *를 붙여줘야 함
int ma = *max_element(v.begin(), v.end()); // 벡터의 최댓값 반환, ma: 4
int mi = *min_element(v.begin(), v.end()); // 벡터의 최솟값 반환, mi: 0

sort(v.begin(), v.end()); // 오름차순 정렬

// 람다 함수를 이용한 내림차순 정렬
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;
}); // v: {4, 3, 2, 1, 0}

void swap(vector<int> a) {
    int tmp = a[0];
    a[0] = a[1];
    a[1] = tmp;
}
swap(v); // v: {4, 3, 2, 1, 0} (변화 없음)

void swap_ref(vector<int> &a) {
    int tmp = a[0];
    a[0] = a[1];
    a[1] = tmp;
}
swap_ref(v); // v: {3, 4, 2, 1, 0} (변화 있음)
```


> 1. vector는 동적 배열로, 크기가 자동으로 조절되는 편리한 배열, 메모리 재할당이 비효율 적인 방식으로 동작하니 주의
> 2. `resize` 를 사용하면 vector 이전 크기 이후 부분만 지정한 값으로 초기화됨, 전체 값을 초기화하려면 `assign` 사용
> 3. `end()` 는 마지막 요소 다음 위치를 가리키므로, 마지막 요소에 접근하려면 `--end()` or `back()` 을 사용해야 함
> 4. `vector` 와 같은 STL 컨테이너는 기본적으로 Call-by-Value 로 동작, Call-by-Reference 를 원할 경우 매개변수에 `&` 를 붙여야 함

## queue

```cpp
#include <queue>
using namespace std;

queue<int> q;   // int형 큐 선언
q.push(1);      // 큐에 1 추가
q.front();      // 큐의 앞 요소 반환
q.pop();        // 큐의 앞 요소 제거
q.size();       // 큐 크기 반환
q.empty();      // 큐가 비어있는지 확인
```

> 1. `front` 와 `pop` 으로 조회와 제거가 분리되어 있음
> 2. `clear` 함수가 없음, `while (!q.empty()) q.pop();` or `q = queue<int>();` 으로 비워야함

## stack

```cpp
#include <stack>
using namespace std;

stack<int> s;   // int형 스택 선언
s.push(1);      // 스택에 1 추가
s.top();        // 스택의 최상단 요소 반환
s.pop();        // 스택의 최상단 요소 제거
s.size();       // 스택 크기 반환
s.empty();      // 스택이 비어있는지 확인
```

> 1. 독특하게 `top` 으로 조회하고 `pop` 으로 제거함, `front` 가 아님을 주의
> 2. `vector` 를 이용해 스택을 구현할 수도 있음
> 3. `clear` 함수가 없음, `while (!s.empty()) s.pop();` or `s = stack<int>();` 으로 비워야함

## deque

```cpp
#include <deque>
using namespace std;

deque<int> dq;    // int형 덱 선언
dq.push_back(1);  // 덱의 뒤에 1 추가
dq.push_front(2); // 덱의 앞에 2 추가
dq.front();       // 덱의 앞 요소 반환
dq.back();        // 덱의 뒤 요소 반환
dq.pop_back();    // 덱의 뒤에 요소 제거
dq.pop_front();   // 덱의 앞에 요소 제거
dq.size();        // 덱 크기 반환
dq.empty();       // 덱이 비어있는지 확인

deque<int> dq2 = {1, 2, 3, 4, 5};
sort(dq2.begin(), dq2.end());
for (int &x : dq2) {
    // x: 1, 2, 3, 4, 5
}
```

> 1. `deque` 는 `vector` + `queue` + `stack` 의 기능을 모두 제공하는 컨테이너
> 2. `deque` 는 `vector` 와 거의 동일하게 사용 가능, `begin()`, `end()`, `clear()`, `sort()` 등 모두 지원
> 3. `deque` 가 `vector` 보다 우수해 보이지만, 메모리 연속성이 보장되지 않아, Cache Miss 가 발생할 확률이 높음, 따라서 가능한 `vector` 를 사용하는 것이 좋음

## set & multiset

```cpp
#include <set>
using namespace std;

set<int> s;        // int형 set 선언
s.insert(1);       // set에 1 추가
s.find(1);         // set에서 1 위치의 이터레이터, 없으면 s.end() 반환
s.count(1);        // set에서 1 의 개수 반환 (0 또는 1)

s.size();          // set 크기 반환
s.empty();         // set이 비어있는지 확인
s.erase(1);        // set에서 1 제거

s.begin();         // set의 시작 이터레이터 반환
s.end();           // set의 끝(마지막 요소의 다음) 이터레이터 반환
*s.begin();        // set의 첫 번째 요소 접근
*(--s.end());      // set의 마지막 요소 접근
*s.end();          // error!

auto it = s.lower_bound(3);   // 3 "이상"인 첫 번째 요소의 이터레이터 (없으면 s.end())
auto it2 = s.upper_bound(3);  // 3 "초과"하는 첫 번째 요소의 이터레이터 (없으면 s.end())

s. clear();        // set 초기화, s = {}
```

```cpp
#include <set>
using namespace std;

multiset<int> ms;     // int형 multiset 선언
ms.insert(1);         // multiset에 1 추가
ms.find(1);           // multiset에서 1 찾기, 없으면 ms.end() 반환
ms.count(1);          // multiset에서 1의 개수 반환 (0 이상)

ms.size();            // multiset 크기 반환
ms.empty();           // multiset이 비어있는지 확인
ms.erase(1);          // multiset에서 1 '모두' 제거
ms.erase(ms.find(1)); // multiset에서 1 '하나만' 제거

ms.begin();           // multiset의 시작 이터레이터 반환
ms.end();             // multiset의 끝(마지막 요소의 다음) 이터레이터 반환
*ms.begin();          // multiset의 첫 번째 요소 접근
*(--ms.end());        // multiset의 마지막 요소 접근
*ms.end();            // error!

auto it = ms.lower_bound(3);   // 3 "이상"인 첫 번째 요소의 이터레이터 (없으면 ms.end())
auto it2 = ms.upper_bound(3);  // 3 "초과"하는 첫 번째 요소의 이터레이터 (없으면 ms.end())

ms. clear();          // multiset 초기화, ms = {}
```

> 1. `set` 중복을 허용하지 않는 Red-Black Tree 기반의 정렬된 컨테이너, O(log n) 시간복잡도로 삽입, 삭제, 탐색 가능
> 2. `multiset` 은 `set` 과 동일하지만, 중복된 값을 허용함
> 3. `set` 과 `multiset` 은 내부적으로 얕은 정렬 상태를 유지함 (오름차순)
> 4. 내림차순을 원할 경우 원소에 `-1` 을 곰하면 됨
> 5. 값을 직접 접근하거나 수정하는것이 불가능, 이터레이터를 통해 접근하거나 `erase` 로 삭제 후 `insert` 로 다시 추가해야 함

## map & unordered_map

```cpp
#include <map>
using namespace std;

map<string, int> m;      // string을 key, int를 value로 하는 map 선언
m["apple"] = 1;          // key "apple"에 value 1 할당
m["banana"] = 2;         // key "banana"에 value 2 할당
int val = m["apple"];    // key "apple"의 value 반환, val: 1
m.size();                // map 크기 반환 (key-value 쌍의 개수)
m.empty();               // map이 비어있는지 확인
m.find("banana");        // key "banana" 위치의 이터레이터, 없으면 m.end() 반환
m.count("banana");       // key "banana"의 개수 반환 (0 또는 1)
m.erase("apple");        // key "apple" 제거
m.clear();               // map 초기화, m = {}

// key, value 쌍 순회
for (auto [key, val] : m) {}

// 주의점, 존재하지 않는 key 에 접근 시, 해당 key 가 추가되고 value 는 기본값(0) 으로 초기화 됨
if (m["orange"] == 0) {}

// 안전하게 key 존재 여부 확인후 접근해야 함
if (m.find("orange") == m.end()) {}
```

```cpp
#include <unordered_map>
using namespace std;

unordered_map<string, int> um;   // string을 key, int를 value로 하는 unordered_map 선언
um["apple"] = 1;                 // key "apple"에 value 1 할당
um["banana"] = 2;                // key "banana"에 value 2 할당
int val = um["apple"];           // key "apple"의 value 반환, val: 1
um.size();                       // unordered_map 크기 반환 (key-value 쌍의 개수
um.empty();                      // unordered_map이 비어있는지 확인
um.find("banana");               // key "banana" 위치의 이터레이터, 없으면 um.end() 반환
um.count("banana");              // key "banana"의 개수 반환 (0 또는 1)
um.erase("apple");               // key "apple" 제거
um.clear();                      // unordered_map 초기화, um = {}

// key, value 쌍 순회
for (auto [key, val] : um) {}

// 주의점, 존재하지 않는 key 에 접근 시, 해당 key 가 추가되고 value 는 기본값(0) 으로 초기화 됨
if (um["orange"] == 0) {}

// 안전하게 key 존재 여부 확인후 접근해야 함
if (um.find("orange") == um.end()) {}
```

> 1. `multimap` 도 존재, `map` 과 동일하지만, 중복된 key 를 허용함, 거의 사용되지는 않으니 정리하지 않겠음
> 2. `map` 은 내부적으로 key 를 기준으로 하는 Red-Black Tree 로 구현되어 있음 (오름차순)
> 3. `unordered_map` 은 내부적으로 해시 테이블로 구현되어 있음, 평균 O(1) 시간복잡도로 삽입, 삭제, 탐색 가능
> 4. `unordered_map` 은 해시 충돌이 발생할 수 있어 최악의 경우 O(n) 시간복잡도를 가질 수 있음
> 5. 백준이나 코드포스 같은 대회 문제들은 해시충돌을 발생시키는 저격 케이스가 존재 할 수 있으니 주의
> 6. 결론적으로 `unordered_map` 을 우선 사용하되, 시간초과가 발생하면 `map` 으로 변경하는 전략이 좋음

## string

```cpp
#include <string>
#include <algorithm>
using namespace std;

string s = "Hello";
string s2 = "World";

s += " " + s2;         // 문자열 합치기, s: "Hello World"
s.size();              // 길이 반환 (length()와 동일)
s.empty();             // 비어있는지 확인
s[0];                  // 인덱스 접근 (수정 가능), 'H'
s.front();             // 첫 번째 문자 반환 ('H'), s[0]과 동일
s.back();              // 마지막 문자 반환 ('d')
s.pop_back();          // 마지막 문자 제거

// 슬라이싱
string sub = s.substr(0, 5); // "Hello" (0번부터 5개)

// 문자열 찾기
if (s.find("World") != string::npos) {
    // "World" 가 s 에 존재함
}
else {
    // "World" 가 s 에 존재하지 않음
}

// 변환
int num = stoi("123");          // 문자열을 정수로 변환, num: 123
string str = to_string(456);    // 정수를 문자열로 변환, str: "456"
double d = stod("3.14");        // 문자열을 실수로 변환, d: 3.14
string str2 = to_string(3.14);  // 실수를 문자열로 변환, str2: "3.140000"

// 아스키 코드 활용, 문자 '9'를 정수 9로 변환
char c = '9';
int ascii_val = c - '0';

if ('0' <= c && c <= '9') {
    // c가 숫자 문자일 때
}

if ('a' <= c && c <= 'z') {
    // c가 소문자 영어일 때
}

if ('A' <= c && c <= 'Z') {
    // c가 대문자 영어일 때
}

// 알고리즘 헤더 활용
sort(s.begin(), s.end());     // 사전순 정렬
reverse(s.begin(), s.end());  // 문자열 뒤집기
```

> 1. 컴파일러마다 헤더 의존성이 달라 `#include <string>` 을 명시하는 습관을 들이자 (`#include <iostream>` 만으로도 동작하는 경우가 많음)
> 2. `find` 실패시 반환값은 `-1` 이 아니라 `string::npos` 임에 주의
> 3. `s[0]`, `s.front()`, `s.back()` 의 반환형은 `char` 임에 주의
> 4. 문자는 파이썬 쓰자