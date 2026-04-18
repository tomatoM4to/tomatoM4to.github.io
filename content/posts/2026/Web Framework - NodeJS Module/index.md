---
title: "Web Framework - NodeJS Module"
description: "202601 웹프레임워크, Node.js Module 시스템에 대한 설명과 file system 관련 Node.js core module 소개"
date: "2026-04-13"
keywords: "Express, JavaScript, KNU"
---

## Node.js Module
> **Module:** 프로그램을 작은 기능 단위로 쪼개고 파일 형태로 저장해 놓은 것

Node.js 는 독특하게 Module system 이 두가지로 나뉜다. 두가지 방식을 혼용해서 사용하는건 권장하지 않는다.

* **CommonJS**: Node.js 의 초기 버전부터 사용되어 온 Node.js 표준 모듈 시스템
* **ES Module**: ES2015 에 도입된 JavaScript(ECMAScript) 의 표준 모듈 시스템으로, 브라우저와 Node.js 모두에서 사용할 수 있도록 설계

과거 Node.js 생태계가 CommonJS 중심으로 작성되어 있어, **아직 혼용**되고 있지만, JavaScript 생태계의 흐름은 **ESM 으로 완전히 넘어가고 있는 추세**다.

Express 는 오래된 프로젝트니 만큼 CJS 를 기본적으로 사용한다.

**Import Example**
```javascript
import express from "express"; // ES Module 방식
const express = require("express"); // CommonJS 방식
```

**Export Example**
```javascript
export default myFunction; // ES Module 방식
module.exports = myFunction; // CommonJS 방식
```

## CommonJS
> 같은 디렉토리에 `user.js`, `greeting.js` 파일이 있다고 가정

```javascript
// user.js
const user = {
  name: "Alice",
  age: 30,
};

module.exports = user;
```

```javascript
// greeting.js
const user = require("./user");

function sayHello() {
  console.log(`Hello, ${user.name}!`);
}
```

**여러개의 함수나 변수** 를 export 하고 싶다면, 객체 형태로 export 하면 된다.

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
// greeting.js
const { user, greet, URL } = require("./user");
greet(); // Hello, Alice!
console.log(URL); // https://example.com
console.log(user.name); // Alice

