---
title: "Data Communications - TCP (2)"
description: "2026년 1학기 데이터 통신 Transport layer - TCP, 혼잡제어"
date: "2026-06-18"
keywords: "Network, KNU"
---

## Congestion
> 너무 많은 송신자가 너무 많은 데이터를 빠르게 전송하여, Network(Router) 가 감당하지 못하는 상태

* 증상1. Long Delay
* 증상2. Packet Loss

> Flow Control 는 수신자를 보호하는 것이고, Congestion Control 은 Network Infra 를 보호 하는것임

아래 사진과 설명은 3가지 시나리오에 관한 설명

## 무한한 Buffer 를 가진 Router 1개

* 최대 처리량(Throughput)은 링크 용량($R/2$)을 절대 넘을 수 없습니다.
* 트래픽이 처리 용량($R/2$)에 근접할수록 지연 시간(Delay)이 무한대로 길어집니다.

## 유한한 Buffer 를 가진 Router 1개

* 패킷 유실 또는 '성급한 타임아웃(Premature Timeout)'으로 인해 불필요한 재전송(Retransmission)이 발생합니다.
* 똑같은 패킷이 여러 번 전송되면서 한정된 대역폭을 낭비하게 되어, 실제 유효한 데이터 처리량(Goodput)이 크게 감소합니다.

## Multi-hop Router

* 패킷이 1번, 2번 라우터를 잘 통과했는데 3번 라우터에서 꽉 막혀서 버려졌다고 가정해 봅시다.
* 치명적 비용: 해당 패킷이 1번, 2번 라우터를 통과하며 사용했던 '상위(Upstream) 라우터의 전송 용량과 버퍼'가 완전히 헛수고(Wasted)가 되어버립니다.

## Congestion Control 의 2가지 접근법
1. **End-to-end congestion control**: TCP 가 사용하는 방식
  * Network(Router)는 혼잡 상태를 직접 알려주지 않음
  * End System 이 Packet Loss(Timeout, 3 Dup-ACK) 이나 지연시간을 보고 스스로 Network 의 상황을 추론하여 속도를 줄임
2. **Network-assisted congestion control**: 라우터가 송수신자에게 "나 지금 막혀!"라고 직접 피드백을 줌 (예: ATM, ECN 등)

## AIMD & cwnd
> 송신자는 **혼잡 윈도우(cwnd, Congestion Window)** 라는 변수를 유지하며 전송 속도를 조절

* 대략적인 전송 속도: $TCP~rate \approx \frac{cwnd}{RTT} \text{ bytes/sec}$

**AIMD**
* **Additive Increase**: Packet Loss 가 발생하지 않으면, 매 RTT 마다 `cwnd` 를 1MSS(최대 Segment 크기)씩 조금씩 선형적으로 늘려 대역폭을 탐색
* **Multiplicative Decrease**: 손실이 감지되면, `cwnd` 를 절반으로 확 줄임

![AIMD](/img/network/AIMD.webp)

## 혼잡 제어의 3단계 상태 변화
> 네트워크의 혼잡 임계값인 `ssthresh (Slow Start Threshold)`를 기준으로 상태가 변함

### Slow Start
* 연결이 시작되거나 심각한 혼잡(Timeout) 직후에 시작
* 처음 `cwnd = 1 MSS`로 시작하여, ACK를 받을 때마다 1씩 증가, 2배씩 기하급수적으로 증가함
* 이름은 'Slow'지만 실제로는 대역폭을 매우 빠르게 치고 올라감
* `cwnd`가 `ssthresh` 값에 도달하면 혼잡 회피(Congestion Avoidance) 단계로 넘어갑

### Congestion Avoidance
* `cwnd`가 `ssthresh` 이상일 때 작동, 이제 위험해 질 가능성이 높다는 의미
* 기하급수적 성장을 멈추고, 매 RTT마다 `cwnd`를 딱 1 MSS씩만 선형적으로(Linear) 증가

