'use client';

import { useEffect } from "react"
import { ColorConfig, ZIndexConfig } from "@/components/tailwindConfig";

export function Background({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    return (
        <div
            className={`
        w-screen
        h-screen
        fixed
        left-0
        top-0
        transition-opacity
        duration-300
        ${ColorConfig.hamburgerBackground}
        ${isOpen ? 'opacity-70' : 'opacity-0 pointer-events-none'}
        ${ZIndexConfig.hamburgerBackground}`}
            onClick={() => setIsOpen(false)}
        >
        </div>
    )
}