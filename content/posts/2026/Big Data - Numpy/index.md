---
title: "Big Data - Numpy"
description: "강원대학교 컴퓨터공학과 202601 DB Programming 5주차 Python Numpy exercise"
date: "2026-04-11"
keywords: "Big Data, Python, KNU"
---

## Database Programming
Big Data 에 대한 개요를 살펴봤고, Python 언어도 빠르게 훑어봤으니, Big Data 를 다루기 위한 Built-in Library 들을 살펴보자.

* **Numpy:** Numerical Python 의 줄임말로, 대규모 다차원 배열과 행렬 연산을 지원하는 라이브러리
* **Matplotlib:** 데이터 시각화를 위한 라이브러리로, 다양한 그래프와 차트를 그릴 수 있음

> Numpy 는 내부적으로 C 언어로 구현되어 있어, Python 의 기본 리스트보다 훨씬 빠르게 대규모 데이터 처리가 가능하다. 제대로 사용하면 cpp 보다 코드는 훨씬 적으며 빠르게 실행되는 경우도 많다.

> Bit Data 의 수집, 처리, 분석, 저장 중 **분석 단계**

## Numpy
* Linear algebra library
* Fundamental package for working with N-dimensional array objects (vector, matrix, tensor, ...)
  * **vector:** 1차원 배열
  * **matrix:** 2차원 배열
  * **tensor:** 3차원 이상의 배열
* Numpy arrays are a fundamental data type for some other packages to use
* Numpy has many specialized modules and functions
  * `numpy.linalg`: linear algebra functions
  * `numpy.fft`: Fourier transform functions
  * `numpy.random`: random number generation functions
  * math function, sorting, searching, counting, unit test, ...
* Numpy is written in C, so it is very fast for numerical computations

```python
import numpy as np
import numpy.random as npr
```

## Numpy array
```python
import numpy as np

a: np.ndarray = np.array([1, 2, 3])
b: np.ndarray = np.array([[1, 2, 3], [4, 5, 6]])
c: np.ndarray = np.zeros((2, 3, 4))

print(a) # [1 2 3]
print(b) # [[1 2 3]
         #  [4 5 6]]
print(c)   # [[[0. 0. 0. 0.]
           #   [0. 0. 0. 0.]
           #   [0. 0. 0. 0.]]
           #  [[0. 0. 0. 0.]
           #   [0. 0. 0. 0.]
           #   [0. 0. 0. 0.]]]

each Numpy array has some attributes
1. `shape`: a tuple of size in each dimension
2. `dtype`: data type of entries
3. `size`: total of entries
4. `ndim`: number of dimensions
5. `T`: Transpose (행렬의 전치)

```python
print(a.shape) # (3,)
print(b.shape) # (2, 3)

print(a.dtype) # int64
print(b.dtype) # int64

print(a.size) # 3
print(b.size) # 6

print(a.ndim) # 1
print(b.ndim) # 2

print(b.T) # [[1 4]
           #  [2 5]
           #  [3 6]]
```

> Transpose 는 행렬의 행과 열을 바꿔주는 연산이다. `(1, 2)` 에 있는 원소는 `(2, 1)` 로, `(2, 3)` 에 있는 원소는 `(3, 2)` 로 이동한다. 2차원 이상 배열에서 사용 가능

## Vectors
> vectors are 1d arrays
* `np.zeros(n)` : Return a new array of giiven shape and type, filled with zeros.
* `np.ones(n)` : Return a new array of given shape and type, filled with ones.
* `npr.randn(n)` : Return samples from the "standard normal" distribution.
  * 평균이 0이고 표준편차가 1인 정규분포에서 난수 샘플을 생성
* `np.linspace(start, stop, num)` : num uniform values between start and stop (inclusive)
  * start 부터 stop 까지 num 개의 균등한 간격으로 나눈 값들을 생성
* `np.arange(start, stop, step)` : Return evenly spaced values within a given interval
  * start 부터 stop 까지 step 간격으로 나눈 값들을 생성 (stop 제외)

```python
import numpy as np
import numpy.random as npr

