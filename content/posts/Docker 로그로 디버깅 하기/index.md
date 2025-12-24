---
title: "Docker 로그로 디버깅 하기"
description: "실행 중 종료된 Container의 원인을 파악하기 위해 docker logs 명령어를 사용하여 디버깅하는 방법을 PostgreSQL 예시로 알아봅니다."
date: "2025-06-05"
keywords: "Docker"
---

# log

Container 가 지금까지 잘 실행되었지만 가끔 Container 가 바로 종료되거나 정상적으로 실행되지 않을 경우가 많습니다.

이럴땐 실행중인 Container 가 없기 때문에 난감할 수 있는데요.

이렇게 실행중이지 않는 Container 의 상태를 확인하고 어디서 문제가 발생했는지 확인하는 방법을 알아보겠습니다.

## PostgreSQL

예시로 사용할 Image 는 PostgreSQL 입니다.

> [https://hub.docker.com/_/postgres](https://hub.docker.com/_/postgres)

해당 사이트로 접속하면 PostgreSQL Image 의 사용법을 확인할 수 있습니다.

```bash
$ docker container run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

지금까지 Container 를 다뤄봤다면 Container 내부가 마치 Linux 처럼 느껴질 것입니다.

그러므로 Container 내부에서 사용할 환경변수를 설정할 수 있습니다.

`-e POSTGRES_PASSWORD=mysecretpassword` 가 바로 그 환경변수 인것이죠.

나중에 해당 Container 내부에 접속해 `echo $POSTGRES_PASSWORD` 명령어를 실행해보면 설정한 환경변수 값을 확인할 수 있습니다.

일단 처름 Container 를 실행하기 전 환경변수를 설정하지 않고 실행해보겠습니다.

```bash
$ docker container run --name some-postgres -d postgres
```

하지만 이렇게 실행한 Container 는 바로 종료됩니다. 종료가 왜 되었는지는 이미 알지만 모른다 가정해보면 상당히 골치아픈 상황이죠.

이럴땐 문제가 발생한 Container 의 로그를 확인해보면 됩니다.

```bash
$ docker container logs some-postgres
```

```text:OUTPUT
Error: Database is uninitialized and superuser password is not specified.
        You must specify POSTGRES_PASSWORD to a non-empty value for the
        superuser. For example, "-e POSTGRES_PASSWORD=password" on "docker run".

        You may also use "POSTGRES_HOST_AUTH_METHOD=trust" to allow all
        connections without a password. This is *not* recommended.

        See PostgreSQL documentation about "trust":
        https://www.postgresql.org/docs/current/auth-trust.html
```

이렇게 로그를 확인해보면, PostgreSQL 데이터베이스가 초기화되지 않았고 슈퍼유저 비밀번호가 지정되지 않았다는 오류 메시지를 볼 수 있습니다.

이제 환경변수를 설정하고 다시 실행해보겠습니다.

```bash
$ docker container run --name some-postgres -e POSTGRES_PASSWORD=password -d postgres
```

해댕 Container 는 이제 정상적으로 실행됩니다.

```bash
$ docker container ls
```

```text:OUTPUT
CONTAINER ID   IMAGE      COMMAND                   CREATED         STATUS         PORTS      NAMES
5ba2dc46d37c   postgres   "docker-entrypoint.s…"   5 seconds ago   Up 5 seconds   5432/tcp   some-postgres
```