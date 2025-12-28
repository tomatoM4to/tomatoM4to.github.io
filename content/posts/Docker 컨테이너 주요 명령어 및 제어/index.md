---
title: "Docker 컨테이너 주요 명령어 및 제어"
description: "Docker 컨테이너 를 생성, 종료, 삭제, 관리 하는 필수 명령어들을 알아봅시다."
date: "2025-05-27"
keywords: "Docker"
---

# Container 생성

> 예전에는 `docker run` 명령어로 컨테이너를 생성하고 실행했지만, Docker 1.13 버전 이후로는 명시적으로 container 관련 명령어라는걸 구분하기 위해 `docker container run` 으로 사용하는걸 권장하고 있다. 그러므로 여기선 `docker container` 기준으로 설명하겠다.

```bash
docker container run -d IMAGE_NAME
```

해당 명령어는 새로운 컨테이너를 생성하고 실행하는데 사용된다. 지정한 이미지가 시스템에 존재하지 않을 경우, Docker Hub 에서 이미지를 다운로드 한다.

터미널은 기본적으로 하나의 프로세스를 실행하고 대기하는 구조이기 때문에, 컨테이너가 종료되지 않는 이상 터미널 제어가 돌아오지 않는다. 이렇게 되면 터미널의 사용이 불가능해지므로, `-d` 옵션을 사용해 컨테이너를 백그라운드로 실행하도록 한다. 이러면 터미널이 차단되지 않는다. 대부분의 경우 `-d` 옵션을 사용해 실행하므로 습관적으로 붙여주자.

# Container 목록 확인

```bash
docker container ls -a
docker ps -a
```
해당 명령어는 현재 시스템에 존재하는 모든 컨테이너 목록을 보여준다. `-a` 옵션을 추가하지 않으면 실행 중인 컨테이너만 표시된다. 두 명령어 모두 동일한 기능을 수행하므로 편한 것을 사용하면 된다. 필자도 귀찮아서 보통 `docker ps -a` 로 사용한다.

# Container 종료

```bash
docker container stop CONTAINER_NAME
```

# 기본 명령어

이번 장에서는 컨테이너를 **생성, 실행, 종료, 삭제**하는 기본 명령어들을 익혀보겠습니다. 이 장을 마치면 다음과 같은 Docker 명령어들을 능숙하게 사용할 수 있게 될 겁니다.

```bash
docker container run -d --rm --name CONTAINER_NAME IMAGE_NAME
docker container ls -a
docker container stop CONTAINER_NAME
docker container rm -f CONTAINER_NAME
```


## Container 생성

`docker container run` 명령어는 새로운 컨테이너를 생성하고 실행하는 데 사용됩니다. 지정한 이미지가 로컬에 존재하지 않을 경우, **Docker는 자동으로 Docker Hub에서 이미지를 다운**로드합니다.

다음 명령어로 nginx 컨테이너를 실행해봅시다.

```bash
docker container run --publish 7777:80 nginx
```

위 명령어를 실행하면 다음과 같은 일이 발생합니다.
1. 로컬에 `nginx` Image 가 없으면 Docker Hub 에서 자동으로 다운로드
2. Image 기반으로 Container 를 생성
3. Container 내부의 80번 포트를 호스트의 7777 포트에 매핑
4. `nginx` 웹 서버가 시작됨

Docker Desktop의 Images 탭에서 nginx 이미지가 다운로드된 것을 확인할 수 있고, Containers 탭에서는 실행 중인 컨테이너 목록을 볼 수 있습니다.

TODO: 테스크탑 이미지 준비

> `--publish` 옵션과 `7777:80` 부분은 **호스트의 7777 포트를 컨테이너 내부의 80 포트에 매핑**하는 역할을 합니다. 즉, 호스트에서 `localhost:7777`로 접속하면 컨테이너 내부의 웹 서버에 접근할 수 있게 됩니다. 자세한 사항은 네트워크 장에서 다룰 예정입니다.

## 터미널 멈춘 현상

실행해보면 터미널이 멈춘 것처럼 보일 수 있습니다. 왜일까요?

**Docker 컨테이너는 프로세스**입니다. **터미널은 기본적으로 하나의 프로세스를 실행하고 대기하는 구조**이기 때문에, 컨테이너가 종료되지 않는 이상 터미널 제어가 돌아오지 않습니다.

이런 경우에는 `-d` 옵션을 사용해 컨테이너를 백그라운드로 실행하면 터미널이 차단되지 않습니다.

```bash
docker container run -d --name nginx --publish 8888:80 nginx
```


## Container 이름 지정

기본적으로 Docker는 생성된 컨테이너에 랜덤한 이름을 부여합니다. 이를 확인하려면 다음 명령어를 사용합니다. 해당 명령어는 현재 실행 중인 컨테이너 목록을 보여줍니다.