np.zeros(4) # [0. 0. 0. 0.]
np.ones(4)  # [1. 1. 1. 1.]
npr.randn(4) # [ 0.49671415 -0.1382643  0.64768854 -0.82731631]
np.linspace(0, 10, 5) # [ 0.  2.5  5.  7.5 10. ]
np.arange(0, 10, 2) # [0 2 4 6 8]
np.arange(5) # [0 1 2 3 4]
```

> Numpy 는 정말한 계산을 위해 `ones`, `zeros` 든 기본적으로 `float64` 타입의 배열을 생성한다.

## Matrices
> matrices are 2d arrays
* `np.zeros((m, n))` : Return a new array of given shape and type, filled with zeros.
* `npr.randn(m, n)` : Return samples from the "standard normal" distribution.

```python
import numpy as np
import numpy.random as npr

np.zeros((2, 3)) # [[0. 0. 0.]
                 #  [0. 0. 0.]]

npr.randn(2, 3) # [[ 0.49671415 -0.1382643  0.64768854]
                #  [-0.82731631  0.23415337 -0.23413696]]
```

> npmpy 의 기본적인 큐칙은 shape 를 지정할때 `Tuple` 형태로 값을 전달해야 하지만, `randn()`, `rand()` 개별 인자로 전달해야 한다. (MATLAB 스타일)

## Array shape
> Shape returns a tuple listing the length of the array along each demension. (차원별 Tuple 의 사이즈)

```python
import numpy as np
import numpy.random as npr

a = np.array([1, 2, 3, 4])
b = npr.randn(3, 3)
c = npr.randn(3, 2, 4)
print(a.shape) # (4,)
print(b.shape) # (3, 3)
print(c.shape) # (3, 2, 4)
```
* a 는 1차원 array 고 4개의 원소가 있으므로 shape 이 `(4,)` 이다.
* b 는 2차원 array 고 3x3 크기이므로 shape 이 `(3, 3)` 이다.
* c 는 3차원 array 고 3x2x4 크기이므로 shape 이 `(3, 2, 4)` 이다.

## Reshaping an array
> Reshape return a new array with a different shape, but it cannot change the number of elements in an array. (배열의 원소 개수는 유지하면서 배열의 형태를 바꿔주는 함수)

```python
import numpy as np

a = np.arange(8)
a.reshape((2, 4)) # [[0 1 2 3]
                  #  [4 5 6 7]]

a.reshape(3, 3) # ValueError: cannot reshape array of size 8 into shape (3, 3)
```

> a 는 8개의 원소가 있으므로 reshape 할 때도 **원소 개수는 8개로 유지되어야** 한다.

## Array indexing
2차원 이상의 배열에서는 인덱싱이 조금 더 복잡해진다. 예를 들어, 2차원 배열에서는 `a[i, j]` 형태로 인덱싱을 한다. 3차원 배열에서는 `a[i, j, k]` 형태로 인덱싱을 한다.

아래와 는 indexing 과 slicing 의 예시 코드

```python
a = np.array([[0,  1,  2,  3,  4,  5 ],
              [6,  7,  8,  9,  10, 11],
              [12, 13, 14, 15, 16, 17],
              [18, 19, 20, 21, 22, 23],
              [24, 25, 26, 27, 28, 29],
              [30, 31, 32, 33, 34, 35]])

# 0번째 row, 0번째 column의 원소를 선택
print(a[0, 0]) # 0

# 0번째 row, 3번째 column부터 4번째 column까지의 원소를 선택
print(a[0, 3:5]) # [3 4]

# 4번째 row 부터 끝, 4번째 column 부터 끝까지의 원소를 선택
print(a[4:, 4:]) # [[28 29]
                 #  [34 35]]

# 모든 row, 2번째 column의 원소를 선택
print(a[:, 2]) # [2, 8, 14, 20, 26, 32]