// 또는 객체 형태로 불러올 수도 있음
const all = require("./user");
console.log(all.URL); // https://example.com
```

> `require()` 는 어느 위치에서든 사용할 수 있다.

## Node.js Core Modules
> Node.js 가 기본적으로 제공하는 모듈, 별도의 설치 없이 `require()` 함수를 사용하여 불러올 수 있다.

| 기능 | 모듈 명 | 설명 |
| --- | --- | --- |
| 파일 시스템 | `fs` | 파일 읽기/쓰기/삭제/이동/이름 변경, 디렉토리 관리 등 |
| HTTP 서버 | `http` | HTTP 서버 생성 및 요청/응답 처리 |
| 경로 관리 | `path` | 파일 경로 조작 및 관리 |
| 스트림 | `stream` | 데이터 스트림 처리 |
| 암호화 | `crypto` | 암호화, 복호화 및 해싱 기능 제공 |
| 운영체제 | `os` | 운영체제 정보 및 시스템 관련 기능 제공 |
| 유틸리티 | `util` | 다양한 유틸리티 함수 제공, 객체 상속, 비동기 작업을 프로미스로 변환하는 등 |
| 이벤트 | `events` | 이벤트 기반 프로그래밍을 위한 이벤트 생성/등록/처리 등을 할 수 있다 |

```javascript
const fs = require("fs");
const fs = require("node:fs"); // Node.js 18 이상에서는 이렇게도 불러올 수 있음
```

> core module 을 불러올 때는 `node:` prefix 를 붙이는 것을 권장, **명시적으로 core module 임을** 나타내고, 향후 Node.js 버전에서 동일한 이름의 패키지가 등장하더라도 충돌을 방지할 수 있기 때문

## Global Object
**Global Object** 는 Node.js 가 실행되며 **자동적으로 생성**되는 전역 객체, **모든 모듈(파일) 에서 사용할 수 있다.** 브라우저 환경에선 `window` 라고 부름

전역 변수나 함수를 정의할 때 **Global Object** 에 추가하면 다른 모듈에서도 사용할 수 있지만, **전역 네임스페이스 오염을 방지하기 위해 권장되지 않음**

> 교재에선 Global Module 라 소개하는데, Global Object 가 더 정확한 표현

```javascript
global.myGlobalVar = "Hello, World!";
global.console.log(global.myGlobalVar); // Hello, World!
```

> `global.console.log()` 등과 같이 명시적으로 `global` 객체를 통해 접근할 수도 있지만, 생략하는게 일반적, `setTimeout()`, `setInterval()`, `clearTimeout()`, `clearInterval()` 등과 같은 타이머 함수도 Global Object 의 일부

## Module Wrapper Function
> [Source](https://medium.com/@finnkumar6/what-is-the-module-wrapper-in-node-js-37b26eb6d20e), 해당 부분은 따로 추가로 정리한 내용임

Node.js 는 각 Module 을 독립된 Execution Context 에서 실행하기 위해, **Module Wrapper Function** 이라는 내부 함수를 사용하여 Module 코드를 감싸서 실행한다.

```javascript
// Node.js가 내부적으로 코드를 감싸는 형태
(function(exports, require, module, __filename, __dirname) {
  // 작성한 코드는 이 안에 들어간다.
  console.log(__dirname); 
  const fs = require('fs');
  // ...
});
```
* `exports`: Module 이 외부로 노출하는 객체, `module.exports` 와 동일한 객체를 참조
* `require`: 다른 Module 을 불러오는 함수
* `module`: 현재 Module 에 대한 정보와 상태를 담고 있는 객체, `exports` 객체를 포함
* `__dirname`: 현재 **Module 이 위치한 디렉토리의 절대 경로**를 포함하는 문자열
* `__filename`: `__dirname/module-file-name.js`

> 덕분에 Node.js 는 각 Module 을 독립된 스코프에서 실행할 수 있고, `exports` 객체를 통해 필요한 부분만 외부로 노출할 수 있다.

> ESM 방식에선 `__dirname`, `__filename` 이 제공되지 않지만, `import.meta.url` 을 사용하여 현재 Module 의 URL 정보를 얻을 수 있다.

## require("node:path")
* Window 는 `\` 를 경로 구분자로 사용하지만, Unix 계열 시스템은 `/` 를 사용하기 때문에, Node.js 는 `path` 모듈을 통해 **플랫폼에 독립적인 경로 처리**를 지원한다.
* Path 정보를 활용하여, Directory 이름이나 File 이름을 지정해 새로운 Path 정보를 만들어 낼 수 있다.
* 가져온 Path 정보에서 특정 부분을 추출할 수도 있다. 예를 들어, 파일의 확장자만 추출하거나, 디렉토리 이름만 추출하는 식으로 활용

>  **Absolute vs Relative Path**
> * Absolute Path: 파일 시스템의 루트부터 시작하는 전체 경로, 예를 들어 `/home/user/project/file.js` (Unix) 또는 `C:\Users\user\project\file.js` (Windows)
> * Relative Path: 현재 작업 디렉토리를 기준으로 하는 경로, 예를 들어 `./file.js` (현재 디렉토리), `../file.js` (상위 디렉토리)

```javascript
const path = require("node:path");

// 경로 연결하기
const fullPath = path.join("some", "work", "ex.txt");
console.log(fullPath); // some/work/ex.txt

// 절대 경로
console.log(`file path: ${__filename}`);

// 경로 추출하기, file name 제거
const dir = path.dirname(__filename);
console.log(dir);

// 파일 이름 추출
const fn = path.basename(__filename);
const fn2 = path.basename(__filename, ".js"); // 확장자 제거
console.log(fn);  // index.js
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
* File 을 `Read/Write` 하는 등 File 을 관리할 때 사용
* `fs` 모듈은 **동기식과 비동기식 API 를 모두 제공**
  * Synchronous API: `fs.readFileSync()`, `fs.writeFileSync()` 등, 호출이 완료될 때까지 다음 코드가 실행되지 않음
  * Asynchronous API: `fs.readFile()`, `fs.writeFile()` 등, **콜백 함수를 사용**하여 비동기적으로 작업을 처리

`fs` 는 **Callback 패턴을 사용**하는 비동기 API 를 제공하지만, Node.js 10 이상에서는 `fs.promises` API 도 제공하여, **프로미스 기반으로 비동기 작업을 처리할 수 있다.**

