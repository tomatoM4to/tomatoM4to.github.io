---
title: "uv Quick guide"
description: "자주 사용되는 uv 명령어들을 간단히 설명한 글"
date: "2026-02-22"
keywords: "Python"
---

## python
Python 버전을 관리하는 명령어 그룹

```bash
# 사용 가능한 Python 버전 목록 확인
uv python list

# 특정 Python 버전 설치
uv python install 3.12

# 현재 프로젝트의 Python 버전 고정 (.python-version 파일 생성)
uv python pin 3.12
```

## init
uv 프로젝트를 초기화하고 `pyproject.toml` 파일을 생성

* `--app`: 애플리케이션 형태로 초기화 (기본값)
* `--lib`: 라이브러리(패키지) 형태로 초기화 (src 레이아웃 생성)
* `--python "x.xx"`: 특정 Python 버전으로 초기화

```bash
uv init
uv init --python "3.12"
uv init --lib
```

## venv
가상환경을 생성, `uv init` 없이 독립적으로 가상환경만 만들 때 사용

> `uv run`이나 `uv sync`를 사용하면 가상환경이 없어도 자동으로 생성됩니다

```bash
# .venv 디렉토리에 가상환경 생성
uv venv

# 특정 Python 버전 지정 생성
uv venv --python "3.12"
```

## sync
`pyproject.toml`과 `uv.lock`에 명시된 의존성 패키지들을 설치.

`--no-dev`: 개발 의존성(dev-dependencies) 제외하고 설치

```bash
uv sync
uv sync --no-dev
```

## add / install
패키지 설치 및 의존성 추가

> `uv add`는 프로젝트 관리용(`pyproject.toml` 업데이트), `uv pip install`은 단순 가상환경 패키지 설치용입니다

```bash
# pyproject.toml에 추가하고 설치 (권장)
uv add requests
uv add --dev pytest   # 개발용 의존성으로 추가

# pyproject.toml 변경 없이 현재 환경에만 설치
uv pip install requests
```

## remove / uninstall
패키지 제거 및 의존성 삭제

```bash
# pyproject.toml에서 제거하고 언인스톨
uv remove requests

# 현재 환경에서만 언인스톨
uv pip uninstall requests
```

## lock & tree
의존성 잠금 및 트리 구조 확인

```bash
# uv.lock 파일 생성 및 업데이트
uv lock

# 설치된 의존성 패키지들을 트리 형태로 깔끔하게 확인
uv tree
```

> `uv lock`은 패키지 추가 시 자동으로 실행되므로 수동으로 쓸 일은 적음

## export / pip list
의존성 목록 출력 및 파일 저장

> uv 를 사용하지 않은 사람들을 위해 `requirements.txt` 형식으로 저장할 때 사용

```bash
# lock 파일을 기반으로 requirements.txt 추출 (안전하고 권장되는 방식)
uv export --format requirements-txt > requirements.txt

# 단순 설치된 패키지 목록 출력
uv pip list
uv pip freeze > requirements.txt
```

## run
**가상환경을 직접 activate 하지 않아도** 프로그램이나 스크립트를 가상환경 내에서 격리하여 실행

```bash
# Python 스크립트 실행
uv run python main.py

# 설치된 CLI 툴 실행
uv run pytest
uv run ruff check .

# [단일 파일 스크립트 패턴] 패키지 임시 설치 후 스크립트 실행 (PEP 723)
# requests가 설치되지 않은 상태여도 알아서 임시 환경 구축 후 실행됨
uv run --with requests script.py
```

## uvx (tool run)
패키지를 설치하지 않고 일회성으로 CLI 툴을 실행 (npx와 유사)

```bash
# 설치 없이 임시 환경에서 바로 실행
uvx ruff check .
uvx black .

# 특정 버전 지정 실행
uvx ruff@0.9.0 check .
```

## tool install
CLI 툴을 전역(global)으로 설치해 어디서든 터미널 명령어로 사용할 수 있게 함

프로젝트 의존성이 아닌, **내 PC의 개발 도구용**으로 적합

```bash
uv tool install ruff
uv tool install black

# 설치된 툴 목록 확인
uv tool list
```

## Python 버전 변경
이미 진행 중인 프로젝트의 Python 버전을 올리거나 내리고 싶을 때 아래 명령어를 사용, uv 가 알아서 변경된 버전에 맞춰 가상환경 및 의존성 다시 동기화 함

```bash
# (.python-version 파일이 변경됨)
uv python pin 3.11
uv sync
```

> `pyproject.toml`에 명시된 `requires-python` (최소 지원 버전) 값은 자동으로 바뀌지 않기 때문에, 이 부분만 수동으로 맞춰주고 uv sync를 돌려주는 것이 가장 확실하고 안전한 방법

## CLI 엔트리 포인트
터미널에서 바로 호출할 수 있는 **실행 파일(CLI 명령어)의 진입점(함수)**을 등록하는 기능

`pyproject.toml`의 `[project.scripts]` 섹션에 명령어 이름과 해당 함수 경로를 매핑하여 설정

```toml
# pyproject.toml 작성 예시
[project.scripts]
my-cli = "my_project.main:run_app"
```

```bash
# pyproject.toml에 등록된 CLI 명령어를 사용하기 전에 uv가 해당 명령어를 인식할 수 있도록 동기화
uv sync

# 등록한 이름을 CLI 명령어처럼 사용
uv run my-cli
```

> `npm run dev`나 `yarn start` 처럼 긴 쉘 명령어를 짧게 등록해두고 쓰는 기능(Task Runner)은 현재 uv에서 네이티브로 지원하지 않음