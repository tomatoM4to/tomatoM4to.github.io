---
title: "Data Communications - DNS"
description: "2026년 1학기 데이터 통신 Application layer - DNS"
date: "2026-04-27"
keywords: "Network, KNU"
---

## DNS
`google.com` 과 같은 도메인 이름을 IP 주소로 변환해주는 **거대한 분산 데이터베이스** 이자, Application Layer Protocol

**Request-Response Model** 을 따르며, TCP 나 UDP 를 사용할 수 있지만, **일반적으로 UDP 를 사용**하여 빠르게 응답을 주고받는다.

분산 데이터베이스이며 계층형 구조를 가지고 있다.
1. **Root DNS Servers** : 전세계에 13개 존재하며, 최상위 도메인(.com, .org, .net 등) 에 대한 정보를 가지고 있음, 해당 서버들을 전부 폭파시키면 인터넷 멸망
2. **Top-level Domain Servers** : 각 최상위 도메인에 대한 정보를 가지고 있음, 보통 도메인 등록 기관이 운영
3. **Authoritative Name Servers** : 최종적으로 **IP 주소를 반환**하는 역할을 함, 보통 웹 호스팅 서비스 제공업체가 운영

또 추가적으로 사용자의 System 에 Local DNS Server 가 존재하고, 해당 Server 가 DNS Query 를 처리하는 형태로 동작

만약 `www.amazon.com` 에 대한 IP 주소를 알고 싶다면, 이론적으로 다음과 같이 DNS Query 가 발생할 수 있다.
1. Client $\rightarrow$ Local DNS Server
2. Local DNS Server $\rightarrow$ Root DNS Server (.com Server 어디?)
3. Root DNS Server $\rightarrow$ Local DNS Server (TLD Server 주소 반환)
4. Local DNS Server $\rightarrow$ TLD Server
5. TLD Server $\rightarrow$ Local DNS Server (Authoritative Name Server 주소 반환)
6. Local DNS Server $\rightarrow$ Authoritative Name Server
7. Authoritative Name Server $\rightarrow$ Local DNS Server (IP 주소 반환)
8. Local DNS Server $\rightarrow$ Client

> Iterated query 라 부르며, 가장 많이 사용되는 방식


### Recursive query
Query 를 받은 Server 가 직접 하위 서버에 물어보고 최종적으로 IP 주소를 반환하는 방식, Root DNS Server 가 IP 를 반환할 때 까지 계속해서 Recursive Query 를 수행하는 형태로 동작

Root DNS Server 에 모든 질의 부담이 집중되어 거의 사용되지 않음

Example
1. Client $\rightarrow$ Local
2. Local $\rightarrow$ Root
3. Root $\rightarrow$ TLD
4. TLD $\rightarrow$ Authoritative
5. Authoritative $\rightarrow$ TLD
6. TLD $\rightarrow$ Root
7. Root $\rightarrow$ Local

### Caching
한번 알아낸 매핑 정보를 Local Memory 에 저장하여 응답 시간을 단춧

TTL(Time To Live) 이라는 개념이 존재하여, 저장된 정보는 일정 시간이 지나면 삭제

한계: 원본 서버의 IP 가 바뀌더라도 TTL 이 만료될 때 까지는 구버전 정보를 반환함

### DNS Record Types
DB 에 저장되는 정보니 엄격한 형식이 존재함, 물론 당연하게도 해당 Record 보다 훨씬 더 많은 정보가 존재하지만, 여기선 간단하게 가장 대표적인 Record Type 들만 살펴보자

| Type | Name | Value | Description |
| --- | --- | --- | --- |
| A | Hostname | IP Address | 도메인의 실제 IP 주소 매핑 |
| NS | Domain | Hostname | 해당 도메인을 관리하는 책임 DNS 서버의 이름 |
| CNAME | Alias Name | Canonical Name | 별칭 도메인을 실제 도메인 이름으로 연결 |
| MX | Domain | Hostname | 해당 도메인과 연결된 메일 서버(SMTP) 이름 |

## 도메인 등록의 실제 흐름

새로운 스타트업 `networkutopia.com` 을 도메인 등록기관에 등록한다고 가정해 보자.

이때 도메인 등록 기관은 상위 계층 `.com` 의 TLD 서버에 두가지 레코드를 삽입해 준다.

* `NS` 레코드 : `networkutopia.com` 도메인을 관리하는 Authoritative Name Server 의 이름을 등록
  *  (`networkutopia.com`, `dns1.networkutopia.com`, `NS`)
* `A` 레코드 : Authoritative Name Server 의 IP 주소를 등록
  * (`dns1.networkutopia.com`, `212.212.212.1`, `A`)

즉 도메인 업체에서 Name Server 를 설정하는 행위가 바로 상위 TLD 서버에 내 책임 서버 (Authoritative Name Server) 의 정보를 등록하는 행위인 것이다.

> `A` 레코드를 TLD 에 등록하는 이유는, 만약 User 가 `networkutopia.com` 를 요청할시, `dns1.networkutopia.com` 와 순환참조가 발생할 수 있기 때문