'use client';

import { useEffect, useState } from "react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { ColorConfig } from "../tailwindConfig";

export function DarkModeButton() {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        // 서버 환경에서는 무조건 false
        // if (typeof window === 'undefined') return false;

        let theme = window.localStorage.getItem('theme');
        if (theme === 'dark') return true;
        if (theme === 'light') return false;

        // 로컬 스토리지에 저장된 값이 없으면 시스템 설정 사용
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            window.localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            window.localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
                p-2
                rounded-full
                ${ColorConfig.hover}
                transition-colors
                duration-300`}
        >
            {
                darkMode
                    ? <BsFillSunFill className="text-2xl cursor-pointer" />
                    : <BsFillMoonStarsFill className="text-2xl cursor-pointer" />
            }
        </button>
    )
}
