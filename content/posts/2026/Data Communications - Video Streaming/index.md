---
title: "Data Communications - Video Streaming"
description: "2026년 1학기 데이터 통신, Video Streaming 과 CDN 에 대한 정리"
date: "2026-04-27"
keywords: "Network, HTTP, KNU"
---

## Video Streaming
인터넷 비디오 트래픽은 전체 bandwidth 의 상당 부분을 차지하는 트래픽 유형으로, `YouTube`, `Netflix`, `Twitch` 등 다양한 플랫폼에서 제공되는 서비스의 핵심 요소다.

**주요 과제**
* 확장성 : 약 10억명의 막대한 사용자를 어떻게 동시에 수용할 것인가?
* 이질성(Heterogeneity) : 다양한 네트워크 환경과 디바이스에서 어떻게 원활한 스트리밍을 제공할 것인가?

## Compression
Video 를 원본 그대로 전송하는 것은 비효율적이므로, 압축 기술이 필수적이다. 대표적인 압축 기술로는 `H.264`, `H.265`, `VP9` 등이 있다.

* 공간적 압축(Spatial Compression) : 한 프레임 내에서 유사한 픽셀을 그룹화하여 압축하는 방식
* 시간적 압축(Temporal Compression) : 연속된 프레임 간의 유사성을 이용하여, 변화가 적은 부분을 압축하는 방식
* Bitrate Control : 네트워크 상태에 따라 비디오 품질을 조절하여, 버퍼링을 최소화하는 기술

## Client Buffering
Server 는 일정한 속도로 데이터를 전송하지만, 네트워크 혼잡이나, 패킷 손실로 지연이 발생할 수 있다. 이를 완화하기 위해, Client 는 일정량의 데이터를 미리 받아서 저장하는 Buffering 기술을 사용한다.

처음 Server 로부터 데이터를 일정량 이상 받아와야지만, 비디오 재생을 시작하는 방식, 이때 비디오 재생 또한 일정한 속도로 진행되므로, 만약 버퍼의 데이터가 모두 소진되면, 재생이 일시적으로 멈추는 Buffering Event 가 발생한다.

## DASH(Dynamic Adaptive Streaming over HTTP)
사용자의 Network 환경 변화에 맞춰 비디오 화질을 동적으로 조절하는 HTTP 기반 스트리밍 기술

Server 측은 Video File 을 여러개의 Chunk 로 나눈 후, 각 Chunk 를 여러 화질로 인코딩하여 저장한다. Client 에겐 Chunk 들의 URL 정보를 담은 Manifest File 을 전달하는 역할

Client 측는 Manifest File 을 참조하여, 주기적으로 현재의 가용 대역폭을 측정한다. 이를 바탕으로 Buffer 가 고갈되거나 넘치지 않도록 적절한 시점에, 현재 대역폭으로 감당 할 수 있는 최적화된 화질의 Chunk 를 스스로 결정하여 요청한다.

## CDN
전세계의 방대한 사용자에게 콘텐츠를 원할하게 스트리밍 하기 위한 분산 인프라, 일종의 Cache Server 들을 전세계에 분산 배치해놨다 생각하면 됨

**구축 방식**
* Enter deep : Akamai 와 같이 다수의 서버를 Access Network 의 깊숙한 곳까지 매우 촘촘하게 배치하는 방식
* Bring home : Limelight 와 같이 Access network 근처의 POP 에 소수지만 거대한 서버 클러스터를 배치하는 방식

**라우팅 원리**
* Authoritative DNS 가 비디오를 보유하고 있는 가장 적합한 CDN 서버의 IP 주소를 반환하여 그곳에서 직접 스트리밍을 받도록 연결한다.

## Netflix 의 CDN 사례
Netflix 는 CDN, DASH 를 모두 융합하여 OTT 서비스를 제공한다.
1. 계정 관리 및 인증 : Amazon Cloud 를 통해 이루어 진다.
2. 콘텐츠 저장 및 배포 : 다양한 화질로 인코딩된 비디오 복사본들을 자체 CDN 서버망에 업로드
3. CLient 가 Video 를 선택하면, Amazon Cloud 에서 Manifest File 을 전달받는다.
4. Client 는 Manifest File 을 기반으로 DASH 기술을 이용해 최적의 CDN 서버로부터 직접 스트리밍을 받는다.