### readdir & readdirSync
> 디렉토리 내의 파일과 서브디렉토리 목록을 읽어오는 함수

```javascript
const fs = require("node:fs");

// Async 방식
fs.readdir("./", (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }
  console.log("readdir:", files);
});

// Sync 방식
const files = fs.readdirSync("./");
console.log("readdirSync:", files);
```

> event loop 의 특성상, `readdirSync()` 의 결과가 먼저 출력된다.

### readFile & readFileSync
> 파일의 내용을 읽어오는 함수, `utf-8` 인코딩을 지정하여 문자열로 읽어올 수 있다. 인코딩을 생략하면 Buffer 객체로 byte 단위로 읽어온다.

```javascript
const fs = require("node:fs");

fs.readFile("example.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("File content:", data);
});

const files = fs.readFileSync("example.txt", "utf-8");
console.log("readFileSync: File content:", files);
```

### existsSync & access
> * `existsSync()` 함수는 파일이나 디렉토리가 존재하는지 여부를 **동기적으로 확인**하는 함수, 존재하면 `true`, 존재하지 않으면 `false` 반환
> * `access()` 함수는 파일이나 디렉토리에 대한 **접근 권한을 확인**하는 함수, 존재 여부도 검사 가능
> * `fs.exists()` 함수는 **Node.js 10 이상에서 deprecated** 되었다.

```javascript
const fs = require("node:fs");

fs.access("example.txt", fs.constants.F_OK, (err) => {
  if (err) {
    console.log("example.txt does not exist");
  }
  else {
    console.log("example.txt exists");
  }
});

const exists = fs.existsSync("example.txt");
if (exists) {
  console.log("example.txt exists");
}
else {
  console.log("example.txt does not exist");
}
```

> `File 존재 여부 확인 -> Read/Write` 패턴은 Node.js 에선 **안티패턴**으로 간주한다. 존재여부 확인과 Read/Write 간의 짧은 시간에 **Race Condition 취약점**이 존재하기 때문

> Node.js 는 File 의 존재 여부를 확인하는게 아닌 `try/catch` 문을 사용하여, 파일이 존재하지 않을 때 발생하는 **에러를 처리하는 방식을 권장**한다.

> 따로 추가한 정리로, 해당 교재나 강의에선 편의성을 위해 `fs.existsSync()` 함수를 사용

### writeFile & writeFileSync
> 파일에 데이터를 쓰는 함수, 파일이 **존재하지 않으면 새로 생성**, **존재하면 덮어쓰기**

```javascript
const fs = require("node:fs");

const data = `
This is some sample content.
`;

fs.writeFile("output1.txt", data, "utf-8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
  console.log("File written successfully (async)");
});

fs.writeFileSync("output2.txt", data, "utf-8");
```

File 의 기존 내용을 그대로 유지하면서 새로운 내용을 추가할 경우 flag 옵션을 사용해야 한다, 여러 옵션들이 있으니 그냥 한번 읽어 보자

|flag|설명|
|---|---|
|`a`|파일이 없으면 새로 생성, 있으면 기존 내용 뒤에 추가 (쓰기)|
|`ax`|`a` 모드와 동일하지만, 파일이 이미 존재하면 에러 발생|
|`a+`|파일이 없으면 새로 생성, 있으면 기존 내용 뒤에 추가 (읽기/쓰기)|
|`ax+`|`a+` 모드와 동일하지만, 파일이 이미 존재하면 에러 발생|
|`as`|동기 처리로 내용을 추가하기 위해 파일을 연다. 파일이 없으면 만든다|
|`w`|파일이 존재하면 기존 내용을 덮어쓰고, 존재하지 않으면 새로 생성 (쓰기)|
|`wx`|`w` 모드와 동일하지만, 파일이 이미 존재하면 에러 발생|
|`w+`|파일이 존재하면 기존 내용을 덮어쓰고, 존재하지 않으면 새로 생성 (읽기/쓰기)|
|`wx+`|`wx`와 같지만 파일이 있을 경우 실패|

```javascript
const fs = require("node:fs");

const data = `
This is additional content.
`;

fs.writeFileSync("output1.txt", data, { flag: "a" });
fs.writeFile("output2.txt", data, { flag: "a" }, (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
  console.log("File written successfully with append flag (async)");
});
```

