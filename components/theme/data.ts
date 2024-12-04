export interface ThemeType {
    header: string;
    subTheme: SubThemeType[];
}

export interface SubThemeType {
    header: string;
    explanation: string;
    list: string[];
    link: string;
}

export const operatingSystem: ThemeType = {
    header: "Operating System",
    subTheme: [
        {
            header: "Theory",
            explanation:
                "운영체제의 기본 개념과 원리에 대해 심도 있게 학습합니다. 프로세스 관리, 메모리 관리, 파일 시스템 등 운영체제의 핵심 주제를 다루며, 이러한 개념들이 실제 시스템에서 어떻게 적용되는지 이해합니다.",
            list: [
                "Computer System Overview",
                "OS Overview",
                "Process Management",
                "Process Scheduling",
                "Process Synchronization",
                "Deadlock",
                "Thread Management",
                "Memory Management",
                "Memory Overview",
                "Memory Allocation",
                "Virtual Memory",
                "Page Replacement",
                "Disk System",
                "File System",
                "Directory Structure",
            ],
            link: "./os/[1]-Computer-System-Overview",
        },
        {
            header: "System Programming",
            explanation:
                "운영체제 이론에서 배운 개념들이 실제로 어떻게 구현되는지 시스템 프로그래밍을 통해 알아봅니다. 시스템 콜, 프로세스 제어, 메모리 관리 등 다양한 주제를 실습하며, OS 내부의 동작 방식을 깊이 있게 탐구합니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Create My Personal OS",
            explanation:
                "USB에 담아 부팅 가능한 나만의 멀티태스킹 운영체제를 직접 개발해봅니다. 부트로더 작성부터 커널 구현까지, OS의 핵심 구성 요소들을 만들어가며 운영체제가 어떻게 동작하는지 체험합니다.",
            list: [""],
            link: "/",
        },
    ],
};

export const database: ThemeType = {
    header: "Database",
    subTheme: [
        {
            header: "RDBMS Basic",
            explanation:
                "가장 널리 사용되는 데이터베이스 패러다임인 관계형 데이터베이스의 기초를 다룹니다. PostgreSQL과 SQL을 활용하여 데이터베이스의 설계, 생성, 관리, 질의 등 전반적인 데이터 관리 방법을 배웁니다.",
            list: [
                "Introduction",
                "Relational Data Model",
                "Relational Algebra",
                "SQL Concept",
                "Create Table",
                "Integrity Constraint",
                "Query",
                "View",
                "Index",
                "Database Programming",
                "Web Integration",
                "Normalization",
                "Transaction Management",
            ],
            link: "./database/[1]-Introduction",
        },
    ],
};

export const network: ThemeType = {
    header: "Network",
    subTheme: [
        {
            header: "Theory",
            explanation:
                "네트워크의 기본적인 이론과 다양한 프로토콜에 대해 학습합니다. OSI 7계층 모델과 TCP/IP 구조를 중심으로 네트워크 통신의 원리를 이해하고, 주요 프로토콜의 동작 방식을 익힙니다.",
            list: [
                "Introduction",
                "Networking Terminology",
                "TCP",
                "UDP",
                "IP",
                "Control Plane",
            ],
            link: "./network/[1]-Introduction",
        },
        {
            header: "Socket Programming",
            explanation:
                "소켓 프로그래밍을 통해 네트워크 통신을 구현하는 방법을 학습합니다. TCP와 UDP 소켓을 생성하고 통신하는 방법을 익히며, 클라이언트-서버 모델을 구현하고 네트워크 프로그램을 개발합니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Create My Personal Web Server",
            explanation:
                "Nginx를 활용하여 나만의 웹 서버를 직접 구축하고 운영해봅니다. 도메인 설정, 보안 강화, 성능 최적화 등 실무에서 사용하는 다양한 서버 설정과 관리 방법을 익힙니다.",
            list: [""],
            link: "/",
        },
    ],
};

