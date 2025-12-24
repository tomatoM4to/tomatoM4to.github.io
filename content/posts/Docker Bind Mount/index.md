---
title: "Docker Bind Mount"
description: "Host OS의 디렉토리를 Container와 직접 연결하는 Bind Mount의 개념과 특징, 그리고 개발 환경에서의 활용법을 알아봅니다."
date: "2025-06-16"
keywords: "Docker"
---

# Bind Mount
Bind Mount 는 Host OS 의 디렉토리를 Container 내부의 디렉토리와 연결하는 방법입니다.

Volume 과는 다르게 **Docker 가 관리하는 영역이 아닌 Host OS 의 디렉토리를 직접 연결**합니다.

이 방법은 Host OS 의 파일을 Container 내부에서 직접 수정할 수 있기 때문에, 개발 환경에서 많이 사용됩니다.
