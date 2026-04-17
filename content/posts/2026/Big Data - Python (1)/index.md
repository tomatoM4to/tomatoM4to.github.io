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
Python 에서는 `=` 연산자를 사용하여 변수에 값을 할당한다. 변수는 메모리 **주소(reference)** 를 참조하는 이름으로, 값이 변경될 때마다 새로운 메모리 **주소(reference)** 가 할당된다.

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

## Functions
```python
def add(x, y):
    return x + y

print(add(5, 3))

# Optional Arguments
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))      # Hello, Alice!
print(greet("Bob", "Hi"))  # Hi, Bob!
```
> All functions in Python have a return value - even if no return line inside the code. Functions without a return return the special value `None`

> There's no function overloading in Python. Two functions can't have the same name, even if they have different arguments.

## Arguments
* Arguments are passed by assignment
* Passed arguments are assigned to local names
* Assignment to argument names don't affect the caller
* Changing **a mutable argument** may affect the caller

```python
def modify_list(lst):
    lst.append(4)

my_list = [1, 2, 3]
modify_list(my_list)
print(my_list)  # [1, 2, 3, 4]
```

> Python 에서 Args를 전달하는 방식은 전통적인 Call by Value 나 Call by Reference 와는 다르며, Passed by Assignment 또는 Call by Object Reference 라고 불리는 모델을 따른다.

> 함수가 호출될때, 전달된 Args 는 내부의 매개변수에 `=` 연산자를 통해 Assignment 되는 것과 동일하게 동작한단 의미에서 Passed by Assignment 라고 불린다. 이로인해 전달되는 Object 의 Type(Mutable vs Immutable) 에 따라 함수 내부에서의 변경이 외부에 영향을 미칠 수 있는지 여부가 결정된다.

> * **Immutable**: 함수 내부에서 값을 변경하려고 하면 새로운 Object가 생성되어 Reference가 변경된다. 따라서 함수 외부의 원본 변수에는 영향을 주지 않는다. (Call by Value 처럼 보임)
> * **Mutable**: 함수 내부에서 Object의 상태를 직접 변경(예: append)하면, 원본 변수와 함수 내부의 매개변수가 동일한 Object를 참조하고 있으므로 함수 외부의 원본 Object도 함께 변경된다. (Call by Reference 처럼 보임)

## Function types
Functions can be user as any other data type.

* Arguments to function
* Return values of functions
* Assigned to variables
* Parts of tuples, lists, etc.

```python
x = lambda a, b: a + b  # Anonymous function (Lambda function)
print(x(5, 3))  # 8
print(type(x))  # <class 'function'>

def my_func(n):
    return lambda a : a * n

  my_func = my_func(2)  # Returns a function that multiplies its argument by 2
  print(my_func(11))    # 22
  print(type(my_func))  # <class 'function'>
```

## Control Flow
```python
def check_sigh(x):
    if x > 0:
        return "Positive"
    elif x < 0:
        return "Negative"
    else:
        return "Zero"

print(check_sigh(5))   # Positive
print(check_sigh(-3))  # Negative
print(check_sigh(0))   # Zero
```

## Loop Statements
```python
n = 2015
div = 2
while n % div != 0:
  div = div + 1
print(f"Smallest divisor of {n} is {div}") # Smallest divisor of 2015 is 5

partial_sum = 0
for num in range(1, 101):
    partial_sum += num
print(partial_sum)  # 5050

lst = [1, 2, -3, 4, 5, 5]
for i in range(len(lst)):
    if lst[i] < 0:
        print(f"First negative number is {lst[i]}")  # First negative number is -3
        break

uniques = []
for num in lst:
    if num in uniques:
        continue
    uniques.append(num)
print(uniques)  # [1, 2, -3, 4, 5]
```

## Exception Handling
* **syntax errors**: 코드가 문법에 맞지 않을 때 발생하는 오류, ide 나 compiler 가 감지하여 실행 전에 오류를 발견할 수 있다.
* **runtime errors**: 코드가 실행되는 동안 발생하는 논리적 오류, 예시로는 `ZeroDivisionError`, `IndexError` 등이 있다. 실제 수행하기 전에는 알수 없는 오류로, try-except 블록을 사용하여 처리할 수 있다.

```python
try:
    10 / 0
except IndexError:
    print("Index out of range!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
finally:
    print("This will always be executed.")
```

