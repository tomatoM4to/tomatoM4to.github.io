---
title: "uv Quick guide"
description: "자주 사용되는 uv 명령어들을 간단히 설명한 글"
date: "2026-02-22"
keywords: "Python"
---

## python
Python 버전을 관리하는 명령어 그룹.

```bash
# 사용 가능한 Python 버전 목록 확인
uv python list

# 특정 Python 버전 설치
uv python install 3.12

# 현재 프로젝트의 Python 버전 고정 (.python-version 파일 생성)
uv python pin 3.12
```

## init
uv 프로젝트를 초기화, `pyproject.toml` 파일을 생성.

* `--python "3.12"`: Python 버전 지정
* `--package`: 패키지 형태로 초기화 (src 레이아웃 생성)
* `--no-package`: 스크립트/앱 형태로 초기화 (기본값)

```bash
uv init
uv init --python "3.12"
```

## venv
가상환경을 생성. `uv init` 없이 독립적으로 가상환경만 만들 때 사용.

* `--python "3.12"`: 특정 Python 버전으로 생성

```bash
# .venv 디렉토리에 가상환경 생성
uv venv

# 버전 지정
uv venv --python "3.12"
```

## sync
`pyproject.toml`과 `uv.lock`에 명시된 의존성 패키지들을 설치.
가상환경이 없으면 자동으로 생성.

* `--no-dev`: 개발 의존성 제외하고 설치

```bash
uv sync
```

## add or install
패키지 설치, `pyproject.toml` 파일에 의존성 추가.

* `--dev`: 개발 의존성 패키지로 설치
* `-e .`: 현재 프로젝트를 editable 모드로 설치

`uv add`는 `pyproject.toml`에 의존성을 추가하고, `uv pip install`은 추가하지 않습니다.

```bash
uv add <package-name>
uv add --dev <package-name>
```
```bash
uv pip install <package-name>
```

## remove or uninstall
패키지 제거, `pyproject.toml` 파일에서 의존성 제거.

```bash
uv remove <package-name>
```
```bash
uv pip uninstall <package-name>
```

## lock
`pyproject.toml`을 기반으로 `uv.lock` 잠금 파일을 생성 또는 업데이트.
`uv add`, `uv sync` 실행 시 자동으로 호출되므로 보통 직접 사용할 일은 적음.

* `--upgrade`: 모든 패키지를 최신 버전으로 업데이트
* `--upgrade-package <name>`: 특정 패키지만 업데이트

```bash
uv lock
uv lock --upgrade
```

## pip list / freeze
설치된 패키지 목록 출력.

```bash
# 설치된 패키지 목록
uv pip list

# requirements.txt 형식으로 출력
uv pip freeze

# requirements.txt 파일로 저장
uv pip freeze > requirements.txt
```

## run
프로그램이나 스크립트를 가상환경 내에서 실행.
가상환경을 activate 하지 않아도 바로 실행 가능.

```bash
# Python 스크립트 실행
uv run python main.py

# 설치된 CLI 툴 실행
uv run pytest
uv run ruff check .

# pyproject.toml의 [tool.uv.scripts]에 정의된 스크립트 실행
uv run <script-name>
```

## uvx (tool run)
패키지를 설치하지 않고 일회성으로 CLI 툴을 실행.
`npx`와 유사한 개념.

```bash
# 설치 없이 바로 실행
uvx ruff check .
uvx black .

# 버전 지정
uvx ruff@0.9.0 check .

# uv tool run 과 동일
uv tool run ruff check .
```

## tool install
CLI 툴을 전역(global)으로 설치해 어디서든 사용할 수 있게 함.
프로젝트 의존성이 아닌 개발 도구용.

```bash
uv tool install ruff
uv tool install black

# 설치된 툴 목록 확인
uv tool list
```