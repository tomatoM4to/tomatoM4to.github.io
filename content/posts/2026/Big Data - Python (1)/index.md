---
title: "Big Data - Python (1)"
description: "강원대학교 컴퓨터공학과 202601 DB Programming 2, 3, 4주차 Python basic"
date: "2026-04-05"
keywords: "Big Data, Python, KNU"
---

## Basic Syntax
* `+` : 덧셈, Concatenation 연결 연산자로도 사용
* `-` : Subtraction
* `*` : Multiplication , Concatenation 반복 연산자로도 사용
* `/` : 나눗셈, 결과는 항상 `float`
* `//` : 몫, 결과는 항상 `int`
* `%` : Mod
* `**` : Power

## Basic Data types
```python
"""Integer, Float"""
x = 5 // 2      # 2
z = 5 / 2       # 2.5

print(type(x))  # <class 'int'>
print(type(z))  # <class 'float'>

"""Boolean"""
x = ( 1 > 2 )   # False
print(type(x))  # <class 'bool'>

"""String"""
x = "Hello, World!"
y = 'Hello, World!'

"""Type Conversion"""
x = 5 + int("10")  # 15
y = str(5) + "10"  # "510"
print(type(x))  # <class 'int'>
print(type(y))  # <class 'str'>

"""Whitespace"""
```

## Assignment
Python 에서는 `=` 연산자를 사용하여 변수에 값을 할당한다. 변수는 메모리 **주소(reference)**를 참조하는 이름으로, 값이 변경될 때마다 새로운 메모리 **주소(reference)**가 할당된다.

reference 자체는 값이 아니며 type 을 가지지 않지만, reference 가 가리키는 Object(reference) 는 type 을 가진다.

이러한 설계 철학은, Dynamic Typing 과 Automatic Memory Management 를 가능하게 하며, Python 의 유연성과 편리함을 높이는 중요한 요소중 하나다.

```python
x = 5           # x 는 5 라는 값을 참조하는 reference
y = x           # y 는 x 가 참조하는 5 라는 값을 참조하는 reference

x = "Hello"  # x 는 이제 "Hello" 라는 값을 참조하는 reference 로 변경
```

> Python 에서 사용되는 모든 데이터는 Object 이며, 변수는 해당 데이터 객체를 가리키는 참조(Reference) 역할을 한다.

> Java 와 달리 원시타입과 참조 타입의 구분이 없으며  `int`, `str` 같은 불변 객체도 참조 방식으로 동작한다.

> reference 는 OS 에 따라, Python 버전에 따라 32bit, 64bit 처럼 다양한 bit 크기를 가질 수 있다.

## Mutable vs Immutable
* **Mutable**: 객체의 상태를 변경할 수 있는 데이터 타입, 예시로는 `list`, `dict`, `set` 등이 있다.
* **Immutable**: 객체의 상태를 변경할 수 없는 데이터 타입, 예시로는 `int`, `float`, `str`, `tuple`, `bool` 등이 있다.

```python
x = 5           # x 는 5 라는 값을 참조하는 reference
x = 10          # x 는 이제 10 라는 값을 참조하는 reference 로 변경, 5 라는 값은 여전히 메모리에 존재하지만 x 는 더 이상 참조하지 않음

y = [1, 2, 3]   # y 는 [1, 2, 3] 라는 list 객체를 참조하는 reference
y.append(4)     # y 가 참조하는 list 객체의 상태를 변경, y 는 여전히 같은 list 객체를 참조
```

## Non-Existent Names
선언하지 않은 변수에 접근하려고 하면 `NameError` 가 발생한다.

## Naming Rules
* 숫자로 시작할 수 없다 (중간부턴 가능)
* 예약어는 사용할 수 없다 (예: `if`, `for`, `while` 등)
* 대소문자를 구분한다 (예: `Variable` 과 `variable` 은 다른 이름)
* 특수문자는 `_` 만 허용한다 (예: `my_variable`)

## GC (Garbage Collection)
일종의 메커니즘 으로서, 자동적으로 사용하지 않는 메모리를 해제하는 기능

## is vs ==
* `is`: 가리키는 두 객체가 동일한 객체인지를 비교 (참조 비교)
* `==`: 가리키는 두 객체의 값이 동일한지를 비교 (값 비교)