> `try` 블록에서 예외가 발생하면, 해당 예외에 맞는 `except` 블록이 실행되고, `finally` 블록은 예외 발생 여부와 상관없이 항상 실행된다. 위 예제에선 `ZeroDivisionError` 가 발생하므로, `Cannot divide by zero!` 와 `This will always be executed.` 이 출력된다.

> `except` 블록에서 특정 예외를 지정하지 않으면, 모든 예외를 처리할 수 있지만, 이는 권장되지 않는다.

## Recursive Function
```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
```
Recursive Function 에 익숙해 지기 위해선 Trace Table 을 그려보는 것이 도움이 된다.

| Step | 호출 함수 | n | n == 0 | Return |
|------|-----------|---|--------|--------|
| 1 (Winding) | factorial(3) | 3 | False | 3 * factorial(2) |
| 2 (Winding) | factorial(2) | 2 | False | 2 * factorial(1) |
| 3 (Winding) | factorial(1) | 1 | False | 1 * factorial(0) |
| 4 (Base Case) | factorial(0) | 0 | True | 1 |
| 5 (Unwinding) | factorial(1) | 1 | - | 1 * 1 = 1 |
| 6 (Unwinding) | factorial(2) | 2 | - | 2 * 1 = 2 |
| 7 (Unwinding) | factorial(3) | 3 | - | 3 * 2 = 6 |

* Winding: 재귀 함수가 자기 자신을 호출하여 더 깊은 레벨로 들어가는 과정, Base Case(종료 조건, `n == 0`) 를 만날때 까지
* Unwinding: Base Case 가 값을 반환하는 순간, 쌓여있던 연산들이 역순으로 실행되며 최종 결과를 도출하는 과정
* Base Case: 재귀 함수가 더 이상 자기 자신을 호출하지 않고 값을 반환하는 조건, Recursive Function 이 무한히 호출되는 것을 방지하기 위해 반드시 필요하다.

> Trace Table 이 직관적이긴 하나 n 이 좀만 커지거나 함수가 복잡해지면 그리는게 사실상 불가해 진다. Recursive Function은 수학적 귀납법을 코드로 그대로 표현한 것이기 때문에, 기존 컴퓨팅 사고보단 수학적 사고가 Recursive Function 을 이해하는데 도움이 된다.

> 귀납법으로 해석하면
> 1. `f(0) = 1` 이다.
> 2. `f(1) = 1 * f(0)` 이다, 그리고 이건 `1 * 1 = 1` 이다.
> 3. `f(2) = 2 * f(1)` 이다, 그리고 이건 `2 * 1 * 1 = 2` 이다.
> 4. `f(3) = 3 * f(2)` 이다, 그리고 이건 `3 * 2 * 1 * 1 = 6` 이다.
> 5. `f(n) = n * n-1 * n-2 * ... * 1` 즉, `f(n) = n!` 이다.
> 따라서 `factorial(3)` 의 최종 결과는 `3 * 2 * 1 = 6` 이 된다.

> 근데 call stack 에 추가되고 제거되는 과정이 무겁기 때문에, loop 로 구현하는것이 대부분의 상황에서 효율적이고 코드도 더 쉬워짐.. 실제로 우주선, 자동차, 항공기, 의료기기 와 같이 생명과 직결된 Safety-Critical System 에서는 MISRA C 라는 국제 코딩 표준을 따른다, 이 표준의 핵심 규칙중 하나가 바로 Recursive Function 의 사용 금지, 이해하기 어려운 메모리 퍼먹는 하마를 굳이 사용할 필요가 없다는 뜻

## Module
> Modules are functions and variables defined in separate files

Why use modules?

* Code reuse
  * Routines can be called multiple times within a program
  * Routines can be used from multiple programs
* Namespace partitioning
  * Group data together with functions used for that data
* Implementing shared services or data
  * Can provide global data structure that is accessed by multiple subprograms

Usage
* `from module import function`: 특정 함수만 import
* `import module`: 모듈 전체 import, 모듈 이름을 통해 함수에 접근
* `import module as alias`: 모듈 전체 import, 별칭(alias) 사용

Modules are namespaces, Can be used to organize variable names, i.e.
```python
import molecule
import atom
atom.position = atom.position + molecule.position
```

## Class and Object

> A software item that contains variables and methods

