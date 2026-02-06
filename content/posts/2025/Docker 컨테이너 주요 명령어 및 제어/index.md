---
title: "Docker 컨테이너 주요 명령어 및 제어"
description: "Docker 컨테이너 를 생성, 종료, 삭제, 관리 하는 필수 명령어들을 알아봅시다."
date: "2025-05-27"
keywords: "Docker"
---

# Container

예전에는 `docker run` 명령어로 컨테이너를 생성하고 실행했지만, Docker 1.13 버전 이후로는 명시적으로 container 관련 명령어라는걸 구분하기 위해 `docker container run` 으로 사용하는걸 권장하고 있다. 그러므로 여기선 `docker container` 기준으로 설명하겠다.

## docker container run

컨테이너를 생성하고 실행하는 명령어는 `docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]` 명령어를 사용해 이미지를 기반으로 새로운 컨테이너를 생성하고 실행할 수 있다. 지정한 **이미지가 시스템에 존재하지 않을 경우**, Docker Hub 에서 **이미지를 다운로드** 한다.

예를 들어, Nginx 웹 서버를 실행하려면 다음과 같이 입력한다.

```bash
docker container run -d -p 7777:80 nginx:latest
```

이후 브라우저에서 `localhost:7777` 로 접속하면 컨테이너 내부의 80번 포트에서 동작중인 Nginx 웹 서버에 접속할 수 있다.

각 옵션의 의미는 다음과 같다.
* `-d` : 컨테이너를 백그라운드에서 실행
* `-p 7777:80` : 호스트의 7777 포트를 컨테이너의 80 포트에 매핑
* `nginx:latest` : 사용할 이미지 이름과 태그, 태그를 생략하면 `latest` 가 기본값으로 사용된다.

> 터미널은 기본적으로 하나의 프로세스를 실행하고 대기하는 구조이기 때문에, 컨테이너가 종료되지 않는 이상 터미널 제어가 돌아오지 않는다. 그러므로 `-d` 옵션을 사용해 컨테이너를 **백그라운드로 실행**하도록 한다. 대부분의 경우 `-d` 옵션을 사용해 실행하므로 습관적으로 붙여주자.

컨테이너를 생성할 때 자주 사용하는 옵션들은 다음과 같다. 순서는 중요하지 않다.

1. `--name CONTAINER_NAME` : 컨테이너 이름 지정, 지정하지 않으면 랜덤 이름 부여
2. `--publish HOST_PORT:CONTAINER_PORT` : 호스트 포트와 컨테이너 포트 매핑
3. `--rm` : 컨테이너 종료 시 자동 삭제
4. `-e ENV_VAR=VALUE` : 환경 변수 설정, 예: `-e MYSQL_ROOT_PASSWORD=my-secret-pw`
5. `-v HOST_PATH:CONTAINER_PATH` : 볼륨 마운트

### COMMAND 와 ARG
컨테이너의 본질은 격리된 프로세스지만, 여기선 이해를 위해 애플리케이션을 실행하기 위한 작은 컴퓨터 라고 생각해보자. 컴퓨터가 켜지면 운영체제가 자동으로 실행되듯이, 컨테이너도 생성되고 시작될 때 자동으로 실행되는 기본 명령어가 있다.

이때 `docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]` 명령어에서 `IMAGE` 뒤에 오는 `COMMAND` 와 `ARG` 는 컨테이너가 시작될 때 실행할 명령어와 그에 대한 인자를 지정하는 부분이다. 이렇게 **실행된 명령어는 컨테이너 내부에서 PID 1 프로세스가 되며**, 이 프로세스가 종료되면 컨테이너도 함께 종료된다. 사실상 **컨테이너의 생명 주기는 이 PID 1 프로세스에 달려있는 셈**이다.

아래 명령어를 실행해 보자.
```bash
docker container run nginx echo "Hello Docker"
```

이 명령어는 `nginx` 이미지를 기반으로 컨테이너를 생성하고, `echo "Hello Docker"` 명령어를 실행한다. `echo` 명령어는 메시지를 출력하고 바로 종료되는 단발성 프로세스이므로, **PID 1 프로세스가 종료됨에 따라 컨테이너도 즉시 종료된다.**

