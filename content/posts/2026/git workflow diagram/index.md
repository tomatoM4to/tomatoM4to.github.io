---
title: "git workflow diagram"
description: "git 의 세가지 상태와 원격 저장소에 대한 개념을 설명하는 다이어그램"
date: "2026-04-03"
keywords: "git"
---

![git-workflow-diagram](https://i.redd.it/nm1w0gnf2zh11.png)

![image source](https://www.reddit.com/r/git/comments/99ul9f/git_workflow_diagram_showcasing_the_role_of/)

## git Three States
1. **Working Directory**: 현재 작업 중인 디렉토리로, 파일이 수정되거나 새로 생성된 상태
2. **Staging Area**: 커밋하기 전에 변경 사항을 임시로 저장하는 영역, `git add` 명령어로 파일을 Staging Area 에 올릴 수 있다
3. **Repository**: 커밋된 변경 사항이 저장되는 곳, `git commit` 명령어로 Staging Area 의 변경 사항을 Repository 에 저장할 수 있다

## Remote Repository
원격 저장소로, GitHub, GitLab, Bitbucket 같은 서비스에서 호스팅되는 저장소를 의미한다. `git push` 명령어로 로컬 Repository 의 변경 사항을 Remote Repository 에 업로드할 수 있고, `git pull` 명령어로 Remote Repository 의 변경 사항을 로컬로 가져올 수 있다.

1. **remote-tracking ref**: Remote Repository의 상태를 내 로컬에서 추적하기 위한 참조, `origin/main` 처럼 `origin/브랜치명` 형태로 나타난다
2. **Remote Repository**: 원격 저장소 자체, 보통 `origin` 이라는 이름으로 참조된다

> **remote-tracking ref** 같은 경우는 remote 가 붙어있지만, Local Repo 안에 저장되어 있는 데이터다, 정확히는 `.git/refs/remotes/origin/main` 같은 경로에 저장된다. `get fetch` 명령어를 통해 Update 된다.