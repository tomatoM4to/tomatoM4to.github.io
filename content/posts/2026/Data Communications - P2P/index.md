---
title: "Data Communications - P2P"
description: "2026년 1학기 데이터 통신 Application layer - P2P"
date: "2026-04-13"
keywords: "Network, KNU"
---

## Peer to Peer
SMTP 나 `Http`, `DNS` 는 **Server-Client 아키텍처 모델**이였다. 가장 기본적은 가정은 서버가 해야하는 역할과 클라이언트의 역할이 나누어져 있고, 서버는 요청한 서비스를 수행한다.

`P2P` 는, 중앙 서버를 거치지 않고, **인터넷으로 연결된 개인 컴퓨터(Peer) 끼리 직접 데이터를 주고받는 통신 방식**

**주요특징**
* 항상 Running 하는 **서버가 없다.**
* 스패셜한 노드가 없다. 모든 참가하는 디바이스가 서버이자 클라이언트가 되는 모델
* 내가 요청도 하지만 내가 가지고 있는 자원(파일) 을 제공하는 역할도 한다.
* P2P 에 참여하는 디바이스는 Peer 라고 부른다.
* 중앙 서버 부하가 적고, 서버가 다운되어도 **네트워크가 유지**될 수 있음
* **탈중앙화:** 사용자가 서버이자 클라이언트 역할을 동시에 수행
* **성능 의존:** 참여하는 Peer 의 수가 적으면 전송 속도가 느려질 수 있음, 개인 컴퓨터 성능도 중요한 이슈중 하나

중간 수수료 절감, 서버 마비 위험 없음, (조건부)빠른 대용량 파일 전송 가능한 방식이지만, 사용자 IP 노출로 인한 보안 위험, 서버 방식보다 어려운 데이터 관리 등등 단점도 존재함

기술적으로 가장 **어려운 부분**은, 항상 **Attach 되어 있는 Server 가 없**고, 기존에 Attach 되어 있더라도 **언제든 끊어질 수 있다**는 점에서, **받고 있는 사용자 입장에서 어디에 가서 받아야 하지?** 를 처리하는 점이 가장 어려운 부분

> Server-Client 모델도 Distributed System 을 활용하면 서버 마비 위험에서 어느정도 자유로울순 있음, 대표적으로 DNS 의 Top level, Authoritative name server 등등으로 나누는 것이 그 예

### File distribution time: client-server
당연히 기존 문제를 해결하기 위해 나온 기술인 만큼
* Server-Client 모델보다 더 효율적인 서비스
* 자원을 Distribute 할 수 있다는 점

그렇다면 **수식적으로** 얼마나 더 효율적인지 이야기 해보자

Server-Client Model Setup
1. 최초로 파일을 서비스 하는 Server 가 존재함
2. 해당 Server 로부터 데이터를 받고 싶어하는 Client 가 여러개 있음

$$
D_{c-s} \ge \max \left\{ \frac{NF}{u_s}, \frac{F}{d_{min}} \right\}
$$

* $u_s$ : Server 의 업링크 속도
* $d_{min}$ : **가장 느린** Client 의 다운링크 속도 (최악의 경우)
* $\frac{NF}{u_s}$ : Server 가 N 명의 Client 에게 파일을 업로드 하는데 걸리는 시간
* $\frac{F}{d_{min}}$ : 가장 느린 Client 가 파일을 다운로드 하는데 걸리는 시간

> 굉장히 러프한 계산식으로, `max(File 을 N명에게 업로드 하는시간, 가장 느린 Client 가 다운로드 하는 시간)` 보다 더 걸릴수 밖에 없다는 의미를 가짐

> 중요하게 볼 점은 N 명에게 배포하기 위해 선형적으로 시간이 늘어난다는 점

### File distribution time: P2P
P2P 아키텍처에선, Server 뿐만 아니라 Peer 들 역시 업로드에 참여하여 자원을 제공한다는 점을 고려해야 함

**P2P Model Setup**
1. Server 가 File 을 Network 에 **최소 한번은 전체 업로드** 해야 함
2. 데이터를 받고 싶어하는 Client 가 여러개 있음

