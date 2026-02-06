---
title: "Docker 볼륨 기본 개념"
description: "Container의 데이터 영속성을 보장하기 위한 Docker Volume의 개념과 Named Volume, Anonymous Volume의 차이점을 알아봅니다."
date: "2025-06-16"
keywords: "Docker"
---

# Docker Volume 소개

Docker의 Container는 자체적인 파일 시스템을 갖고 있습니다. 그러나 이 파일 시스템은 Container가 삭제되면 함께 사라지게 됩니다. 이는 컨테이너의 독립성을 보장하는 장점이 있지만, 반대로 데이터의 영속성이 필요한 경우에는 단점이 됩니다.

이러한 문제를 해결하기 위해 Docker는 Volume이라는 기능을 제공합니다. Volume은 컨테이너 내부의 디렉토리를 호스트 OS의 디렉토리와 연결해주는 기능으로, 컨테이너가 삭제되어도 데이터가 유지됩니다.

예를 들어, PostgreSQL과 같은 데이터베이스도 Volume을 사용하면 안전하게 컨테이너화할 수 있습니다.

Docker에서 사용 가능한 Volume은 크게 두 가지입니다.

1. Named Volume
2. Anonymous Volume

# Named Volume

**Named Volume**은 가장 일반적이고 **Docker에서 권장하는 Volume 사용 방식**입니다. 이름을 명시하여 생성하고, 여러 컨테이너에서 재사용할 수 있다는 장점이 있습니다.


## Volume 생성

```bash
docker volume create test-volume
```

위 명령어는 `test-volume` 이라는 이름의 Volume 을 생성합니다. 생성된 Volume 은 일반적으로 `/var/lib/docker/volumes/` 디렉토리에 위치하게 됩니다.

해당 디렉토리는 Volume 이외에도 Docker 가 사용하는 다양한 데이터가 정장되는 위치이기도 합니다.

## Volume 정보 확인

이밖의 정보를 알고 싶다면 `inspect` 명령어를 사용하면 됩니다.

```bash
docker volume inspect test-volume
```

```json:OUTPUT
[
    {
        "CreatedAt": "2025-06-04T14:50:42Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/test-volume/_data",
        "Name": "test-volume",
        "Options": null,
        "Scope": "local"
    }
]
```

`Mountpoint` 가 volume 의 Host 상 위치 입니다.

> Windows나 macOS의 Docker Desktop에서는 이 디렉토리에 직접 접근할 수 없습니다. 대신 Docker Desktop의 Volumes 탭을 통해 생성된 Volume을 관리할 수 있습니다.

![test-volume](./img/test-volume.png)


## Volume 연결

Volume 을 컨테이너에 연결하려면 `-v` 옵션을 사용하면 됩니다.

```bash
-v [volume name]:[container path]
```

아래는 `Ubuntu 22.04` 이미지를 사용해 `test-volume` 을 `/volume-dir` 디렉토리에 연결하는 예시입니다.

```bash
docker container run -it -v test-volume:/volume-dir --name test-ubuntu ubuntu:22.04 /bin/bash
```

`test-ubuntu` 라는 이름의 컨테이너가 생성되고, 컨테이너에는 `/volume-dir` 디렉토리가 생성됩니다. 이 디렉토리는 `test-volume` Volume과 연결되어 있습니다.

## Volume에 파일 생성

이제 해당 Container에 접속해 `volume-dir` 디렉토리에 파일을 생성하면 해당 파일은 `test-volume` 에 저장됩니다.

```bash
cd /volume-dir
echo "Hello, World!" > test.txt
```

이제 Docker Desktop의 Volumes 탭을 확인하면 `test-volume` 내부에 `test.txt` 파일이 생성되어 있는 것을 볼 수 있습니다.

![테스트 파일 생성](./img/test-volume-file.png)

컨테이너를 삭제해도 `test-volume` 은 유지되며, 다른 컨테이너에서 동일한 Volume을 다시 사용할 수 있습니다.

***

# Anonymous Volume

