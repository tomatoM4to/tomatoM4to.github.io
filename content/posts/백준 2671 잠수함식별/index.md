---
title: "백준 2671 잠수함식별"
description: "백준 2671번 잠수함 식별 Python 코드"
date: "2021-09-01"
keywords: "백준"
---

나중에 알았지만 정규 표현식 한줄이면 되는 문제였다. 하지만 정규 표현식으로 풀면 이 코드보다 몇배는 더 오래걸린다.

정규표현식은 읽기도 불편하고 성능도 안좋은데 굳이 왜 쓰는지 이해가 잘 가질 않았지만 내 코드를 보니 이해가 간다.

```python
sound = input()
while True:
    Q = 0
    # [100+ 1+]
    if sound[Q] == '1':
        if 4 <= len(sound) and sound[-1] == '1':
            if sound[Q+1] == '0' and sound[Q+2] == '0':
                Q = 3
                if sound[Q] == '0':
                    while True:
                        if sound[Q] == '0':
                            Q += 1
                        else:
                            break
                if sound[Q] == '1':
                    while True:
                        if Q == len(sound) -1:
                            if sound[Q] == '1':
                                print('SUBMARINE')
                                exit(0)
                        if sound[Q] == '1':
                            Q += 1
                        else:
                            if len(sound[Q -1:]) >= 4 and sound[Q -2] == '1':
                                if sound[Q] == '0' and sound[Q+1] == '0':
                                    sound = sound[Q-1:]
                                    break
                            sound = sound[Q:]
                            break
            else:
                print('NOISE')
                exit(0)
        else:
            print('NOISE')
            exit(0)

    #print(sound)
    # [01]+
    Q = 0
    if sound[Q] == '0':
        if len(sound) >= 2 and sound[-1] == '1':
            while True:
                if sound[Q] == '0' and sound[Q+1] == '1':
                    if len(sound) -1 == Q+1:
                        print('SUBMARINE')
                        exit(0)
                    sound = sound[Q+2:]
                else:
                    if sound[0] == '0':
                        print('NOISE')
                        exit(0)
                    break
        else:
            print('NOISE')
            exit(0)
```