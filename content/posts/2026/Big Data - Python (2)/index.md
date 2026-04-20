---
title: "Big Data - Python (2)"
description: "강원대학교 컴퓨터공학과 202601 DB Programming 5주차 Python"
date: "2026-04-10"
keywords: "Big Data, Python, KNU"
---

## fibonacci sequence
> e.x. 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

Iterative implementation
```python
def fibo_iter(n):
    if n < 2:
        return n
    prev, cur = 0, 1
    for _ in range(2, n + 1):
        prev, cur = cur, prev + cur
    return cur
```

Recursive implementation
```python
def fibo_rec(n):
    if n < 2:
        return n
    return fibo_rec(n - 1) + fibo_rec(n - 2)
```
1. f(0) = 0
2. f(1) = 1
3. f(2) = f(1) + f(0) = 1 + 0 = 1
4. f(3) = f(2) + f(1) = 1 + 1 = 2
5. f(4) = f(3) + f(2) = 2 + 1 = 3
6. f(5) = f(4) + f(3) = 3 + 2 = 5
7. f(n) = f(n-1) + f(n-2) 은 피보나치 수열의 n번째 항을 구할수 있음을 증명

위 두 함수의 실행 시간을 측정해보자

```python
import timeit

N = 30
ITERS = 1

def fibo_iter_time():
    fibo_iter(N)

def fibo_rec_time():
    fibo_rec(N)

t1 = timeit.timeit(fibo_iter_time, number=ITERS)
t2 = timeit.timeit(fibo_rec_time, number=ITERS)

# 6자리까지 소수점으로 출력
print(f"Iterative: {t1:.6f} seconds") # ex) 0.249726
print(f"Recursive: {t2:.6f} seconds") # ex) 8.403999
```
Iterative 방식은 주어진 `N` 에 대해 선형 시간 복잡도 `O(N)`을 가지며, Recursive 방식은 지수 시간 복잡도 `O(2^N)`을 가지기 때문에 Iterative 방식이 훨씬 빠르게 실행된다.

Iterative 방식에선 연산이 for-loop 내에서 한번씩만 수행되기 때문에 `O(N) + c`로 표현됨이 직관적이지만

Recursive Function 방식은 자기 자신을 **한번 호출할 때마다 내부적으로 2번씩 또 호출**한다. 이걸 순차적으로 보면
1. (n) 함수 1개 실행
2. (n-1, n-2) 함수 2개 실행
3. 함수 4개 실행
4. 함수 8개 실행
5. ...

결과적으로 `O(2^N)`이 된다.

또는 더 멋진 방법으로 재귀 방정식을 새워서 풀이할 수도 있다. `T(n) = T(n-1) + T(n-2) + c` 라는 재귀 방정식이 성립하는데, 이걸 풀면 `O(2^N)`이 나온다.

자주 나오는 재귀 방정식과 그 풀이 결과는 다음과 같다:
* Factorial: `T(n) = T(n-1) + c` = `O(n)`
* Fibonacci: `T(n) = T(n-1) + T(n-2) + c` = `O(2^n)`
* Binary Search: `T(n) = T(n/2) + c` = `O(log n)`
* Merge Sort: `T(n) = 2T(n/2) + O(n)` = `O(n log n)`

> 재귀 방정식(Recurrence Relation)을 풀어 **시간 복잡도(Time Complexity)**를 계산할 때는, 직관적으로 `함수의 호출 횟수 * 함수 내부에서 수행하는 연산량` 의 개념을 적용할 수 있다.

> `+` 표현은 함수가 갈래를 치며 여러번 호출된다는것을 의미하고 `T(n/2)` 표현은 입력값이 매번 절반으로 줄어든다는 것을 의미한다. 1000, 500, 250, 125, ... 이런식으로 입력값이 줄어드는 경우가 `O(log n)`의 대표적인 예시이다.

## DP(Dynamic Programming)
> 최적화 이론의 한 기술이며, 특정 범위까지의 값을 구하기 위해서 그것과 다른 범위까지의 값을 이용하여 효율적으로 값을 구하는 알고리즘 설계 기법, 다르게 표현하면 사전 계산된(pre-computed) 값들을 재활용하는 방법이다.

코딩 테스트시 많은 사람들이 DP 문제에서 막히게 되는데 아래 형태가 가장 기본적인 DP 풀이 형태로(Top-Down), 이론과 코드 구조를 외우고 있으면 DP 문제 풀이에 큰 도움이 된다.

```python
dp = [None] * 1000 # dp table
def fibo_dp(n):
    if n < 2:
        return n
    if dp[n] is not None: # 이미 계산된 결과가 있으면 반환
        return dp[n]
    dp[n] = fibo_dp(n - 1) + fibo_dp(n - 2) # 계산 후 저장
    return dp[n]

import timeit
N = 30
ITERS = 1
def fibo_dp_time():
    fibo_dp(N)
t3 = timeit.timeit(fibo_dp_time, number=ITERS)
print(f"DP: {t3:.6f} seconds") # ex) 0.000001
```

## Char Counting

How many times each letters (chars) are written in given text (string)?

