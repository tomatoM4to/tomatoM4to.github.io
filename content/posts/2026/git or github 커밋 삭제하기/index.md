---
title: "git or github 커밋 삭제하기"
description: "실수로 커밋을 잘못하고 push 까지 해버렸을 때, git 과 github 에서 커밋을 삭제하는 방법에 대한 설명"
date: "2026-03-19"
keywords: "git"
---

## git reset
git 커밋을 취소하는 명령어를 알아보자

1. `--soft`: 커밋만 취소하고, 변경된 파일들은 Staged 상태로 유지 (바로 다시 커밋할 수 있음)
2. `--mixed`: 커밋을 취소하고, 변경된 파일들을 Unstaged 상태로 되돌림 (기본값, `add` 부터 다시 해야함)
3. `--hard`: 커밋 취소는 물론, 이후에 작업한 파일 변경사항까지 완전히 삭제
4. `HEAD~1`: 현재 커밋에서 한 단계 이전 커밋을 가리키는 참조, `HEAD~n` 으로 n 단계 이전 커밋을 가리킬 수 있음

```bash
git reset HEAD~1
git reset --soft HEAD~1
git reset --hard HEAD~1
```

하나가 아닌 여러개의 커밋을 취소하려면 `HEAD~1` 대신 `HEAD~n` 을 사용하면 된다.
```bash
git reset HEAD~3
```

이밖에 숫자가 아닌 커밋의 해시값을 이용해서도 커밋을 삭제할 수 있다.
```bash
git reset <commit-hash>
```

> hash 값은 `git log` 명령어로 확인할 수 있다, 아니면 IDE 의 내장 git 도구에서도 확인 가능

## github 에서 커밋 취소하기
github 에 실수로 push 한 커밋을 취소하려면 **내 로컬 저장소를 강제로 push** 해야한다. 만약 팀원이 있다면, 팀원들에게 커밋을 취소할거니 pull 하지 말라고 미리 알려주는 것이 좋다. (눈치..)

하지만 혼자서 작업하는 저장소라면 걱정없이 강제로 push 해도 별 문제는 없다.

```bash
git push --force origin <branch-name>
git push --force-with-lease origin <branch-name>
```
* `--force` 옵션은 강제로 push 하는 옵션, **혼자서 작업할때 사용**
* `--force-with-lease` 옵션은 다른 사람이 push 한 커밋이 있는 경우 push 를 거부하는 옵션, **협업할 때는 이 옵션을 사용**

> [https://docs.github.com/ko/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message](https://docs.github.com/ko/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message)