* COMMAND : 컨테이너가 시작될 때 실행할 명령어 (예: `echo`)
* ARG : 명령어에 전달할 인자 (예: `"Hello Docker"`)

만약 `COMMAND` 와 `ARG` 를 지정하지 않으면, 컨테이너는 이미지에 정의된 기본 명령어를 실행한다. Dockerfile 에서 `CMD` 나 `ENTRYPOINT` 로 지정된 명령어가 이에 해당한다.

Nginx 이미지의 기본 명령어는 아래 링크를 참고하자.

[https://hub.docker.com/layers/library/nginx/latest/images/](https://hub.docker.com/layers/library/nginx/latest/images/)

링크를 따라가 `Dockerfile` 탭을 클릭하면, `CMD ["nginx", "-g", "daemon off;"]` 라고 적혀있는걸 볼 수 있다.

즉, `docker container run nginx` 명령어는 실제론 아래와 동일한 의미를 가진다.

```bash
docker container run nginx:latest nginx -g 'daemon off;'
```

### run = create + start

`docker container run` 명령어는 내부적으로 `create` 와 `start` 두 단계를 거친다.
* `docker container create IMAGE_NAME` : 이미지 레이어 위에 쓰기 가능한 컨테이너 레이어를 생성하고 실행 환경 구성, `--name`, `-e`, `-v` 등 옵션이 여기에 적용됨
* `docker container start [CONTAINER_NAME or ID]` : 구성된 환경 안에서 실제 프로세스를 실행

보통 실행 전 `docker container inspect` 를 통해 컨테이너의 메타데이터가 올바른지 확인한 후 `start` 명령어로 실행하는 경우가 많다. 하지만 일반적인 사용에서는 `run` 명령어 하나로 충분하다.

## docker ps

```bash
docker container ls -a
docker ps -a
```
해당 명령어는 현재 시스템에 존재하는 모든 컨테이너 목록을 보여준다. `-a` 옵션을 추가하지 않으면 실행 중인 컨테이너만 표시된다. 두 명령어 모두 동일한 기능을 수행하므로 **편한 것을 사용**하면 된다.

### --size

`--size` 옵션을 추가하면 각 컨테이너가 사용 중인 디스크 공간 정보를 함께 표시한다.

이때 표시되는 정보가 두가지 있다.
1. `SIZE`: 컨테이너의 쓰기 가능한 레이어가 사용 중인 디스크 공간
2. `VIRTUAL SIZE`: 읽기 전용 이미지 데이터 + 쓰기 가능한 레이어가 합쳐진 전체 크기


## docker container logs

컨테이너를 백그라운드에서 실행하면 내부 프로세스가 현재 어떤 상태인지 직접 확인하기 어렵다. 이때 `logs` 명령어를 사용하면 컨테이너가 실행되며 출력한 로그 기록을 불러올 수 있다.

```bash
docker container logs -f --tail [NUMBER] [CONTAINER_NAME or ID]
```

* `-f` : 컨테이너의 `STDOUT/STDERR` 출력 스트림을 실시간으로 화면에 표시
* `--tail [NUMBER]` : 전체 로그 중 마지막 NUMBER줄만 표시, 로그 양이 방대할 때 필요한 부분만 빠르게 훑어보기 유용

> `ID` 를 사용할 때는 전체를 입력할 필요 없이, 유니크함만 보장된다면 앞의 몇 글자만 입력해도 무방

## docker container stop

컨테이너를 종료하려면 `stop` 명령어를 사용한다. `stop` 명령어에 아무 옵션 없이 사용하면 다음과 같은 절차로 컨테이너를 종료한다.

1. `SIGTERM` 신호를 컨테이너 내부의 주 프로세스에 전송하여 정상 종료 시도
2. 기본적으로 10초 대기
3. 종료되지 않으면 `SIGKILL` 신호를 보내 강제 종료

```bash
docker container stop [CONTAINER_NAME or ID]
```

* `-s`: 신호를 지정하여 보낼 수 있다. 기본값은 `SIGTERM`
* `-t [NUMBER]`: 종료 신호 전송 후 대기 시간을 초 단위로 지정, 기본값은 10초

> 이를 이용해 DB 커넥션을 닫거나, 처리중인 HTTP 요청을 마저 처리하는 등 컨테이너 내부에서 정리 작업을 수행할 시간을 줄 수 있다.

## docker container rm

**중지된 컨테이너**를 시스템에서 완전히 삭제한다. 컨테이너를 삭제하면 해당 컨테이너의 **쓰기 레이어에 저장된 데이터도 함께 삭제**되므로 주의

```bash
docker container rm -f [CONTAINER_NAME or ID]
```

* `-f` : 실행 중인 컨테이너를 강제로 삭제 (`SIGKILL` 신호 사용)
* `-v` : 컨테이너와 연결된 익명 볼륨(Anonymous Volume)도 함께 삭제, 이름이 지정된 볼륨(Named Volume)은 이 옵션을 써도 안전하게 보존
* `--link` : 예전에 사용되던 컨테이너 링크를 삭제, 현재는 잘 사용되지 않으므로 무시해도 무방


## docker container inspect

컨테이너가 어떤 IP 를 받았는지, 볼륨은 어디에 연결되었는지 등 컨테이너의 모든 설정 정보와 상태 값을 JSON 형식으로 출력한다.

```bash
docker container inspect [CONTAINER_NAME or ID]
```

주요 정보
* NetworkSettings: 컨테이너의 IP 주소, 게이트웨이, 포트 포워딩 설정
* Mounts: 호스트와 연결된 볼륨 및 바인드 마운트 정보
* Config: 환경 변수(Env), 실행 명령어(Cmd), 이미지 정보
* State: 컨테이너의 현재 상태(Running, Paused, ExitCode 등) 및 시작/종료 시간

> 출력량이 방대하므로 `grep` 이나 `jq` 같은 도구를 사용하거나, `--format` 옵션을 사용해 필요한 정보만 추출하는 것이 좋다.

## docker container exec

컨테이너는 격리된 프로세스라고 했지만, 좀더 정확히 말하면 **동일한 네임스페이스(Namespace)를 공유하는 프로세스들의 집합** 이라고 할 수 있다. 리눅스 커널은 이 네임스페이스를 통해 프로세스에 격리된 환경을 제공한다.

* `run` : 새로운 네임스페이스를 생성하고 PID 1인 주 프로세스를 실행, 이 주 프로세스가 종료되면 네임스페이스 자체가 파괴되므로 컨테이너도 종료
* `exec` : 이미 생성된 기존 네임스페이스에 **새로운 프로세스를 참여 시키는 시스템 콜**

이를통해 실행 중인 컨테이너 내부에서 쉘을 실행하거나, 특정 명령어를 실행할 수 있다. 아래 명령어는 실행 중인 컨테이너 내부에서 대화형 터미널을 제공하는 예시이다.

```bash
docker container exec -it [CONTAINER_NAME or ID] /bin/bash
```

* `-i` : 표준 입력(STDIN)을 활성화, 키보드로 타이핑 하는 내용을 컨테이너 안의 쉘로 전달
* `-t` : 가상 터미널(TTY) 할당, 터미널 프롬프트 결과를 보기 좋게 출력

이렇게 하면 컨테이너 내부에서 `/bin/bash` 쉘이 실행되고, 마치 리눅스 시스템에 직접 접속한 것처럼 명령어를 입력하고 결과를 확인할 수 있다. 나가고 싶으면 `exit` 를 입력하면 된다.

> 쉘 환경이 필요할때는 `-it` 옵션을 하나의 세트처럼 사용한다, 만약 쉘 접속이 아니라 단순 명령어만 실행하고 싶다면 `docker exec [NAME] ls -a` 처럼 `-it` 옵션 없이 사용해도 무방하다.

이정도 명령어만 알아도 Docker 컨테이너를 생성, 실행, 관리하는데 큰 어려움이 없을 것이다. 더 많은 옵션과 고급 기능들은 공식 문서를 참고하자.

[https://docs.docker.com/reference/cli/docker/](https://docs.docker.com/reference/cli/docker/)