### 패킷 손실 감지 시 (Fast Recovery / Timeout)

**상황 A: 3 Dup-ACK 발생 (가벼운 유실 / Fast Recovery)**
* 네트워크가 완전히 뻗은 건 아니고 패킷 하나만 잃어버렸다고 판단
* `ssthresh`를 현재 `cwnd`의 절반(1/2)으로 줄임
* `cwnd`를 `ssthresh + 3 MSS`로 설정하고 빠른 회복(Fast Recovery) 상태로 진입하여 부드럽게 복구 (TCP Reno 방식)

**상황 B: Timeout 발생 (심각한 유실)**
* 네트워크가 꽉 막혀서 마비되었다고 판단
* `ssthresh`를 현재 `cwnd`의 절반(1/2)으로 줄임
* `cwnd`를 1 MSS로 초기화
* 다시 Slow Start 부터 시작

## TCP 의 공평성
> 2개의 TCP 세션이 하나의 대역폭 $R$인 병목 링크를 공유할 때, 시간이 지나면 각각 정확히 $\frac{R}{2}$ 씩 공평하게 대역폭을 나눠 가지게 될까?

> YES: TCP의 AIMD(가산 증가, 승산 감소) 메커니즘 특성상, 계속 늘렸다가 절반으로 깎는 과정을 반복하다 보면 수학적으로 정확히 동일한 대역폭(Equal bandwidth share)으로 수렴하게 됨

## 모든 네트워크 앱이 공평할까?
> UDP의 이기적임: 스트리밍 앱(UDP 사용)은 혼잡 제어를 하지 않고 일정한 속도로 데이터를 쏟아냅니다. TCP는 혼잡을 느끼고 속도를 줄이지만 UDP는 줄이지 않기 때문에 TCP가 손해를 봅니다.

> 병렬 TCP 연결 (꼼수): 웹 브라우저들은 공평성을 무시하기 위해 꼼수를 씁니다. 하나의 링크에 9개의 연결이 있을 때, 새로운 앱이 1개의 TCP 연결을 맺으면 대역폭의 1/10을 얻지만, 11개의 병렬 TCP 연결을 동시에 맺어버리면 혼자서 대역폭의 절반(11/20) 이상을 쓸어갈 수 있습니다.


## Quiz

Q. 호스트 A가 TCP Reno 알고리즘을 사용하여 호스트 B로 데이터를 전송 중이다. 현재 호스트 A의 `cwnd`(혼잡 윈도우) 크기는 12 MSS이고, `ssthresh`(슬로우 스타트 임계값)는 8 MSS로 혼잡 회피(Congestion Avoidance) 단계를 진행 중이었다. 이때 수신자 B로부터 '3개의 중복 ACK(Triple Duplicate ACKs)'가 수신되었다.

* (a): 이 직후 호스트 A의 ssthresh와 cwnd 값은 각각 얼마(MSS)로 변경되는가?
* (b): 호스트 A는 어떤 상태(Phase)로 전이하며, '타임아웃(Timeout)'이 발생했을 때와 비교하여 왜 이런 방식으로 다르게 동작하는지 그 이유를 설명하시오.

> (a) ssthresh = 6 MSS, cwnd = 9 MSS: TCP Reno에서 3 Dup-ACK 발생 시, `ssthresh`는 현재 `cwnd`의 절반(`12 / 2 = 6`)이 됩니다. 그리고 `cwnd`는 새로운 `ssthresh` 값에 3을 더한 값(`6 + 3 = 9`)으로 설정됩니다.