```python
x = [1, 2, 3]
y = x           # y 는 x 가 참조하는 같은 list 객체를 참조
z = [1, 2, 3]   # z 는 x 와 동일한 값을 가지는 새로운 list 객체를 참조

print(x is y)  # True, x 와 y 는 같은 객체를 참조
print(x is z)  # False, x 와 z 는 다른 객체를 참조
print(x == z)  # True, x 와 z 는 동일한 값을 가짐

x, y = 5, 5
print(x is y)  # True, 작은 정수는 Python 내부에서 캐싱되어 같은 객체를 참조
```

> 원칙적으로 OOP 의 설계상으론 `x = 5` 와 `y = 5` 는 서로 다른 객체를 참조해야 하지만, 실제 동작은 최적화를 위해 같은 객체를 참조하는 경우가 있다. 이는 Python 의 구현 세부사항에 따른 것으로, 일반적으로 작은 정수와 짧은 문자열이 캐싱되어 같은 객체를 참조하는 경우가 많다.

## Sequence Types
* `tuple`: A simple **immutable** ordered sequence of items
  * ordered 라는 뜻은 `(1, 2) != (2, 1)` 라는 뜻
  * items 라는 뜻은 `(1, "Hello", 3.14)` 처럼 다양한 타입의 아이템들을 담을 수 있다는 뜻
* `strings`: **Immutable**, 튜플과 매우 유사하지만 `String`은 문자들의 시퀀스라는 점에서 특별한 의미를 가지며, `String`에 특화된 메서드들이 존재한다.
* `list`: **Mutable** ordered sequence of items of mixed types

> tuple 은 immutable 이 보장되기 때문에, mutable 한 list 보다 효율적으로 동작

## Syntax for Sequence Types
3 타입 모두 비슷한 문법을 가지며, 인덱싱과 슬라이싱이 가능하다. 튜플과 리스트는 대괄호 `[]` 와 소괄호 `()` 로 구분되지만, 문자열은 따옴표 `''` 나 `""` 로 구분된다.

```python
tu = (1, "Hello", 3.14)   # tuple
st = "Hello, World!"      # string
li = [1, "Hello", 3.14]   # list

print(tu[0])   # 1
print(st[0])   # 'H'
print(li[-1])  # 3.14

print(tu[1:])  # ('Hello', 3.14)
print(st[:5])  # 'Hello'
print(li[1:3]) # ['Hello', 3.14]

print(1 in tu)        # True
print('Hello' in st)  # True
print(3.14 in li)     # True

print((1, 2, 3) + (4, 5))    # (1, 2, 3, 4, 5)
print("Hello, " + "World!")  # 'Hello, World!'
print([1, 2] + [3, 4])       # [1, 2, 3, 4]

print((1, 2) * 3)    # (1, 2, 1, 2, 1, 2)
print("Hi! " * 2)    # 'Hi! Hi! '
print([0] * 5)       # [0, 0, 0, 0, 0]

print(type(list((1, 2, 3))))   # <class 'list'>
print(type(tuple([1, 2, 3])))  # <class 'tuple'>
```

## Operations on Lists Only
modification operations 은 리스트에서만 사용할 수 있다.
* `li.append(x)`: 리스트의 끝에 x 를 추가
* `li.insert(i, x)`: 리스트의 i 번째 위치에 x 를 삽입
* `li.extend(iterable)`: 리스트의 끝에 iterable 의 모든 요소를 추가, iterable 이란 반복 가능한 객체로, 리스트, 튜플, 문자열 등이 해당됨
* `li.remove(x)`: 리스트에서 첫 번째로 나오는 x 를 제거
* `li.pop(i)`: 리스트의 i 번째 요소를 제거하고 반환, i 가 생략되면 마지막 요소를 제거하고 반환
* `li.clear()`: 리스트의 모든 요소를 제거
* `li.reverse()`: 리스트의 요소를 역순으로 정렬
* `li.sort()`: 리스트의 요소를 정렬하지만, 요소들이 서로 비교 가능한 타입이어야 하며, 기본적으로 오름차순으로 정렬한다.

## Dictionary
key-value 쌍으로 이루어진 **mutable** 데이터 타입, **key 는 고유해야 하며, immutable 한 타입이어야 한다.** value 는 어떤 타입이든 될 수 있다.

```python
d = {"name": "Alice", "age": 30}
print(d["name"])  # Alice
d["age"] = 31     # 딕셔너리의 값을 변경
print(d)          # {'name': 'Alice', 'age': 31}

print(d.keys())    # dict_keys(['name', 'age'])
print(d.values())  # dict_values(['Alice', 31])
print(d.items())   # dict_items([('name', 'Alice'), ('age', 31)])

del d["name"]     # 딕셔너리에서 key-value 쌍 제거
print(d)          # {'age': 31}
```