$$
D_{p2p} \ge \max \left\{ \frac{F}{u_s}, \frac{F}{d_{min}}, \frac{NF}{u_s + \sum_{i=1}^{N} u_i} \right\}
$$

* $\frac{F}{u_s}$ : Server 가 File 을 최소 한번 업로드 하는 시간
* $\frac{F}{d_{min}}$ : 가장 느린 Client 가 다운로드 하는 시간
* $\frac{NF}{u_s + \sum_{i=1}^{k} u_i}$ : System 전체가 **총 다운해야 할 NF** 를 네트워크 **전체의 업로드 능력(Server + 모든 Peer 의 업로드 속도의 합) 으로 나눈 시간**

> Client-Server 모델은 N 이 커질수록 분산 시간이 선형적으로 증가했지만, P2P 모델에서는 **Peer 가 늘어날수록** ${\sum_{i=1}^{N} u_i}$ 도 함께 증가하기 때문에, **참여자가 많을수록** Service 의 **수용 능력도 함께 증가(Self-scalability)** 한다는 점이 가장 큰 장점임

## Bit Torrent
P2P 서비스 중 가장 성공적인 사례는 `BitTorrent`라는 파일 공유 시스템이다. 해당 서비스는 이전에 말했던 가장 어려운 문제인 **어디에 가서 받아야 하지?** 문제를 해결하기 위해, **Tracker** 라는 개념을 도입했다. 해당 서비스에서 새로 다음과 같은 용어가 등장함

* Torrent: Peer 들의 그룹
* Tracker: 해당 Torrent 에 참여하고 있는 Peer 들을 추적하는 **중앙 서버**

이전까진 Client 끼리 이어진 Network 를 상상하면 되었지만 BitTorrent 같은 경우, 여기에 Tracker 라는 중앙 서버가 추가로 연결된 그림을 상상하면 됨

> 중앙 서버가 존재하는 P2P 라는게 이상할 수 있지만, Peer 들이 서버 없이 서로 맨땅에서 찾아내야 하는 오버헤드를 줄이기 위한 현실적인 타협안, 초기엔 P2P 로 인정하지 않으려는 움직임도 있었음

Peer 가 처음으로 Torrent 에 접속하면 다음과 같은 과정이 일어남
1. Peer 는 **Tracker** 에 자신의 **존재를 알림**
2. Tracker 는 해당 Torrent 에 참여하고 있는 **Peer 들의 정보를 줌** (필요한 만큼)
3. Peer 는 해당 Peer 들에게 **Connection** 을 시도함, 이때 File 을 한번에 받는것이 아닌 Chunk 단위로 요청하며, Network 상에서 가장 적게 존재하는 Chunk 를 우선적으로 요청하는 Rarest First 전략을 사용
4. 모든 File 을 다 받으면 떠나거나 계속 공유하거나 하는 **선택 사항**이 있음

> Chunk: 파일을 256Kb 정도로 나눈 작은 단위

이러한 구조에서 발생하는 주요 이슈
* **보안 이슈:** Poison Data 처럼 데이터 자체가 변질된 채로 공유 되는 문제가 발생할 수 있음, 내용물의 오염을 막기 위해 Chunk 마다 Hash 나 Signature 를 줄 수 있지만, 이는 오버헤드로 작용할 수 있음
* **Free-Rider 문제:** 자신의 File 은 공유하지 않고 다운로드만 얌체처럼 받아가는 경우, 실제로 P2P 에서 가장 큰 고민거리중 하나

BitTorrent 는 Free-Rider 문제를 해결하기 위해 `Tit-for-Tat` 전략을 사용함
* **TOP 4 Rule:** 나에게 가장 빠른 속도로 Chunk 를 제공해준 상위 4명의 Peer 에게만 내 Chunk 를 제공
* **Optimistic Unchoke:** 랜덤하게 1명의 Peer 를 선택해 무조건 Chunk 를 제공, 이 랜덤 픽 덕분에 새로 들어온 Peer 도 데이터를 주고 받으며, 언젠가 상위 4명에 들어갈 수 있는 기회를 가질 수 있음