# 2번째 row, 모든 column의 원소를 선택
print(a[2, :]) # [12 13 14 15 16 17]

# Slices are reference to memory in the original array
b = a[0, 3:5]
b[0] = 100
print(a[0, 3:5]) # [100 4]
```
> `a[0, 3:5]` 는 a 배열의 0번째 행에서 3번째 열부터 4번째 열까지의 원소를 선택하는 것이다. 이때 선택된 원소들은 a배열의 일부이므로, b배열에서 `b[0] = 100` 으로 값을 변경하면 **a배열에서도 해당 원소가 변경**된다.

> deep copy 를 하고 싶다면 `b = a[0, 3:5].copy()` 사용

이밖에도 여러 Indexing 방법이 있다.

### Indexing by position
> 위치에 의한 Indexing

```python
a = np.arange(0, 80, 10)
indices = [1, 2, -3]

print(a) # [ 0 10 20 30 40 50 60 70]
print(a[indices]) # [10 20 50]
```

### Indexing by boolean
> dtype 이 boolean 인 배열(Mask 라고 부름) 을 이용한 Indexing

```python
a = np.arange(0, 80, 10)
mask = np.array([0, 1, 1, 0, 0, 1, 0, 0], dtype=bool)

print(a[mask]) # [10 20 50]
print(a[a > 20]) # [30 40 50 60 70]
print(a[(a > 20) & (a < 60)]) # [30 40 50]
```

> Numpy 배열에서 다중 조건을 걸때는 `&` (and), `|` (or), `~` (not) 연산자를 사용한다. `and`, `or`, `not` 키워드가 아님을 주의

## Indexing with newaxis
> numpy array 의 차원을 늘리는 방법, 1D는 2D, 2D는 3D 로..

* newaxis is a special index that inserts a new axis in the array at the specified location
* Each newaxis increases the array's dimensionality by 1
* Each newaxis expands the dimensions by adding one unit-length dimension

```python
import numpy as np

a = np.array([1, 2, 3])
print(a.shape) # (3,) - 1차원 배열

# 1. Row vector 로 변환 (1D -> 2D)
row_vec = a[np.newaxis, :]
print(row_vec.shape) # (1, 3)
print(row_vec)       # [[1 2 3]]

# 2. Column vector 로 변환 (1D -> 2D)
col_vec = a[:, np.newaxis]
print(col_vec.shape) # (3, 1)
print(col_vec)       # [[1]
                     #  [2]
                     #  [3]]
```

> `np.newaxis == None` 이므로 `a[np.newaxis, :]` 는 `a[None, :]` 와 동일하다.

## Datatype
* Every numpy array is a **grid of elements of the same type**
* Numpy tries to guess a datatype when you create an array, but you can also explicitly specify the datatype

```python
a = np.array([1, 2])
print(a.dtype) # int64

a = np.array([1.0, 2.0])
print(a.dtype) # float64

a = np.array([1, 2], dtype=np.float64)
print(a.dtype) # float64
```

|Basic Type|Available Numpy types|Code|Comments|
|---|---|---|---|
|Boolean|bool|b|Elements are 1 bytes in size|
|Integer|int8, int16, int32, int64, int128 int|i|int defaults to size of long in C for the platform|
|Unsigned Integer|uint8, uint16, uint32, uint64, uint128|u|uint defaults to size of unsigned long in C for the platform|
|Float|float16, float32, float64, float, longfloat|f|float is always a double precision floating point value (64bits). longfloat represents large precision floats. Its size is platform dependent.|
|Complex|complex64, complex128, complex, longcomplex|c|The real and imaginary elements of a complex64 are each represented by a single precision (32bit) value for a total size of 64bits.|
|Strings|str, unicode|S or a, U|For example, dtype='S4' would be used for an array of 4-character strings.|
|DateTime|datetime64, timedelta64|M, m|Allow operations between dates and/or times. New in 1.7.|
|Object|object|O|Represent items in array as Python objects.|
|Records|void|V|Used for arbitrary data structures.|

## Mathematical operations
> Basic mathematical functions operate **element-wise** on arrays

예시를 보면 알겠지만, 보통 말하는 행렬의 곱셈과는 다르다. `a * b` 는 a와 b의 원소별 곱셈을 의미한다.

```python
a = np.array([[1, 2, 3], [4, 5, 6]])
b = np.array([[7, 8, 9], [10, 11, 12]])

