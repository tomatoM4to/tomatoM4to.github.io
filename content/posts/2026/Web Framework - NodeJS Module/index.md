---
title: "Web Framework - NodeJS Module"
description: "202601 웹프레임워크, Core modules in NodeJS"
date: "2026-04-13"
keywords: "Express, JavaScript, KNU"
---

## Node.js Module
> 프로그램을 작은 기능 단위로 쪼개고 파일 형태로 저장해 놓은 것

Node.js는 크게 CommonJS Module 과 ES Module로 나뉜다. 두가지 방식을 혼용하는건 권장되지 않는다.

* CommonJS Module: `require()` 함수를 사용하여 모듈을 불러오고, `module.exports` 객체를 사용하여 모듈을 내보낸다.
* ES Module: ECMAScript 의 표준 모듈 시스템으로, `import` 문을 사용하여 모듈을 불러오고, `export` 문을 사용하여 모듈을 내보낸다.

아직까진 레거시를 지원하기 위해 CommonJS Module이 더 널리 사용되고 있지만, 최근 시작된 현대적인 프로젝트들은 거진 ES Module 방식을 사용한다.

Express 는 오래된 프로젝트니 만큼 CJS 를 기본적으로 사용한다.

```javascript
import express from "express"; // ES Module 방식
const express = require("express"); // CommonJS Module 방식
```
## CJS Example
같은 디렉토리에 `user.js`, `hello.js` 파일이 있다고 가정

```javascript
// user.js
const user = {
  name: "Alice",
  age: 30,
};

module.exports = user;
```

```javascript
// hello.js
const user = require("./user");

function sayHello() {
  console.log(`Hello, ${user.name}!`);
}
sayHello();
```

**여러개의 module**을 내보내고 싶다면, 객체 형태로 내보낼 수 있다.

```javascript
// user.js
const user = {
  name: "Alice",
  age: 30,
};
const greet = () => {
  console.log(`Hello, ${user.name}!`);
};
const URL = "https://example.com";

module.exports = { user, greet, URL };
```

```javascript
// hello.js
const { user, greet, URL } = require("./user");
greet(); // Hello, Alice!
console.log(URL); // https://example.com
console.log(user.name); // Alice

// 또는 객체 형태로 불러올 수도 있음
const all = require("./user");
console.log(all.URL); // https://example.com
```

> `require()` 어느 위치에서든 사용할 수 있다.

## Node.js Core Modules
> Node.js 가 기본적으로 제공하는 모듈, 별도의 설치 없이 `require()` 함수를 사용하여 불러올 수 있다.

| 기능 | 모듈 명 | 설명 |
| --- | --- | --- |
| 파일 시스템 | `fs` | 파일 읽기/쓰기, 디렉토리 관리 등 |
| HTTP 서버 | `http` | HTTP 서버 생성 및 요청/응답 처리 |
| 경로 관리 | `path` | 파일 경로 조작 및 관리 |
| 스트림 | `stream` | 데이터 스트림 처리 |
| 암호화 | `crypto` | 암호화, 복호화 및 해싱 기능 제공 |
| 운영체제 | `os` | 운영체제 정보 및 시스템 관련 기능 제공 |
| 유틸리티 | `util` | 다양한 유틸리티 함수 제공, 객체 상속, 비동기 작업을 프로미스로 변환하는 등 |
| 이벤트 | `events` | 이벤트 기반 프로그래밍을 위한 이벤트 발행/구독 기능 제공 |

```javascript
const fs = require("fs");
const fs = require("node:fs"); // Node.js 18 이상에서는 이렇게도 불러올 수 있음
```

> core module 을 불러올 때는 `node:` prefix 를 붙이는 것을 권장, **명시적으로 core module 임을** 나타내고, 향후 Node.js 버전에서 동일한 이름의 패키지가 등장하더라도 충돌을 방지할 수 있기 때문

## Global Object
> `global` 객체는 Node.js 가 실행되며 자동적으로 생성되는 전역 객체, 모든 모듈(파일) 에서 사용할 수 있다. 브라우저 환경에선 `window` 라고 부름

> 교재에선 Global Object, Global Module 혼용해서 설명하는데, Global Object 가 더 정확한 표현

* `__dirname`: 현재 모듈이 있는 디렉토리 경로를 가져 옴
* `__filename`: 현재 모듈 파일의 전체 경로를 가져 옴
* `global`: 전역 객체, 모든 모듈에서 접근 가능, 전역 변수나 함수를 정의할 때 `global` 객체에 추가하면 다른 모듈에서도 사용할 수 있지만, **전역 네임스페이스 오염을 방지하기 위해 권장되지 않음**

```javascript
console.log(__dirname); // 현재 디렉토리 절대 경로
console.log(__filename); // 현재 파일의 절대 경로
global.myGlobalVar = "Hello, World!";
```