Object Oriented Design focuses on
* **Encapsulation**: dividing the code into a **public interface**, and **a private implementation** of that interface
* **Polymorphism**: the ability **to overload standard operators** so that they have **appropriate behavior** based on **their context**
* **Inheritance**: the ability to create subclasses that contain specializations of their parents

Example: Atom Class
* `__init__`: constructor method, called when an object is created, used to initialize the object's attributes
* `__repr__`: string representation method, defines how the object is represented as a string, useful for debugging and logging

```python
class Atom:
    def __init__(self, atno, x, y, z):
        self.atno = atno
        self.position = (x, y, z)
    def get_position(self):
        return self.position
    def __repr__(self):
        return f"Atom(atno={self.atno}, position={self.position})"

at = Atom(1, 5.0, 2.0, 8.0)
print(at)   # Atom(atno=1, position=(5.0, 2.0, 8.0))
print(at.get_position())  # (5.0, 2.0, 8.0)
```
* Overloaded the default constructor (and print operator), (파이썬 문법상 Override 라고 불리지만 여기선 그대로 옮겨적음)
* Defined instance variables (or attributes) (atno, position) that are persistent and local to the atom object.
* Good way to manage shared memory:
  * Instead of passing long lists of arguments, encapsulate some of this data into an object, and pass the object
  * Much cleaner programs result

> instance variables vs class variables
> * instance variables: instance 마다 고유한 값을 가지는 변수, `__init__` 메서드에서 `self` 를 통해 정의
> * class variables: 클래스 전체에서 공유되는 변수, 클래스 정의 내부에 직접 정의, 다른 언어의 `static` 변수와 유사한 개념

> overload vs override
> * overload: 같은 이름의 함수를 매개변수나 return 타입이 다르게 여러 개 만드는 것, Python 에서는 지원하지 않음
> * override: 부모 클래스에서 정의된 메서드를 자식 클래스에서 재정의하는 것, Python 에서 지원함

> Python 에선 method overloading 을 지원하지 않지만, operator overloading 은 지원한다. 예를 들어, `__add__` 메서드를 정의하여 `+` 연산자를 오버로드할 수 있다.

Example: Molecule Class

```python
class Molecule:
    def __init__(self, name='Generic'):
        self.name = name
        self.atomlist = []

    def add_atom(self, atom):
        self.atomlist.append(atom)

    def __repr__(self):
      str = f'This is a moecule named {self.name}\n'
      str = str + f'It contains the following atoms: {len(self.atomlist)}\n'
      for atom in self.atomlist:
          str = str + repr(atom) + '\n'
      return str

mol = Molecule("Water")
at = at = Atom(1, 0.0, 0.0, 0.0)
mol.add_atom(at)
mol.add_atom(Atom(8, 0.0, 0.0, 1.0))
mol.add_atom(Atom(1, 0.0, 1.0, 0.0))

print(mol)
```

TODO: 결과 로그값 만들어야 함

## Inheritance
> 상속(Inheritance) 은 새로운 클래스가 기존 클래스의 method 와 member variable 를 물려받아 재사용 및 확장하는 OOP 의 핵심 기능중 하나다.

```python
class MonoAtomicMolecule(Molecule):
    def num_of_molecule(self):
        return len(self.atomlist)
    def add_atom(self, atom):
        if len(self.atomlist) == 0:
            super(MonoAtomicMolecule, self).add_atom(atom)
        else:
            for at in self.atomlist:
                if at.atno != atom.atno:
                    print("This molecule is monoatomic!")
                    return
            super(MonoAtomicMolecule, self).add_atom(atom)

monomol = MonoAtomicMolecule("Ozone")
monomol.add_atom(Atom(8, 1.0, 0.0, 0.0))
monomol.add_atom(Atom(8, 0.0, 1.0, 0.0))
monomol.add_atom(Atom(8, 0.0, 0.0, 1.0))

monomol.add_atom(Atom(1, 0.0, 0.0, 0.0))  # This molecule is monoatomic!
print(monomol)
```

* `__init__` and `__repr__` are taken from the parent class, `Molecule`
* Added a new method `num_of_molecule`
* Example of code reuse
    * Basic functions don't have to be retyped, just inherited
    * Less to rewrite when specifications change

## Public and Private Data
In Python anything with two leading underscored is private, `__a`, `__my_variable`

Anything with one leading underscore is semi-private, and you should feel guilty accessing this data directly, `_a`, `_my_variable`, Sometimes useful as an intermediate step to making data private