**Anonymous Volume**은 이름 없이 **자동으로 생성되는 Volume**입니다. Docker 가 랜덤으로 이름을 생성하기에, 추후 추적이 어렵고, **Container 가 삭제되면 자동으로 삭제되는 특징**이 있습니다.

일반적으로 일회성 Container 에서 사용됩니다.

## Anonymous Volume 생성

Container 내의 디렉토리만 지정해주면 됩니다.

```bash
docker container run -it -v /volume-dir --name test-ubuntu-anonymous ubuntu:22.04 /bin/bash
```

이렇게 하면 `/volume-dir` 경로에 자동 생성된 Volume을 마운트합니다. Docker는 내부적으로 무작위 이름의 Volume을 생성하고 연결합니다.

Docker Desktop의 Volumes 탭에서 확인하면, 이름 없는 Volume이 생성된 것을 볼 수 있습니다.

![Anonymous Volume 확인](./img/anonymous-volume.png)

> 특별한 이유가 없다면 기본적으로 Named Volume 을 사용하고 보안적 이유나 임시 데이터를 저장할 때 Anonymous Volume을 사용하는 것이 좋습니다.

***

# Volume 청소

Volume 을 사용하다보면 Disk 공간이 부족해질 수 있습니다. 이때 사용하지 않는 Volume을 삭제하여 공간을 확보해야 합니다.

Volume 을 삭제하기 위해선 연결된 Container 가 없어야 한단 점만 주의하면 됩니다.

```bash:volume-확인
docker volume ls
```

```bash:특정-volume-삭제
docker volume rm test-volume
```

혹은 **사용하지 않는 Volume을 모두 삭제**하고 싶다면 다음 명령어를 사용할 수 있습니다.

```bash
docker volume prune
```

입력 시 다음과 같이 확인 메시지가 뜨며, `y`를 입력하면 삭제가 진행됩니다.

```pgsql
WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N]
```

***

# PostgreSQL

단순한 파일 생성으로 끝나면 아쉬우니, PostgreSQL을 예로 들어 Volume을 어떻게 활용할 수 있는지 알아보겠습니다.

## Volume 생성

먼저 PostgreSQL 데이터가 저장될 Volume을 생성합니다.

```bash
docker volume create pgdata
```

## PostgreSQL 컨테이너 실행

이제 PostgreSQL 컨테이너를 실행하면서 방금 생성한 `pgdata` Volume을 마운트합니다.

```bash
docker container run -d \
    --name my-postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -v pgdata:/var/lib/postgresql/data \
    -p 5432:5432 \
    postgres:latest
```

각 옵션의 의미는 다음과 같습니다.
* `--name postgres`: 컨테이너 이름을 postgres로 설정
* `-e POSTGRES_USER=postgres`: PostgreSQL 사용자 이름 지정
* `-e POSTGRES_PASSWORD=postgres`: 비밀번호 설정
* `-v pgdata:/var/lib/postgresql/data`: 데이터 디렉토리에 Volume 마운트
* `-p 5432:5432`: 호스트의 5432 포트를 컨테이너에 연결


> PostgreSQL 공식 이미지에 대한 더 자세한 정보는 Docker Hub에서 확인할 수 있습니다.
>
> [https://hub.docker.com/_/postgres](https://hub.docker.com/_/postgres)

## PostgreSQL 클라이언트 접속
이제 컨테이너 내부에 접속하여 PostgreSQL 클라이언트를 실행해보겠습니다.

```bash
docker container exec -it my-postgres psql -U postgres
```

이제 DB 를 하나 생성해 봅시다.

```sql
CREATE DATABASE testdb;
```

생성된 DB 는 아래 명령어로 확인할 수 있습니다.

```sql
SELECT datname FROM pg_database;
```

## Container 삭제

이제 Container 를 삭제한 후, 동일한 Volume을 사용하여 컨테이너를 다시 실행하면, 이전에 생성한 `testdb` 데이터베이스가 그대로 유지됩니다.