## require("node:path")
* Window 는 `\` 를 경로 구분자로 사용하지만, Unix 계열 시스템은 `/` 를 사용하기 때문에, Node.js 는 `path` 모듈을 통해 **플랫폼에 독립적인 경로 처리**를 지원한다.
* Path 정보를 활용하여, Directory 이름이나 File 이름을 지정해 새로운 Path 정보를 만들어 낼 수 있다.
* 가져온 Path 정보에서 특정 부분을 추출할 수도 있다. 예를 들어, 파일의 확장자만 추출하거나, 디렉토리 이름만 추출하는 식으로 활용

>  **Absolute vs Relative Path**
> * Absolute Path: 파일 시스템의 루트부터 시작하는 전체 경로, 예를 들어 `/home/user/project/file.js` (Unix) 또는 `C:\Users\user\project\file.js` (Windows)
> * Relative Path: 현재 작업 디렉토리를 기준으로 하는 경로, 예를 들어 `./file.js` (현재 디렉토리), `../file.js` (상위 디렉토리)

```javascript
const path = require("node:path");

// 경로 조합
const fullPath = path.join("some", "work", "ex.txt");
console.log(fullPath); // some/work/ex.txt

// 절대 경로
console.log(`file path: ${__filename}`);

// 경로 추출하기, file name 제거
const dir = path.dirname(__filename);

// 파일 이름 추출
const fn = path.basename(__filename);
console.log(fn); // index.js
const fn2 = path.basename(__filename, ".js"); // 확장자 제거
console.log(fn2); // index

// 파일 확장자 추출
const ext = path.extname(__filename);
console.log(ext); // .js
console.log(path.basename(__filename, ext)); // 확장자 제거한 파일 이름

// 경로 분해
const parsed = path.parse(__filename);
console.log(parsed);
```

## require("node:fs")
* 어쩌면 프로그래밍에서 가장 많이 하는 작업
* File 을 Read/Write 하는 등 File 을 관리할 때 사용
* `fs` 모듈은 동기식과 비동기식 API 를 모두 제공
  * Synchronous API: `fs.readFileSync()`, `fs.writeFileSync()` 등, 호출이 완료될 때까지 다음 코드가 실행되지 않음
  * Asynchronous API: `fs.readFile()`, `fs.writeFile()` 등, **콜백 함수나 프로미스를 사용**하여 비동기적으로 작업을 처리

지금은 잘 사용 안하지만 여기선 `callback` 방식과 `Sync` 방식을 소개, 나중에 `Promise`, `async/await` 방식도 소개할 예정

### readdir
> 디렉토리 내의 파일과 서브디렉토리 목록을 읽어오는 함수
```javascript
const fs = require("node:fs");

fs.readdir("./", (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }
  console.log("Files in directory:", files);
});

const files = fs.readdirSync("./");
console.log("readdirSync: Files in directory:", files);
console.log("finish");
```

### readFile
> 파일의 내용을 읽어오는 함수, `utf-8` 인코딩을 지정하여 문자열로 읽어올 수 있다. 인코딩을 생략하면 Buffer 객체로 byte 단위로 읽어온다.
```javascript
const fs = require("node:fs");

fs.readFile("input.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("File content:", data);
});

try {
  const data = fs.readFileSync("input.txt", "utf-8");
  console.log("readFileSync: File content:", data);
}
catch (err) {
  console.error("Error reading file:", err);
}
```

### writeFile
> 파일에 데이터를 쓰는 함수, 파일이 존재하지 않으면 새로 생성, 존재하면 덮어쓰기

덮어쓰기 방지를 위해, `fs.existsSync()` 함수를 사용하여 파일이 이미 존재하는지 확인한 후에 쓰기 작업을 수행
```javascript
const fs = require("node:fs");

const data = fs.readFileSync("input.txt", "utf-8");
if (fs.existsSync("output.txt")) {
  console.log("output.txt already exists, skipping write");
}
else {
  fs.writeFileSync("output.txt", data);
  console.log("File written successfully");
}

fs.writeFile("output_async.txt", data, (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
  console.log("File written successfully (async)");
});
```

File 의 기존 내용을 그대로 유지하면서 새로운 내용을 추가할 경우 flag 옵션을 사용해야 한다, 그냥 한번 읽어 보자.

|flag|설명|
|---|---|
|`a`|append 모드, 기존 파일이 존재하면 새로운 내용을 기존 내용 뒤에 추가|
|`ax`|`a` 모드와 동일하지만, 파일이 이미 존재하면 에러 발생|
|`a+`|append 모드, 파일이 존재하지 않으면 새로 생성, 존재하면 기존 내용 뒤에 추가|
|`ax+`|`a+` 모드와 동일하지만, 파일이 이미 존재하면 에러 발생|
|`as`|동기 처리로 내용을 추가하기 위해 파일을 연다. 파일이 없으면 만든다|
|`w`|write 모드, 파일이 존재하면 기존 내용을 덮어쓰고, 존재하지 않으면 새로 생성|
|`wx`|`w` 모드와 동일하지만, 파일이 이미 존재하면 에러 발생|
|`w+`|내용을 읽고 쓰기 위해 파일을 연다. 파일이 없으면 만든다|
|`wx+`|`wx`와 같지만 파일이 있을 경우 실패|