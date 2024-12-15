'use client';

import { useEffect, useState } from "react";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { ColorConfig } from "../tailwindConfig";

export function DarkModeButton() {
    const [darkMode, setDarkMode] = useState<boolean | null>(null);

    useEffect(() => {
        // 클라이언트 환경에서 로컬 스토리지 값 및 시스템 설정 확인
        const theme = window.localStorage.getItem('theme');
        if (theme === 'dark') {
            setDarkMode(true);
        } else if (theme === 'light') {
            setDarkMode(false);
        } else {
            // 로컬 스토리지 값이 없으면 시스템 설정 사용
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    useEffect(() => {
        // 초기화되지 않은 상태는 건너뜀
        if (darkMode === null) return;

        if (darkMode) {
            document.documentElement.classList.add('dark');
            window.localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            window.localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    if (darkMode === null) {
        // 상태 초기화 중에는 아무 UI도 렌더링 하지 않음
        return null;
    }

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
    );
}
