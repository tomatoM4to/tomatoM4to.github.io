---
title: "Web Framework - Stream"
description: "202601 웹프레임워크, Node.js 의 buffer와 stream에 대한 설명과 예제 코드"
date: "2026-04-14"
keywords: "Express, JavaScript, KNU"
---

## Buffer
> 임시 데이터를 저장하기 위한 물리적인 메모리 공간, Node.js 뿐만 아니라 CS 전반적으로 사용되는 개념

file 을 read 할때, 전체 내용을 한번에 읽어서 메모리에 저장하는 것이 아니라, 일정한 크기로 나누어서 읽는 방식이 있다. 이 때, 나누어서 읽은 데이터를 저장하는 공간이 buffer 이다.

한번에 buffer 하나 크기 만큼만 가져오고, buffer 가 가득 차면 그 내용을 전달해 주는 방식으로 동작한다.

Node.js 의 buffer 는 처음부터 크기가 고정되어 있고, 내용이 이진수로 저장된다.

buffer 를 눈으로 직접 확인할 수 있다.

```javascript
const fs = require('fs');
fs.readFile('example.txt', (err, data) => {
  if (err) throw err;
  console.log(data); // <Buffer 48 65 6c 6c 6f>
  console.log(data.toString()); // Hello
});
```
Node.js 내부적이로 buffer 에 데이터를 채우고, 다 채워지면 data 에 전달해준다. 완료된 data 를 출력해보면 buffer 형태로 출력되고, toString() 메서드를 사용해서 문자열로 변환할 수 있다.

> `readFile()` 도 내부적으로 buffer 를 사용하지만, 최종적으로는 모든 데이터를 메모리에 올려놓고 한꺼번에 처리하기 때문에 stream 방식과는 차이가 있다.

## Stream
```javascript
const fs = require('node:fs');

const readStream = fs.createReadStream('example.txt');

readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  console.log(chunk);
});

readStream.on('end', () => {
  console.log('No more data to read.');
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});
```
`readFile()` 같은 경우 `data` 변수에 계속 누적한다, 물론 해당 함수도 buffer 를 사용하지만, 결국 마지막에 한꺼번에 사용하기 위해 모든 data 를 메모리에 올려놔야 한다.

`readStream` 은 buffer 를 사용해서 일정한 크기로 데이터를 읽어오고, `data` 이벤트가 발생할 때마다 chunk 단위로 데이터를 전달해준다. `readFile()` 와 다른 점은 누적하지 않고 바로 다음 chunk 를 읽어온다는 차이점을 가진다.

반대로 어떤 변수를 만들고 모든 chunk 를 누적해 한번에 처리할 수도 있지만, 이러면 stream 을 쓰는 이유가 없어지게 된다.

이러한 stream 방식의 대표적인 사용처는 다음과 같다.
1. 대용량 파일 처리: 전체 파일을 메모리에 올려놓지 않고도 특정 문자열을 찾는 등 데이터를 처리할 수 있다.
2. 영상 스트리밍: 동영상 파일을 일정한 크기로 나누어서 전송할 수 있다.

이밖에도 최근에는 html 문서도 stream 방식으로 전송하는 경우가 많다. 공통점은 file 전체가 아닌 부분 부분 실시간 으로 데이터를 처리한다는 점이다.

이러한 stream 엔 3가지가 있다.
1. **Readable Stream**: 데이터를 읽어오는 스트림, Network, File System 등에서 사용
2. **Writable Stream**: 데이터를 쓰는 스트림, Network, File System 등에서 사용
3. **Duplex Stream**: 읽기와 쓰기가 모두 가능한 스트림, Network Socket 등 양방향 통신에서 사용

### Readable Stream
> 데이터를 읽기 위한 스트림, 주로 서버에서 용량이 큰 데이터를 가져올때 사용

Readable Stream 에서 사용하는 이벤트

|이벤트|설명|
|---|---|
|data|데이터를 읽을 수 있을 때마다 발생하는 이벤트, Stream 에서 읽은 데이터를 처리할 때 data 이벤트를 사용|
|end|Stream 에서 데이터를 모두 읽었을때 발생하는 이벤트|
|error|Stream 에서 오류가 발생했을 때 발생하는 이벤트|

먼저 데이터가 흘러갈 경로를 만들어야 한다. `createReadStream(path, options)` 메서드를 사용해서 파일을 읽어오는 Readable Stream 을 만들 수 있다. 그리고 `on("event", callback)` 메서드를 사용해서 이벤트를 처리할 수 있다.

`path` 파라미터는 file 의 경로가 될 수도 있고, URL 이 될 수도 있다. `options` 파라미터는 buffer 의 크기, 인코딩 방식 등을 설정할 수 있다.

```javascript
const fs = require('node:fs');

const readStream = fs.createReadStream('example.txt');

readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  console.log(chunk);
});

readStream.on('end', () => {
  console.log('No more data to read.');
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});
```

### Writable Stream

```javascript
const fs = require('node:fs');

const readStream = fs.createReadStream('input.txt', 'utf8');
const writeStream = fs.createWriteStream('output.txt');

readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  writeStream.write(chunk);
});
```

### Pipe

> Readable Stream 과 Writable Stream 을 연결하는 방법, Readable Stream 의 데이터를 Writable Stream 으로 자동으로 전달해주는 기능

> 데이터가 메모리에 거대하게 쌓이지 않고 물 흐르듯 목적지로 바로 전달되기 때문에 서버의 메모리를 아주 안전하게 유지 가능

```javascript
const fs = require('node:fs');
const readStream = fs.createReadStream('input.txt', 'utf8');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);
```