export const linux: ThemeType = {
    header: "Linux",
    subTheme: [
        {
            header: "Portable Linux",
            explanation:
                "USB에 담아 어디서든 부팅 가능한 포터블 리눅스 시스템을 직접 만들어봅니다. 파일 시스템 설정, 사용자 관리, 네트워크 구성 등 핵심 기능을 설정하여 나만의 휴대용 리눅스 환경을 구축합니다.",
            list: [""],
            link: "/",
        },
        {
            header: "How to Use Linux",
            explanation:
                "리눅스의 기본 사용법과 주요 명령어들을 익혀봅니다. 터미널에서 파일 및 디렉토리 관리, 프로세스 제어, 사용자 및 권한 관리, 패키지 설치와 업데이트 등 리눅스 시스템 운영에 필요한 기본 지식을 습득합니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Docker",
            explanation:
                "컨테이너 기반 가상화 플랫폼인 Docker의 기본 개념과 사용법을 학습합니다. 컨테이너 생성 및 관리, 도커 이미지 빌드, 볼륨과 네트워크 설정 등 Docker를 활용한 애플리케이션 배포와 운영 방법을 실습합니다.",
            list: [""],
            link: "/",
        },
    ],
};

export const git: ThemeType = {
    header: "Git/Github",
    subTheme: [
        {
            header: "Basic",
            explanation:
                "분산 버전 관리 시스템인 Git의 기본 사용법을 학습합니다. 저장소 생성부터 커밋, 브랜치 관리, 머지, 충돌 해결 등 Git의 핵심 기능을 실습하며 버전 관리의 중요성을 이해합니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Github",
            explanation:
                "GitHub를 활용하여 팀원들과 효과적으로 협업하는 방법을 배웁니다. 리포지토리 관리, 풀 리퀘스트를 통한 코드 리뷰, 이슈 관리, 위키와 프로젝트 보드 사용, GitHub Pages를 이용한 웹 호스팅 등을 실습합니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Git Action",
            explanation:
                "GitHub Actions를 활용하여 지속적 통합 및 배포(CI/CD) 파이프라인을 구축합니다. 워크플로우 설정, 자동화된 테스트와 빌드, 배포 프로세스를 구성하여 소프트웨어 개발 프로세스를 효율화합니다.",
            list: [""],
            link: "/",
        },
    ],
};

export const ai: ThemeType = {
    header: "AI",
    subTheme: [
        {
            header: "Reinforcement Learning",
            explanation:
                "강화학습의 기초 이론과 다양한 알고리즘을 학습합니다. 머신러닝과 딥러닝의 기본 개념을 바탕으로, 마르코프 결정 프로세스(MDP), 벨만 최적 방정식, Q-러닝 등 강화학습의 핵심 내용을 실습을 통해 이해합니다.",
            list: [
                "Introduction",
                "Basic Math",
                "Markov Decision Process",
                "Bellman Optimality Equation",
                "Dynamic Programming",
                "Monte Carlo Methods",
                "Temporal Difference Learning",
                "Q-Learning",
                "Greedy Action",
                "Discount Factor",
                "Learning Rate",
                "SARSA",
                "n-Step Bootstrapping",
                "Function Approximation",
                "Deep Learning",
                "Neural Network",
                "Loss Function",
                "Activation Function",
                "Gradient Descent",
                "Backpropagation",
                "Q-Network",
                "DQN",
            ],
            link: "./ai/[1]-Introduction",
        },
        {
            header: "Pytorch",
            explanation:
                "Python 기반의 딥러닝 프레임워크인 PyTorch를 사용하여 다양한 인공지능 모델을 구현합니다. 텐서 연산, 자동 미분, 신경망 설계와 학습 방법을 익혀 실제 데이터에 적용해봅니다.",
            list: [
                "Introduction",
                "Installation",
                "Tensor Basics",
                "Tensor Manipulations",
                "Autograd",
                "Data Preparation",
                "Neural Network",
                "Layers",
                "Activation Functions",
                "Model Creation",
                "Parameter Management",
            ],
            link: "./pytorch/[1]-Introduction",
        },
        {
            header: "Deep Learning",
            explanation:
                "딥러닝의 기본 원리와 다양한 신경망 구조를 학습합니다. 합성곱 신경망(CNN), 순환 신경망(RNN), 생성 모델 등 최신 딥러닝 기법을 배우고, 실제 데이터를 활용하여 모델을 설계하고 훈련시켜봅니다.",
            list: [""],
            link: "",
        },
    ],
};