## Distributed Hash Table (DHT)
DHT 는 Tracker 같은 중앙 서버 없이 Peer 들을 관리하는 시스템 혹은 Database 라고 부를수 있겠다.

**핵심 컨셉**
* Key-Value 쌍을 Peer 에 분산하여 저장
* **예시:** Key 는 **File 의 Hash**, Value 는 해당 File을 가진 **Peer 의 정보(IP 주소 등)**

새로운 Peer 가 네트워크에 참여할 때, DHT 에 자신의 Key-Value 쌍을 등록함으로써 다른 Peer 들이 해당 정보를 찾을 수 있도록 함

### Bootstrap
Peer 가 처음으로 Network 에 조인할때, 어떻게 **주변 Peer 들을 탐색하고 DHT 에 자신의 정보를 알릴수 있을까?** 라는 문제

DHT 는 **탈중앙화**되어 있으므로 새로운 Peer 가 탐색을 시작하려면 최소한 하나의 진입점이 필요하다, 이때 **Bootstrap Node** 라는 특별한 Peer 가 존재하며, **초기 Peer 는 이 Bootstrap Node 에 연결된다.**

연결이 완료되면 **Peer 는 자신의 ID 를 조회**한다 (자신의 IP 주소 등을 해시하여 정수로 변환). 만약 이 ID 가 10 이라 가정해 보자.

Bootstrap Node 가 DHT Network 의 라우팅(Successor 타고 넘어가기)을 통해 10번이 들어갈 자리를 찾아, **인접하게 될 Peer 들에게 정보를 업데이트 하도록 요청**한다 (8번과 12번 Peer 에게 10번이 들어갈 수 있도록).

결과적으로 아래와 같이 Peer 는 자신의 위치를 DHT Network 에 알리게 되고, 다른 Peer 들도 10번이 어디에 있는지 알게 된다.
* `8 Peer` : `Predecessor : 10 보다 작은 가장 가까운 Peer`, `Successor: 10`
* `10 Peer` : `Predecessor: 8`, `Successor: 12`
* `12 Peer` : `Predecessor: 10`, `Successor: 12보다 큰 가장 가까운 Peer`


### How to assign keys to peers?
다음으로 File 을 공유하기 위해 **DHT Table 에 Key-Value 쌍을 어떻게 업데이트** 할 수 있을까?

우선 참여하려는 Peer 는 공유하려는 File 의 이름을 해시하여 정수로 변환한다. (예시: `h("yonna.mp3")` = 11)

그런 다음 **File 의 Hash 값과 가장 가까운 Peer ID** 를 찾아가, 해당 Peer 의 DHT 에 `(Key: 파일 해시값, Value: 내 IP 주소)` 형태의 **정보를 등록**함으로써, 다른 Peer 들이 해당 File이 어디에 있는지 찾을 수 있도록 한다.

찾아갈때는 Successor 나 Predecessor 를 타고 가면서, `h("yonna.mp3")` 와 가장 가까운 Peer ID 를 찾아가면 된다.

**Step by Step**
1. Peer 가 `yonna.mp3` 라는 파일을 공유하기 위해 네트워크에 참여함
2. `h("yonna.mp3")` 를 통해 파일의 Hash 값을 계산하여 정수 ID 로 변환
3. DHT 에서 `h("yonna.mp3")` 와 가장 가까운 Peer ID 를 찾아 해당 Peer 의 DHT 에 `(Key: h("yonna.mp3"), Value:  ip_address)` 형태로 정보를 등록
4. 다른 Peer 가 `yonna.mp3` 를 찾고 싶어할 때, `h("yonna.mp3")` 를 계산하여 DHT 에서 해당 Key 에 대응하는 담당 Peer를 찾아 Value (즉, 제공자의 IP 주소)를 얻어낸 후 직접 연결하여 파일을 다운로드.