print(a + b) # [[ 8 10 12]
             #  [14 16 18]]

print(a * b) # [[ 7 16 27]
             #  [40 55 72]]

print(a - b) # [[-6 -6 -6]
             #  [-6 -6 -6]]

print(a / b) # [[0.14285714 0.25       0.33333333]
             #  [0.4        0.45454545 0.555556]]

print(a ** b) # [[      1       256      19683]
              #  [   16384    9765625  2176782336]]

print(a ** 2) # [[ 1  4  9]
              #  [16 25 36]]
```

## sum()

`sum(a, axis=j)` 은 여러 element 의 합을 의미한다. 이는 곧 하나의 원소로 표현되고 하나의 원소는 **차원의 축소(Dimensionality Reduction)**로 이어진다. 인자로 주어지는 `axis` 는 어떤 차원을 기준으로 합을 구할지 or 차원을 축소할지를 결정한다.

* `sum(a, axis=j)` defaults to adding up all the values in an array along the jth axis.
  * jth = j 번째

```python
a = np.array([[1, 2, 3],
              [4, 5, 6]])

print(a.shape) # (2, 3)

print(np.sum(a, axis=0)) # [5 7 9]
print(np.sum(a, axis=1)) # [ 6 15]
print(np.sum(a)) # 21
```
* `np.sum(a, axis=0)` 은 첫번째 차원을 기준으로 압축, 3개가 남은 1차원 배열이 된다.
* `np.sum(a, axis=1)` 은 두번째 차원을 기준으로 압축, 2개가 남은 1차원 배열이 된다.
* `np.sum(a)` 는 모든 원소를 더하므로 하나의 스칼라 값이 된다.

> `np.sum()` 대신 곱셈을 원한다면 `np.prod()` 함수를 사용하면 된다. `np.prod(a, axis=j)`

## Min / Max
`min(a, axis=j)`, `max(a, axis=j)` 는 여러 element 의 최솟값과 최댓값을 의미한다. 이또한 하나의 원소로 표현되고 하나의 원소는 **차원의 축소**로 이어진다.

```python
a = np.array([[4, 2, 6],
              [1, 5, 3]])

print(np.min(a, axis=0)) # [1 2 3]
print(np.min(a, axis=1)) # [2 1]
print(np.max(a, axis=0)) # [4 5 6]
print(np.max(a, axis=1)) # [6 5]
```
1. `np.min(a, axis=0)` 은 첫번째 차원을 기준으로 압축, 각 column 별로 최솟값이 남은 1차원 배열이 된다.
2. `np.min(a, axis=1)` 은 두번째 차원을 기준으로 압축, 각 row 별로 최솟값이 남은 1차원 배열이 된다.
3. `np.max(a, axis=0)` ..., 각 column 별로 최댓값이 남은 1차원 배열이 된다.
4. `np.max(a, axis=1)` ..., 각 row 별로 최댓값이 남은 1차원 배열이 된다.

```python
a = np.array([[4, 2, 6],  # 0번 자리 (인덱스 0)
              [1, 5, 3]]) # 1번 자리 (인덱스 1)

print(np.argmin(a, axis=0)) # [1 0 1]
print(np.argmin(a, axis=1)) # [1 0]
print(np.argmax(a, axis=0)) # [0 1 0]
print(np.argmax(a, axis=1)) # [2 1]
```

`argmin()`, `argmax()` 는 최솟값과 최댓값의 **인덱스**를 의미한다.

> 이밖에도 여러 집계 함수들이 존재한다.
> * `np.mean(a, axis=j)`: 평균값
> * `np.std(a, axis=j)`: 표준편차
> * `np.var(a, axis=j)`: 분산

## Dot product
이전에 `*` 는 ement-wise 곱셈이었는데, `dot()` 은 행렬의 곱셈을 의미한다. 최신 문법으로 `@` 연산자를 이용해 행렬의 곱셈을 할 수도 있다.

```python
a = np.array([[1, 2],
              [3, 4]])
