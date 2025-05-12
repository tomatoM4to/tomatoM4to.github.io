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
                "컴퓨터 구조 개요",
                "OS 소개",
                "프로세스 관리",
                "스레드 관리",
                "메모리 소개",
                "메모리 할당",
                "가상 메모리",
                "디스크 시스템",
                "파일 시스템템",
            ],
            link: "./os/[1]-컴퓨터-구조-개요",
        },
    ],
};

export const database: ThemeType = {
    header: "Database",
    subTheme: [
        {
            header: "RDBMS",
            explanation:
                "가장 널리 사용되는 데이터베이스 패러다임인 관계형 데이터베이스의 기초를 다룹니다. PostgreSQL과 SQL을 활용하여 데이터베이스의 설계, 생성, 관리, 질의 등 전반적인 데이터 관리 방법을 배웁니다.",
            list: [
                "소개개",
                "데이터 모델",
                "SQL",
                "DB 프로그래밍",
                "웹 연동",
                "데이터 모델링",
                "정규화",
                "트랜잭션",
                "보안",
            ],
            link: "./database/[1]-소개",
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
                "소개",
                "네트워크 용어 정리",
                "네트워크 장비",
                "Application layer",
                "소켓 프로그래밍",
                "Transport layer",
                "Network layer",
                "Data link layer",
                "모바일 네트워크",
                "네트워크 보안안",
            ],
            link: "./network/[1]-소개",
        },
        {
            header: "Create My Personal Web Server",
            explanation:
                "Nginx를 활용하여 나만의 웹 서버를 직접 구축하고 운영해봅니다. 도메인 설정, 보안 강화, 성능 최적화 등 실무에서 사용하는 다양한 서버 설정과 관리 방법을 익힙니다.",
            list: [""],
            link: "./personal-web-server/[1]-소개",
        },
    ],
};

export const linux: ThemeType = {
    header: "Linux",
    subTheme: [
    ],
};

export const git: ThemeType = {
    header: "Git/Github",
    subTheme: [
    ],
};

export const ai: ThemeType = {
    header: "Machine Learning",
    subTheme: [
        {
            header: "Reinforcement Learning",
            explanation:
                "강화학습의 기초 이론과 다양한 알고리즘을 학습합니다. 머신러닝과 딥러닝의 기본 개념을 바탕으로, 마르코프 결정 프로세스(MDP), 벨만 최적 방정식, Q-러닝 등 강화학습의 핵심 내용을 실습을 통해 이해합니다.",
            list: [
                "Introduction",
                "Q-Learning",
                "Basic math for RL",
                "Markov process",
                "Bellman equation",
                "DP",
                "Monte Carlo",
                "Temporal Difference",
                "n-step Bootstrapping",
                "Function Approximation",
                "Deep learning for RL",
                "Deep Q-Network",
                "Policy Gradient",
            ],
            link: "./ai/[1]-Introduction",
        },
        {
            header: "Pytorch",
            explanation:
                "Python 기반의 딥러닝 프레임워크인 PyTorch를 사용하여 다양한 인공지능 모델을 구현합니다. 텐서 연산, 자동 미분, 신경망 설계와 학습 방법을 익혀 실제 데이터에 적용해봅니다.",
            list: [
                "Introduction",
                "Install",
                "Tensor",
                "Autograd",
                "Data Preparation",
                "Neural Network",
            ],
            link: "./pytorch/[1]-Introduction",
        },
    ],
};

export const algorithm: ThemeType = {
    header: "Algorithm",
    subTheme: [
        {
            header: "C++ for Coding Test",
            explanation:
                "알고리즘 문제에서 자주 사용하는 C++ 컨테이너 라이브러리의 사용법을 빠르고 간단하게 알아봅니다.",
            list: [
                "STL 소개",
                "컨테이너",
                "반복자",
                "알고리즘",
                "함수자"
            ],
            link: "./cpp-stl/[1]-STL-소개",
        },
    ],
};

export const computerStructure: ThemeType = {
    header: "Computer Structure",
    subTheme: [
    ],
};

export const dev: ThemeType = {
    header: "Web Development",
    subTheme: [
    ],
};

export const flutter: ThemeType = {
    header: "Flutter",
    subTheme: [
        {
            header: "Dart",
            explanation:
                "Flutter 를 다루기 전 Flutter 를 구성하는 언어인 Dart 에 익숙해져 봅시다.",
            list: [
                "Dart 소개",
                "Dart Tour",
                "기본 문법",
                "데이터 타입",
            ],
            link: "./dart/[1]-Dart-소개",
        },
        {
            header: "Flutter",
            explanation:
                "Flutter 를 다루기 위한 기초적인 문법과 Flutter 의 기본적인 구조를 익혀봅시다.",
            list: [
                "소개",
            ],
            link: "./flutter/[1]-소개-소개",
        }
    ],
}