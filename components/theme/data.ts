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
    header: "Operate System",
    subTheme: [
        {
            header: "Theory",
            explanation: "OS의 기초적인 이론을 다룹니다.",
            list: ["Process", "Memory", "File System"],
            link: "./os/[1]-Computer-System-Overview",
        },
        {
            header: "System Programming",
            explanation: "Theory 시간에 배웠던 OS의 이론이 어떻게 구현돼어 있는지 알아봅니다.",
            list: ["Process", "Memory", "File System"],
            link: "/",
        },
        {
            header: "Create My Personal OS",
            explanation: "USB에 넣어서 부팅할 수 있는 멀티 태스킹 OS를 만들어 봅니다.",
            list: ["Process", "Memory", "File System"],
            link: "/",
        }
    ],
}

export const database: ThemeType = {
    header: "Database",
    subTheme: [
        {
            header: "RDBMS Basic",
            explanation: "가장 널리 사용돼는 데이터베이스 패러다임인 RDBMS에 대한 기초적인 내용을 다룹니다. 사용하게될 Database는 PostgreSQL입니다. 추가적으로 SQL에 대한 내용도 다룹니다.",
            list: ["SELECT", "INSERT", "UPDATE", "DELETE"],
            link: "/",
        },
    ],
}

export const network: ThemeType = {
    header: "Network",
    subTheme: [
        {
            header: "Theory",
            explanation: "네트워크의 기초적인 이론을 다룹니다.",
            list: ["OSI 7 Layer", "TCP/IP", "Socket Programming"],
            link: "/",
        },
        {
            header: "Nginx",
            explanation: "Nginx의 기초적인 사용법을 다룹니다.",
            list: ["Reverse Proxy", "Load Balancer", "Web Server"],
            link: "/",
        },
        {
            header: "Create My Personal Web Server",
            explanation: "Nginx를 이용해서 웹 서버를 만들어 봅니다.",
            list: ["Reverse Proxy", "Load Balancer", "Web Server"],
            link: "/",
        }
    ],
}

export const linux: ThemeType = {
    header: "Linux",
    subTheme: [
        {
            header: "Portable Linux",
            explanation: "USB에 넣어서 부팅할 수 있는 리눅스를 만들어 봅시다.",
            list: ["File System", "Process", "User Management"],
            link: "/",
        },
        {
            header: "How to Use Linux",
            explanation: "리눅스의 기초적인 사용법을 다룹니다.",
            list: ["File System", "Process", "User Management"],
            link: "/",
        },
        {
            header: "Docker",
            explanation: "Docker의 기초적인 사용법을 다룹니다.",
            list: ["Container", "Image", "Volume"],
            link: "/",
        }
    ],
}

export const git: ThemeType = {
    header: "Git/Github",
    subTheme: [
        {
            header: "Basic",
            explanation: "Git의 기초적인 사용법을 다룹니다.",
            list: ["Commit", "Branch", "Merge"],
            link: "/",
        },
        {
            header: "Github",
            explanation: "Github의 기초적인 사용법을 다룹니다.",
            list: ["Pull Request", "Issue", "Github Page"],
            link: "/",
        },
        {
            header: "Git Action",
            explanation: "Github Action을 이용해서 CI/CD를 구축해 봅니다.",
            list: ["CI", "CD"],
            link: "/",
        }
    ],
}

export const ai: ThemeType = {
    header: "AI",
    subTheme: [
        {
            header: "Reinforcement Learning",
            explanation: "강화학습의 기초적인 이론을 다룹니다.",
            list: ["Machine Learning", "Deep Learning", "Reinforcement Learning"],
            link: "/",
        },
        {
            header: "Pytorch",
            explanation: "Python을 이용해서 AI를 만들어 봅니다.",
            list: ["Machine Learning", "Deep Learning", "Reinforcement Learning"],
            link: "/",
        },
        {
            header: "Deep Learning",
            explanation: "Python을 이용해서 AI를 만들어 봅니다.",
            list: ["Machine Learning", "Deep Learning", "Reinforcement Learning"],
            link: "/",
        }
    ],
}

export const algorithm: ThemeType = {
    header: "Algorithm",
    subTheme: [
        {
            header: "Basic",
            explanation: "알고리즘의 기초적인 이론을 다룹니다.",
            list: ["Sort", "Search", "Dynamic Programming"],
            link: "/",
        },
        {
            header: "Problem solving",
            explanation: "알고리즘 문제를 풀어봅니다.",
            list: ["Sort", "Search", "Dynamic Programming"],
            link: "/",
        }
    ],
}

export const computerStructure: ThemeType = {
    header: "Computer Structure",
    subTheme: [
        {
            header: "Basic",
            explanation: "컴퓨터의 기초적인 구조를 다룹니다.",
            list: ["CPU", "Memory", "I/O"],
            link: "/",
        },
        {
            header: "Create Computer In Minecraft",
            explanation: "마인크래프트를 이용해서 컴퓨터를 만들어 봅니다.",
            list: ["CPU", "Memory", "I/O"],
            link: "/",
        }
    ],
}