b = np.array([[5, 6],
              [7, 8]])

print(np.dot(a, b)) # [[19 22]
                    #  [43 50]]

print(a @ b) # [[19 22]
             #  [43 50]]
```

![Dot product](https://velog.velcdn.com/images%2Ftreejy%2Fpost%2F5af553c0-06c0-4a4f-9895-b15f883e04d0%2Fimage.png)

[Image Source](https://velog.io/@treejy/DP-BOJ-11049%EB%B2%88-%ED%96%89%EB%A0%AC-%EA%B3%B1%EC%85%88-%EC%88%9C%EC%84%9C-%ED%8C%8C%ED%97%A4%EC%B9%98%EA%B8%B0-1-%EA%B0%9C%EB%85%90)

## Broadcasting
> Shape이 서로 다른 Numpy array 들 간의 산술 연산을 가능하게 해주는 메커니즘. 작은 배열을 큰 배열의 크기에 맞게 내부적으로 **확장(Stretch)**하여 연산이 가능하도록 만들어 준다.

* Numpy arrays of different dimensionality can be combined in the same expression
* Arrays with **smaller dimension** are **broadcasted** to match the larger arrays, **without copying data**, so that they have equal size

예제를 보면 이해가 빠르다.
```python
a = np.array([1, 2, 3])
b = 2
print(a * b) # [2 4 6]
```
![Broadcasting1](https://numpy.org/doc/stable/_images/broadcasting_1.png)

```python
a = np.array([[ 0.0,  0.0,  0.0],
              [10.0, 10.0, 10.0],
              [20.0, 20.0, 20.0],
              [30.0, 30.0, 30.0]])
b = np.array([1.0, 2.0, 3.0])
print(a + b) # [[ 1.  2.  3.]
             #  [11. 12. 13.]
             #  [21. 22. 23.]
             #  [31. 32. 33.]]

b = np.array([1.0, 2.0, 3.0, 4.0])
print(a + b) # ValueError: operands could not be broadcast together with shapes (4,3) (4,)
```
![Broadcasting2](https://numpy.org/doc/stable/_images/broadcasting_2.png)

> Stretch 를 할땐 실제 Memory 상에서 Copy 가 일어나지 않고 가상적으로 배열이 존재하는것 처럼 연산이 이루어 진다. 메모리를 아끼면서 속도도 매우 빠름

### The Rules of Broadcasting
Broadcasting 이 아무렇게나 이루어 지지는 않고 엄격한 3가지 규칙이 존재한다.
1. **차원 맞추기**: 두 배열의 차원 수(ndim) 가 다르면, **더 작은 배열의 shape 왼쪽에 1을 추가**하여 차원을 맞춘다.
2. **크기 확장**: 특정 **차원의 크기가 1인 배열**은, 연산하려는 다른 배열의 해당 차원 크기에 맞춰서 **확장(Stretch)**된다.
3. **Error 발생**: 차원 크기가 1도 아니고 서로 다르다면 연산이 불가능하며 에러가 발생한다.

위 코드
```python
b = np.array([1.0, 2.0, 3.0, 4.0])
print(a + b) # ValueError: operands could not be broadcast together with shapes (4,3) (4,)
```
을 보면 차원(ndim) 이 더 작은 `b` 의 shape 왼쪽에 1이 추가되어 `(1, 4)` 가 된다. 하지만 연산하려는 `a` 의 shape 는 `(4, 3)` 이므로, `4 != 3` 이 되어 에러가 발생한다. 만약 `b` 의 shape 가 `(1, 3)` 이었다면, `a` 의 shape `(4, 3)` 과 호환되어 연산이 가능했을 것이다.