Implement `get_char_count(text)` which returns an dictionary storing the counts of appearance of each character in given text.

Erase # pass and fill out appropriate codes inside the given functions:

> supercalifragilisticexpialidocious

```python
text = 'supercalifragilisticexpialidocious'

def get_char_count(text):
  d = {}
  for c in text:
    if c not in d:
      d[c] = 1
    else:
      d[c] += 1
  return d

char_count = get_char_count(text)

print ("-------- print dictionary! -------")
for char in char_count:
    print (char, ':', char_count[char])

"""OUTPUT
-------- print dictionary! -------
s : 3
u : 2
p : 2
e : 2
r : 2
c : 3
a : 3
l : 3
i : 7
f : 1
g : 1
t : 1
x : 1
d : 1
o : 2
"""
```

## Sorted
1. Implement `print_by_keys_order(char_count)` which print list of (char, counts) pair sorted by char in char_count dictionary.
2. Implement `print_by_values_order(char_count)` which prints (char, counts) pair sorted by counts in char_count dictionary.

```python
def print_by_keys_order(dic):
  dic_t = sorted(dic.items())
  for k, v in dict(dic_t).items():
    print(k, ":", v)
print("-------- keys sorted alphabetically -------")
print_by_keys_order(get_char_count(text))

"""OUTPUT
-------- keys sorted alphabetically -------
a : 3
c : 3
d : 1
e : 2
f : 1
g : 1
i : 7
l : 3
o : 2
p : 2
r : 2
s : 3
t : 1
u : 2
x : 1
"""


def print_by_values_order(dic):
  dic_t = sorted(dic.items(), key=lambda x : x[1])
  return dict(dic_t)
print ("-------- keys sorted by values -------")
print_by_values_order(get_char_count(text))

"""OUTPUT
{'d': 1,
 'f': 1,
 'g': 1,
 't': 1,
 'x': 1,
 'e': 2,
 'o': 2,
 'p': 2,
 'r': 2,
 'u': 2,
 'a': 3,
 'c': 3,
 'l': 3,
 's': 3,
 'i': 7}
"""
```

* 개수가 같으면서 사전순으로 정렬하려면 `key=lambda x : (x[1], x[0])`
* 여러 문자열이 있을 경우 해당 문자열의 길이를 기준으로 정렬하는 방법 `key=lambda x : len(x)`
* 역순 파라미터를 이용하여 내림차순으로 정렬 가능 `sorted(dic.items(), key=lambda x : x[1], reverse=True)`


## Class Inheritance

With the practice notebook, we studied how to implement a `Point` class. Also, we implemented `Circle` class which has Point instance as a member variable.

Implement your own Circle class, which inherits Point class. It should inherit/override a function `distance` such that distance can be calculated between both points and circles. The `distance` function in `Circle` class should calculate the distance between the circle's center and the given point / the given circle's center.

x and y member variable will be a location of circle's center in Circle class.

```python
class Point():
  def __init__(self, x, y):
    self.x = x
    self.y = y
  def distance(self, c):
    dx = (self.x - c.x) ** 2
    dy = (self.y - c.y) ** 2
    return (dx + dy) ** 0.5

class Circle(Point):
  def __init__(self, p, d):
    super().__init__(p[0], p[1])
    self.d = d

  def distance(self, p):
    dx = (self.x - p.x) ** 2
    dy = (self.y - p.y) ** 2
    return (dx + dy) ** 0.5

  def in_circle(self, p):
    d = self.distance(p)
    return d < self.d

p = Point(0, 0)
c = Circle((5, 0), 3)

print(p.distance(c))  # 5.0
print(c.distance(p))  # 5.0
print(c.in_circle(p)) # False
```

## Word Count in Pure Python

A student wants to count the frequency of words in a Wikipedia document.

> Example: en.wikipedia.org/wiki/MapReduce
>
> TEXT : MapReduce is a programming model and an associated implementation for processing and generating big data sets with a parallel, distributed algorithm on a cluster.
>
> RESULT : "a" appears 3 times, "and" appears 2 times, "Mapreduce" appears 1 time..........
> To do this, we will implement a program by using MapReduce method.
>
> MapReduce consists of 4 functions, map(text), shuffle(mapped_result), reduce(mapped_result), word_count(text)
>
> Refer to https://wikidocs.net/64, for details on how map/reduce works

```python
def map(text):
  lst = text.split()
  cnt = [1] * len(lst)
  return list(zip(lst, cnt))

def shuffle(lst):
  dic = {}
  for s, i in lst:
    if s not in dic:
      dic[s] = [1]
    else:
      dic[s].append(1)
  return dic

def reduce(dic):
  d = {}
  for k, v in dic.items():
    if k not in d:
      d[k] = sum(v)
  return d

def word_count(text):
  lst = map(text)
  dic = shuffle(lst)
  dic = reduce(dic)
  return dic

inputText = "Now test your result if it's right"
word_count(inputText)

"""OUTPUT
{'Now': 1, 'test': 1, 'your': 1, 'result': 1, 'if': 1, "it's": 1, 'right': 1}
"""
```