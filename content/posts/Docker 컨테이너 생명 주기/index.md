---
title: "Docker 컨테이너 생명 주기"
description: "Container의 Main Process(PID 1) 개념과 이것이 컨테이너의 실행 및 종료에 미치는 영향을 알아봅니다."
date: "2025-05-28"
keywords: "Docker"
---

# Main Process
지금까지 컨테이너를 생성하고, 내부에 진입하며, 다양한 명령어를 실행해보는 방법을 알아봤습니다. 이 과정을 통해 **컨테이너는 하나의 격리된 프로세스 환경이며, 불필요한 도구 없이 최소한의 실행 환경만 포함하고 있다**는 점을 자연스럽게 체감하셨을 겁니다.

이제 중요한 개념 하나를 짚고 넘어가야 합니다. 바로 컨테이너의 **Main Process 가 무엇이며, 그것이 어떻게 컨테이너의 생명주기와 연결되는가**입니다.

## Nginx 는 왜 종료되지 않았을까

먼저 `Nginx` 컨테이너의 동작을 다시 떠올려 봅시다. 아래는 우리가 앞서 자주 사용했던 컨테이너 실행 명령어입니다.

```bash
docker container run -d --name nginx -p 8080:80 nginx
```

이 명령어로 생성된 컨테이너는 별다른 입력 없이도 계속 실행 상태를 유지합니다. 그 이유는 무엇일까요?

바로 `Nginx` Image 가 내부적으로 다음과 같은 **기본 실행 명령어(CMD) 를 가지고 있기 때문**입니다:

```bash:nginx-기본-실행-명령어
CMD ["nginx", "-g", "daemon off;"]
```

즉, 위 명령어는 결국 아래와 같이 해석됩니다.

```bash
docker container run -d --name nginx -p 8080:80 nginx nginx -g "daemon off;"
```

여기서 `daemon off;` 는 Nginx 가 백그라운드로 전환하지 않고 포그라운드에서 계속 실행되도록 하는 설정입니다.

이처럼 메인 프로세스(Main Process)가 종료되지 않고 계속 살아 있는 상태이기 때문에 컨테이너 역시 종료되지 않고 유지됩니다.

> 컨테이너에서 말하는 Main Process 는 내부에서 실행되는 **PID 1 인 프로세스**를 의미합니다.

Docker 컨테이너는 **PID 1 프로세스가 종료되면 전체 컨테이너도 종료되는 구조를 가지고 있**습니다.

`Nginx` 이미지는 이 원리를 정확히 반영하여, 컨테이너가 종료되지 않도록 포그라운드 실행 방식을 택하고 있는 것입니다.


## 사용자 정의 COMMAND

Container 를 실행할 때는 사용자가 직접 명령어(COMMAND) 를 지정하여 **기본 실행 명령어를 덮어쓸 수도 있**습니다. 예를 들어 다음 명령어를 실행해 보세요.

```bash
docker container run --name test nginx ls
```

이 명령어는 nginx 이미지로 컨테이너를 생성한 뒤, 기본 명령어 대신 `ls` 명령어를 실행합니다.

결과는 어떻게 될까요? 컨테이너는 즉시 종료될 것입니다. 실제로 이 명령어는 다음과 같은 과정을 거칩니다.

1. `Nginx` Image 를 기반으로 Container 생성
2. `ls` 명령어를 PID 1 프로세스로 실행
3. `ps`명령어가 실행 후 종료되면서, 컨테이너도 함께 종료됨


이처럼 **컨테이너는 내부에서 실행된 PID 1 Process 의 생명주기를 따르기 때문**에, 단일 명령어처럼 짧게 실행되는 Process 를 지정하면 Container 도 짧은 생명주기를 갖게 됩니다.

## Ubuntu 에서 직접 확인해보기

Nginx 이미지는 최소한의 실행 환경만을 포함하고 있어서 `ps` 명령어조차 존재하지 않습니다. 따라서 PID 상태를 직접 확인하려면 더 일반적인 리눅스 배포판인 ubuntu 이미지를 사용하는 것이 좋습니다.

```bash
docker container run -it --name ubuntu ubuntu:22.04 /bin/bash
```

위 명령어로 Ubuntu Container 를 실행하면, `/bin/bash` 가 PID 1 Process 로 실행됩니다. 또한 `-it` 옵션 덕분에 터미널과의 상호작용이 유지되므로 명령어를 직접 입력할 수 있습니다.

이제 다음과 같이 `ps` 명령어를 입력해 현재 컨테이너 내부의 프로세스를 확인해 봅시다.
```bash
root@956a58a56330:/# ps
  PID TTY          TIME CMD
    1 pts/0    00:00:00 bash
    9 pts/0    00:00:00 ps
```

여기서 **PID가 1 인 bash가 이 컨테이너의 Main Process**입니다. 이 Process 를 종료하면 Container 도 함께 종료됩니다.

직접 `exit` 명령어나 `Ctrl + D` 를 통해 셸을 종료해 보면, Docker Desktop 또는 `docker ls` 명령어를 통해 Container 가 종료되었음을 확인할 수 있습니다.

***

# 두줄 요약

Container 는 항상 살아있는 VM 같은 존재가 아닙니다.

Container 내부에서 실행되는 PID 1 Process 가 살아 있는 동안만 Container 도 살아 있습니다.