```bash
PS C:\> docker container ls
CONTAINER ID   IMAGE     COMMAND                   CREATED              STATUS          PORTS                  NAMES
75bbe4cbb41d   nginx     "/docker-entrypoint.…"   About a minute ago   Up 22 seconds   0.0.0.0:7777->80/tcp   exciting_bartik
```

`docker container ls` 명령어를 입력하면 현재 실행 중인 Container 목록을 확인할 수 있습니다. 전 `execiting_bartik` 라는 이름을 Docker 가 자동으로 지정해 줬네요.

하지만 이런 랜덤한 이름은 그닥 도움이 되지는 않는거 같습니다. Container 에 이름을 지정하려면 `--name CONTAINER_NAME` 옵션을 추가하면 됩니다.

```bash
PS C:\> docker container run -d --name nginx --publish 8888:80 nginx
9d4fda1750dca131b8ecb600513ef12ffa0394dc2924f0cdde5fcf1ecd2ff52a
PS C:\> docker container ls
CONTAINER ID   IMAGE     COMMAND                   CREATED          STATUS          PORTS                  NAMES
9d4fda1750dc   nginx     "/docker-entrypoint.…"   33 seconds ago   Up 33 seconds   0.0.0.0:8888->80/tcp   nginx
75bbe4cbb41d   nginx     "/docker-entrypoint.…"   5 minutes ago    Up 3 minutes    0.0.0.0:7777->80/tcp   exciting_bartik
```

전 `nginx` 라는 이름을 지정했습니다. 이제 다시 `docker container ls` 명령어를 입력해 보면 `NAMES` 열에 `nginx` 라는 이름을 가진 Container 가 실행 중인 것을 확인할 수 있습니다. 이제 `localhost:8888` 로 접속하면 `nginx` Container 의 웹 페이지를 확인할 수 있습니다. 각 Container 는 서로 독립된 존재라는걸 인지해야 합니다.

## Container 멈추기

하지만 이렇게 같은 기능을 가진 Container 가 여러개 있는건 보기 안좋으니 `nginx` Container 를 멈춰 봅시다. 이전에 `NAMES` 를 세팅해뒀기 때문에 아래와 같이 `NAMES` 를 기준으로 Container 를 멈출 수 있습니다.

```bash
PS C:\> docker container stop nginx
nginx
```

이후 `docker container ls` 를 입력해보면, 해당 컨테이너는 더 이상 목록에 나타나지 않습니다. 단, **종료된 컨테이너는 여전히 시스템 내에 존재**하며, 이를 확인하려면 다음 명령어를 사용합니다:

```bash
PS C:\> docker container ls -a
CONTAINER ID   IMAGE     COMMAND                   CREATED         STATUS                            PORTS                  NAMES
9d4fda1750dc   nginx     "/docker-entrypoint.…"   4 minutes ago   Exited (137) About a minute ago                          nginx
75bbe4cbb41d   nginx     "/docker-entrypoint.…"   8 minutes ago   Up 7 minutes                      0.0.0.0:7777->80/tcp   exciting_bartik
```

단순히 `docker container ls` 명령어를 입력하면 실행 중인 Container 만 보여주지만, `-a` **옵션을 추가하면 멈춘 Container 까지 모두 보여줍**니다. 위 예시에서 `nginx` Container 는 멈춘 상태로 남아있고, `exciting_bartik` Container 는 여전히 실행 중인 것을 확인할 수 있습니다.


## Container 삭제

그리고 이제 실습용으로 만든 해당 Container 들을 전부 삭제해 봅시다. `docker container rm` 명령어를 사용하여 Container 를 삭제할 수 있습니다. 하지만 **멈춰있는 Container 만 삭제할 수 있**기 때문에, `nginx` Container 만 삭제가 가능합니다.

실행중인 `exciting_bartik` Container 는 삭제할 수 없습니다. 이렇게 실행중인 Container 를 강제로 삭제하고 싶다면 `-f` 옵션을 추가하면 됩니다. 아래와 같이 차례대로 입력해 모든 Container 를 삭제해 봅시다.

```bash
PS C:\> docker container rm nginx
nginx
PS C:\> docker container rm -f exciting_bartik
exciting_bartik
PS C:\> docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

## Container 자동 삭제

컨테이너가 종료될 때 자동으로 삭제되길 원한다면, `--rm` 옵션을 사용합니다. 다음 예시처럼 실행하면, 컨테이너가 멈추는 순간 시스템에서 완전히 제거됩니다.

```bash
docker container run -d --rm --name nginx --publish 9999:80 nginx
```

***

# 결론

여기까지 우리는 다음 명령어들을 중심으로 컨테이너를 생성, 확인, 종료, 삭제하는 기본적인 Docker 사용법을 익혔습니다.

* docker container run -d --rm --name CONTAINER_NAME IMAGE_NAME
* docker container stop
* docker container ls -a
* docker container rm -f