> (b) 빠른 회복(Fast Recovery) 상태로 전이합니다: 타임아웃은 패킷이 아예 전달되지 않는 '네트워크 마비(Severe Congestion)'를 의미하므로 `cwnd`를 1로 곤두박질치게 만듭니다. 반면, 3 Dup-ACK는 중간에 패킷 하나가 유실되긴 했지만 그 이후의 패킷들은 수신자에게 무사히 도달하고 있다는 뜻이므로 단일 패킷 유실일 확률이 높습니다. 따라서 윈도우를 바닥으로 내리지 않고, 절반 수준에서 부드럽게 복구하여 전송 효율(Throughput)을 유지하기 위함입니다.

Q. 다중 홉 경로를 거치는 네트워크 환경(시나리오 3)에서 혼잡이 발생할 때의 비용(Cost of Congestion)에 관한 문제이다. 송신자가 보낸 패킷이 여러 라우터를 무사히 통과했으나, 목적지 바로 앞의 마지막 라우터에서 큐(Queue)가 가득 차 버퍼 오버플로우로 인해 드랍(Drop)되었다고 가정하자.

* (a): 이 상황에서 네트워크 인프라 관점에서 발생하는 가장 치명적인 '자원 낭비'는 무엇인가?
* (b): 위와 같은 무의미한 유실을 줄이고 파이프를 적절히 채우기 위해, 송신자는 패킷이 유실되기 전이라도 어떤 '지표'를 관찰하여 혼잡을 미리 피할 수 있는가? (Delay-based TCP 관점)

> (a) 상위(Upstream) 라우터들의 자원 낭비: 패킷이 마지막 라우터에서 버려지면, 해당 패킷을 그곳까지 전달하기 위해 **이전 라우터들이 뼈빠지게 소모했던 전송 용량(대역폭)과 버퍼 공간이 완전히 헛수고(Wasted)** 가 되는 치명적인 낭비가 발생합니다.

> (b) 왕복 지연 시간(RTT, Round Trip Time): 병목 링크의 라우터 큐에 패킷이 쌓이기 시작하면, 패킷이 버려지기(Loss) 전이라도 RTT가 먼저 뚜렷하게 증가합니다. 지연 기반(Delay-based) TCP는 이 RTT 증가를 감지하여 버퍼가 넘치기 전에 송신 속도를 미리 조절합니다.

Q. 대역폭이 `R`인 하나의 병목 링크를 9개의 기존 TCP 연결이 완전히 꽉 채워 사용하고 있다. (각 연결은 이상적으로 `R/9`의 대역폭을 점유 중이다.) 이때 새로운 사용자가 대용량 파일을 최대한 빨리 다운로드하기 위해 자신의 애플리케이션을 실행했다.

* (a): 이 사용자가 자신에게만 더 많은 대역폭을 할당받기 위해 고의로 악용할 수 있는 가장 대표적인 '꼼수(방법)'는 무엇인가?
* (b): 위 (a)의 방법으로 이 사용자가 11개의 연결을 추가로 맺었다고 가정할 때, 이 얌체 사용자가 최종적으로 차지하게 되는 전체 대역폭의 비율을 수식으로 도출하시오.

> (a) 다중 병렬 TCP 연결 (Parallel TCP connections) 생성: TCP는 '사용자 단위'가 아니라 **'연결(Connection) 단위'** 로 대역폭을 공평하게 분배합니다. 따라서 하나의 애플리케이션이 여러 개의 TCP 연결을 동시에 열어버리면 대역폭을 강제로 더 많이 뺏어올 수 있습니다. (실제 웹 브라우저들이 속도를 높이기 위해 자주 쓰는 방식입니다.)

> (b) 11/20 R (전체 대역폭의 55%): 기존에 9개의 연결이 있었고 신규 사용자가 11개의 병렬 연결을 생성했으므로, 병목 링크에는 총 20개의 TCP 연결이 생겨 서로 경쟁하게 됩니다. TCP AIMD 알고리즘에 의해 각 연결당 `R / 20` 씩 공평하게 대역폭이 할당됩니다. 따라서 11개의 연결을 가진 이 사용자는 전체 대역폭의 **11 / 20** 을 독식하게 됩니다.