### appendFile & appendFileSync
> 파일에 데이터를 추가하는 함수, 파일이 존재하지 않으면 새로 생성, 존재하면 기존 내용 뒤에 추가, `writeFile` 함수의 `flag: "a"` 옵션을 사용하는 것과 동일한 효과를 낸다.

```javascript
const fs = require("node:fs");

const data = `This is some additional content.`;

fs.appendFileSync("output3.txt", data, "utf-8");
fs.appendFile("output3.txt", data, "utf-8", (err) => {
  if (err) {
    console.error("Error appending file:", err);
    return;
  }
  console.log("File appended successfully (async)");
});
```

### unlink
> 파일을 삭제하는 함수

```javascript
const fs = require("node:fs");

if (!fs.existsSync("output.txt")) {
  console.log("output.txt does not exist, skipping delete");
}
else {
  fs.unlinkSync("output.txt");
  console.log("File deleted successfully");
}

if (!fs.existsSync("output.txt")) {
  console.log("output.txt does not exist, skipping delete");
}
else {
  fs.unlink("output.txt", (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    console.log("File deleted successfully (async)");
  });
}
```

### mkdirSync & mkdir
> 디렉토리를 생성하는 함수, 디렉토리가 **이미 존재하면 에러가 발생**
```javascript
const fs = require("node:fs");

if (fs.existsSync("newDir")) {
  console.log("newDir already exists, skipping create");
}
else {
  fs.mkdirSync("newDir");
  console.log("Directory created successfully");
}

if (fs.existsSync("newDirAsync")) {
  console.log("newDirAsync already exists, skipping create");
}
else {
  fs.mkdir("newDirAsync", (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return;
    }
    console.log("Directory created successfully (async)");
  });
}
```

여러 계층의 디렉토리를 한 번에 생성할 때는 `recursive` 옵션을 사용하여, 상위 디렉토리가 존재하지 않아도 하위 디렉토리를 생성할 수 있다.
```javascript
const fs = require("node:fs");

const path = "parentDir/childDir";
fs.mkdirSync(path, { recursive: true });
console.log(`Directory ${path} created successfully`);

fs.mkdir("parentDir/childDirAsync", { recursive: true }, (err) => {
  if (err) {
    console.error("Error creating directory:", err);
    return;
  }
  console.log("Directory parentDir/childDirAsync created successfully (async)");
});
```

> `{ recursive: true }` 옵션을 사용하면 디렉토리가 이미 존재해도 에러가 발생하지 않는다

> 교재는 `existsSync()` 함수를 사용하여 디렉토리 존재 여부를 확인하지만 여기선 코드 생략

### rmdirSync & rmdir
> 디렉토리를 삭제하는 함수, **디렉토리가 비어 있어야** 삭제 가능

```javascript
const fs = require("node:fs");

if (!fs.existsSync("newDir")) {
  console.log("newDir does not exist, skipping delete");
}
else {
  fs.rmdirSync("newDir");
  console.log("Directory deleted successfully");
}

if (!fs.existsSync("newDirAsync")) {
  console.log("newDirAsync does not exist, skipping delete");
}
else {
  fs.rmdir("newDirAsync", (err) => {
    if (err) {
      console.error("Error deleting directory:", err);
      return;
    }
    console.log("Directory deleted successfully (async)");
  });
}
```

### rm & rmSync
> 파일이나 디렉토리를 삭제할 수 있는 함수, `recursive` 옵션을 사용하여 **디렉토리가 비어있지 않아도** 삭제 가능

```javascript
const fs = require("node:fs");

if (!fs.existsSync("parentDir")) {
  console.log("parentDir does not exist, skipping delete");
}
else {
  fs.rmSync("parentDir", { recursive: true });
  console.log("Directory deleted successfully");
}

if (!fs.existsSync("parentDirAsync")) {
  console.log("parentDirAsync does not exist, skipping delete");
}
else {
  fs.rm("parentDirAsync", { recursive: true }, (err) => {
    if (err) {
      console.error("Error deleting directory:", err);
      return;
    }
    console.log("Directory deleted successfully (async)");
  });
}
```
> 강의에서 다루지는 않았지만 `force: true` 옵션을 사용하여, 파일이 존재하지 않아도 에러가 발생하지 않도록 할 수 있다. `recursive: true` 옵션과 함께 사용하면, 디렉토리가 존재하지 않아도 에러 없이 삭제 시도 가능