export const algorithm: ThemeType = {
    header: "Algorithm",
    subTheme: [
        {
            header: "Basic",
            explanation:
                "알고리즘의 기본 이론과 다양한 설계 기법을 학습합니다. 시간 복잡도와 공간 복잡도 분석, 정렬 알고리즘, 탐색 알고리즘, 재귀와 분할정복, 동적 프로그래밍 등 핵심 주제를 다룹니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Problem Solving",
            explanation:
                "다양한 알고리즘 문제를 풀어보며 문제 해결 능력을 향상시킵니다. 코딩 테스트와 알고리즘 대회를 대비하여 실전 감각을 익히고, 효율적인 알고리즘 설계와 최적화 기법을 연습합니다.",
            list: [""],
            link: "/",
        },
    ],
};

export const computerStructure: ThemeType = {
    header: "Computer Structure",
    subTheme: [
        {
            header: "Basic",
            explanation:
                "컴퓨터의 기본 구조와 작동 원리에 대해 학습합니다. 중앙 처리 장치(CPU), 메모리, 버스, 입출력 장치 등 하드웨어 구성 요소의 역할과 상호 작용을 이해하고, 명령어 처리 과정과 연산 방식 등을 다룹니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Create Computer In Minecraft",
            explanation:
                "마인크래프트 게임에서 레드스톤 회로를 활용하여 컴퓨터의 논리 회로와 구조를 직접 구현해봅니다. 간단한 연산기부터 메모리 구조까지 만들어보며, 게임을 통해 재미있게 컴퓨터 구조와 디지털 논리 회로를 이해합니다.",
            list: [""],
            link: "/",
        },
    ],
};

export const dev: ThemeType = {
    header: "Web Development",
    subTheme: [
        {
            header: "Nginx",
            explanation:
                "높은 성능과 안정성을 자랑하는 웹 서버인 Nginx의 기본 사용법과 설정 방법을 배웁니다. 리버스 프록시 설정, 로드 밸런싱 구성, SSL 인증서 적용 등 실제 웹 서버 운영에 필요한 다양한 기능을 실습합니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Just Auth",
            explanation:
                "FastAPI를 이용하여 사용자 인증 시스템이 포함된 웹 애플리케이션을 개발해봅니다. Python와 PostgreSQL를 활용하여 회원 가입, 로그인, 세션 관리 등 인증 기능을 구현하고 보안에 대한 이해를 높입니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Just Chat",
            explanation:
                "FastAPI와 Socket.IO를 이용하여 실시간 채팅 애플리케이션을 개발해봅니다. Python와 PostgreSQL를 활용하여 사용자 관리, 채팅 기능, 실시간 메시지 전송 등을 구현합니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Fast API Reverse Engineering",
            explanation:
                "Python의 FastAPI로 개발된 웹 애플리케이션을 분석하고, 그 구조와 기능을 FastAPI로 재구현해봅니다. 이를 통해 웹 프레임워크의 동작 원리를 이해하고, RESTful API 설계에 대한 실무 경험을 쌓습니다.",
            list: [""],
            link: "/",
        },
        {
            header: "Testing",
            explanation:
                "FastAPI 기반의 웹 애플리케이션에 대한 테스트 방법을 학습합니다. Mocha, Chai 등 테스트 도구를 활용하여 단위 테스트와 통합 테스트를 작성하고 실행하며, 코드 품질과 안정성을 향상시키는 방법을 배웁니다.",
            list: [""],
            link: "/",
        },
    ],
};