> Hash 값이 무한정 커질 수 없으므로, 일반적으로 n bits 로 표현하여 `[0, 2^n - 1]` 범위의 정수로 제한함

> `h("yonna.mp3")` 와 정확히 일치하는 Peer ID 가 존재하지 않더라도, DHT 룰에 따라 **해당 값보다 크면서 가장 가까운 다음 순서의 Peer(Successor)** 가 key-value 쌍 을 보관하게 된다.

> **DHT 는** 실제 물리적으로 가까운 Peer 를 찾는 것이 아니라, Hash 값이 가장 가까운 Peer 를 찾는 **논리적인 Overlay Network** 이므로, 실제로 VPN 이나 P2P 네트워크에서 흔히 볼 수 있는 구조임

### File Sharing Example
1. Peer A 가 `yonna.mp3` 파일을 다운로드 하고 싶어함
2. Peer A 는 `h("yonna.mp3")` 를 계산하여 `h("114.70.235.211")` 과 대응된걸 확인함
3. 해당 DHT 에서 실제 File 을 가지고 있는 Peer 의 IP 주소를 얻어냄 (예시: `143.248.9.1`)
4. Peer A 는 `143.248.9.1` 에 connection 을 시도하여 `yonna.mp3` 파일을 다운로드

### Circular DHT

### Finger Table

### Peer Churn

***
***

## How to assign keys to peers?



근데 어떤 특정 정보를 누구한테 Assigning 하지? 가 중요한 문제 (key, value) pair 들을 p2p 에 조인하고 있는 노드들 (DHT 를 구성하고 있는 노드) 들이 나눠가지고 있는데.. 이중 누구에게 받아야 하는가? 가 문제임

Basic idea 는 다음과 같음
1. Convert each key to an integer
2. Assign integer to each peer, 만약 A 라는 파일을 가지고 싶으면 예를들어 파일 이름을 변환 시킴(해시 사용) 그리고 각각 참여하고 있는 노드들의 아이디도 변환 시킴 이렇게 두개의 integer 가 생김, 이게 같은 Node 가 파일 정보를 가질 수 있게 만든것이 핵심, 근데 만약 틀리면? 이럼 가장 가까운 노드가 제공하도록.. 만든.. 룰.. 시발 복잡하네

> Overlay network: 논리적 네트웤, 피지컬 위에서 동작

해시값이 무한정 커질순 없으니 한계를 정하는데 n bits 로 표현함, 결국 가질수 있는 개수가 [0, 2^n - 1] 개가 됨

해시값이 틀리면 (애초에 없었거나, 컴퓨터를 껐거나) 이럴경우 가장 가까운 노드가 제공하도록 룰이 만들어짐. 5번이 없음 6번이 서비스 하도록, 이건 서비스를 만드는 사람이 룰을 정할 수 있음

근데 부여된 ID 가 가깝다는건 실제 물리적으로 가까운게 아님, 어떻게 준거에 따라 달라질 수 있지만, 실제로 vpn 이나 p2p 나 logical network 은 이런걸 의미함

## file sharing example
분산된 DB 에 `yonna.mp3` 는 누가 가지고 있나? p2p 네트워크에 물어봐야함, 일단 `h("yonna.mp3")` 를 돌려봒더니 `h("114.70.235.211")` 에 대응이 된걸 확인함, 즉 1번 이란 친구가 찾고자 하는 파일에 대한 정보를 가지고 있음, 1번은 `143.248.9.1` 이 가지고 있다는걸 알고 있고 다운로드자는 해당 ip 에 connection 을 시도함

이렇듯 내가 원하는 컨텐츠의 해시값과 같은 결과를 내는 노드의 해시값을 비교

## 결과를 내는 노드는 어떻게 찾는가?
Circular DHT 방식으로 찾아감, 바로 IP 주소를 알아낼순 없으니 overlay network 에 던짐 `1110` 이 누구야? 계속 넘어가다 `1111` 이 감, `1110` 은 없으니 이놈이 서비스를 시작함

순차 탐색이니 효율적으로 찾을수 있는 방법이 연구되었고 완료됨