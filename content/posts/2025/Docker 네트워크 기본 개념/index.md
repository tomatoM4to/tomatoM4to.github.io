---
title: "Docker 네트워크 기본 개념"
description: "Docker Container의 외부 통신 원리인 Port Forwarding과 가상 네트워크 인터페이스 구조, 그리고 다양한 Network 모드에 대해 알아봅니다."
date: "2025-06-17"
keywords: "Docker"
---

# Network

Container 는 기본적으로 Host OS 에서만 접근 가능

외부와 통신하려면 Port 를 열어야 함, 그리고 Host OS 의 Port 와 연결시켜야 함

이렇게 Port 를 연결하는 과정을 Port forwarding 이라고 함

이러한 Port forwarding 을 위해서는 Docker run 명령어에 `-p` 옵션을 사용함

추상화가 잘 되어 있기 때문에 이런 간단한 명령어만을 이용해도 외부와 통신하는 Container 를 운용할 수 있음

***

# Network Interface

하지만 여기에선 좀더 깊이 들어가 어떻게 Container 가 외부와 통신하는지 알아보고자 함

Docker 에선 Network 를 위해 `docker0`, `veth`, `eth0` 라고 불리는 가상 네트워크 인터페이스를 사용함

각 인터페이스는 하드웨어를 추상화 한것이라 생각해도 무방함

1. `docker0` : bridge, L2 스위치
2. `veth` : LAN 케이블
3. `eth0` : NIC

`docker0` 와 `veth` 는 1:N 관계로 연결되어 있고, `veth` 와 `eth0` 는 1:1 관계로 연결되어 있다는걸 연상하면 됨

***

# Network

Docker 는 위의 구조 말고도 다른 Network 모드를 제공함

1. `bridge` : 기본 모드, 위에서 설명한 구조
2. `host` : Host OS 의 Network 를 그대로 사용, Port forwarding 이 필요 없음
3. `none` : Network 를 사용하지 않음, Container 간 통신 불가

`host` 모드를 사용하면 `veth`와 `eth0` 가 생성되지 않고 Host Os 의 Network 를 그대로 사용하게 됨, 그러므로 Port forwarding 이 필요 없음, Container 의 경량화 또한 장점

하지만 Container 간의 격리성이 떨어지는 단점이 존재

여기서 집중할건 `bridge` 모드임, `bridge` 모드는 기본적으로 `docker0` 를 통해 Container 간 통신을 하게 됨 아무런 옵션 없이 Container 를 실행하면 `bridge` 모드로 실행됨, 그러므로 우리가 지금까지 생성한 모든 Container 는 `bridge` 모드로 실행된 것임

이러한 `bridge` 는 또 여러개의 `bridge` 를 생성할 수 있음, 일단 Docker 에서 기본적으로 `bridge` 를 하나 생성해 주긴 함

이러한 Network 모드들은 `docker network` 명령어로 확인할 수 있음

```bash
docker network ls
```

***

# Bridge

일단 실험을 위해 여러 Container 를 생성해 보자, 터미널을 여러개 열고 아래 명령어를 입력해 보자

```bash
docker run -it --name container1 alpine sh
docker run -it --name container2 alpine sh
```

이렇게 생성된 Container 는 모두 `bridge` 모드로 실행됨

아래 명령어로 해당 `bridge` 에 어떤 Container 가 연결되어 있는지 확인할 수 있음

```bash
docker network inspect bridge
```

이 명령어를 실행하면 `bridge` 의 서브넷 마스크와 연결된 Container 의 IP 주소를 확인할 수 있음

```json
...
"IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
...
"Containers": {
            "891e9e01c286a07ad2d39daad3fca9ad5eb460ff1e787f362148f3ea4ae1a56f": {
                "Name": "container2",
                "EndpointID": "8e33a3d53d8a2f1bbf63243e60357c0025f1ab4fd52d4e80356858e57d50276e",
                "MacAddress": "1a:eb:81:17:05:a7",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            },
            "9260cf6594858f093baf61596773416aad88ddb193467c6becdb1a9ca656ab85": {
                "Name": "container1",
                "EndpointID": "9ae048e845f8e5c5c7f4df1bddd280a75570417d15ca463a1a067803208d98c2",
                "MacAddress": "f6:8a:c3:ed:71:c8",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            }
        },
...
```

여기서 유심있게 봐야할 점은 Container 각각에 `IPv4Address` 가 할당되어 있다는 점임, 그렇다면 같은 `bridge` 에 연결된 Container 간 통신이 가능 하다는 뜻이기도 함, L2 기반 내부 통신이기 때문에 따로 Port forwarding 을 하지 않아도 통신이 가능함

이제 다시 `alpine` Container 에 접속해 private ip 주소로 ping 테스트를 시도해볼 수 있음

아래는 `container1` 에서 `container2` 로 ping 테스트를 하는 예시와 결과임

```bash
/ # ping -c 5 172.17.0.3
PING 172.17.0.3 (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.049 ms
64 bytes from 172.17.0.3: seq=1 ttl=64 time=0.111 ms
64 bytes from 172.17.0.3: seq=2 ttl=64 time=0.134 ms
64 bytes from 172.17.0.3: seq=3 ttl=64 time=0.153 ms
64 bytes from 172.17.0.3: seq=4 ttl=64 time=0.106 ms

--- 172.17.0.3 ping statistics ---
5 packets transmitted, 5 packets received, 0% packet loss
round-trip min/avg/max = 0.049/0.110/0.153 ms
```

이렇게 `bridge` 모드로 실행된 Container 간 통신이 가능함을 확인할 수 있음

이러한 `bridge` 는 여러개의 `bridge` 를 생성할 수 있고, 한 Container 에 여러개의 `bridge` 를 연결할 수도 있음

여기까지 Docker 의 Network 모드와 `bridge` 모드에 대해 알아보았음