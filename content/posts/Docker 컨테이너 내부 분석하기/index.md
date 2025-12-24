---
title: "Docker 컨테이너 내부 분석하기"
description: "docker exec 명령어를 사용하여 실행 중인 컨테이너 내부에 접속하고, 상태를 점검하거나 디버깅하는 방법을 알아봅니다."
date: "2025-05-28"
keywords: "Docker"
---

# Container 디버깅

여기서 말하는 디버깅은 코드의 문제를 분석하는 행위만을 의미하지 않습니다. 서버를 운영하거나 컨테이너로 애플리케이션을 배포한 경우, **컨테이너 자체의 상태를 확인하고 내부를 분석하는 행위** 를 의미합니다.

예를 들어, 백엔드 서버가 배포된 이후 문제 상황이 발생했다고 가정해봅시다. 이럴 때 단순히 코드만 살펴볼 것이 아니라, 서버가 정상적으로 동작 중인지, 설정이 제대로 반영되었는지, **컨테이너 내부 환경에 문제가 없는지 등을 점검**해야 합니다.

특히 `Nginx`, `PostgreSQL` 같은 미리 만들어진 이미지를 사용할 경우, 컨테이너 내부의 구성 파일을 수정해야 할 때가 종종 있습니다.

이런 상황에서 매우 유용한 명령어가 바로 `docker container exec` 입니다.


## `docker container exec` 명령어

```bash
docker container exec --interactive --tty CONTAINER_NAME /bin/bash
```

이 명령어는 현재 실행 중인 컨테이너 내부로 진입하여, 리눅스 쉘 환경에서 명령어를 직접 실행할 수 있게 해줍니다.

옵션 설명
* `--interactive` : 터미널 입력을 컨테이너에 전달 (입력값 유지)
* `--tty` : 터미널 출력 형식으로 결과를 표시 (출력값 보기 좋게)

좁더 쉽게 해석하면

| 옵션 | 쉬운 설명 |
| --- | --- |
| `--interactive` | 내가 입력한 명령어가 컨테이너 내부로 전달되게 한다 |
| `--tty` | 컨테이너의 출력 결과가 내 터미널에 보기 좋게 표시되도록 한다 |

이 두 옵션은 **거의 항상 같이 사용됩**니다. 그래서 보통 줄여서 `-it` 로 사용하죠.

그리고 마지막 `/bin/bash` 는 컨테이너 내부에서 실행할 프로그램입니다. 대부분의 리눅스 기반 이미지에는 `/bin/bash` 또는 `/bin/sh` 같은 **쉘 프로그램이 포함되어 있어**, 이를 통해 컨테이너 내부에서 명령어를 직접 실행할 수 있습니다.

## 일반적인 작업들

컨테이너 내부에 들어가면 마치 **리눅스 서버에 SSH 로 접속한 것처럼** `mkdir`, `ls`, `cat`, `nano`, `vi` 같은 명령어를 사용할 수 있습니다.

이를 통해 다음과 같은 작업들이 가능합니다.

* 로그 파일 확인
* 설정 파일 편집
* 디렉토리 구조 탐색
* 네트워크 및 포트 상태 확인
* 실행 중인 프로세스 모니터링

## 실습

이제 실제로 컨테이너 내부에 접속하고, 명령어를 실행해보는 실습을 진행해보겠습니다.

먼저 아래 명령어를 통해 `nginx` 웹 서버를 백그라운드로 실행합니다.

```bash
docker container run -d --name nginx --publish 8888:80 nginx
```

* `-d`: 백그라운드 실행
* `--name nginx`: 이름 지정
* `--publish 8888:80`: 호스트의 8888 포트를 컨테이너의 80 포트와 연결

컨테이너가 실행 중이라면, 이제 내부로 접속해보겠습니다. 다음 명령어를 통해 **현재 터미널에서 컨테이너 내부의 bash 셸로 진입할 수 있**습니다:

```bash
docker container exec -it nginx /bin/bash
```

프롬프트가 아래와 같이 바뀌면 컨테이너 내부에 정상적으로 접속한 것입니다.

```bash
root@6f6243b228a9:/#
```

컨테이너 내부에서는 **일반적인 리눅스 명령어를 사용할 수 있**습니다. 예를 들어 다음과 같이 `test.txt` 라는 파일을 하나 만들어 보겠습니다:

```bash
root@6f6243b228a9:/# echo "Hello from container!" > test.txt
root@6f6243b228a9:/# ls
bin   dev                  docker-entrypoint.sh  home  lib64  mnt  proc  run   srv  test.txt  usr
boot  docker-entrypoint.d  etc                   lib   media  opt  root  sbin  sys  tmp       var
```

출력 결과에 test.txt 파일이 포함되어 있다면 성공입니다. 컨테이너 셸에서 나가고 싶다면 `exit` 명령어나 `Ctrl + D` 를 눌러 빠져나올 수 있습니다.

이번에는 **컨테이너 내부에 직접 들어가지 않고도 명령어를 실행하는 방법**을 알아보겠습니다. 아까 만든 `test.txt` 파일의 내용을 `cat` 명령어로 확인하고 싶다면, 다음과 같이 실행합니다:

```bash
PS C:\> docker container exec nginx cat test.txt
Hello from container!
```

이 명령어는 컨테이너 내부에서 `cat test.txt` 를 실행하고, 그 결과를 바로 현재 터미널로 출력해줍니다. 출력 결과는 위와 같이 `Hello from container!` 가 됩니다.

이처럼 `docker exec` 명령어를 사용하면 컨테이너에 직접 진입하지 않고도 간단한 명령을 빠르게 실행할 수 있어, 설정 확인이나 파일 상태 점검 등에 매우 유용합니다.

***

# 마무리 요약

* Docker Container 는 단순한 실행 단위가 아니라 조작 가능한 격리된 환경
* 문제가 발생하면, Container 내부로 직접 들어가 원인을 파악하고 수정 가능해야 함
* `docker exec -it [컨테이너 이름] /bin/bash` 명령어는 Container 내부 리눅스 쉘 에 접속하는 데 사용