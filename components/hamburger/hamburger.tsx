'use client';

import { useState } from "react"
import { RightList } from "./rightList";
import { ColorConfig, ResponsiveConfig, ZIndexConfig } from "@/components/tailwindConfig";
import { Background } from "./background";
import { PostWrapper } from "@/components/utils";


function HamburgerBtn({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const tailwind = `w-6 h-0.5 ${ColorConfig.accordionDot} rounded transform transition-transform duration-300 ease-in-out`;
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
            flex
            flex-col
            gap-1
            justify-center
            items-center
            rounded-lg
            fixed
            right-2
            top-2
            active:outline-none
            p-2
            transition-all
            ${ColorConfig.hover}
            ${ResponsiveConfig.hamburgerBtn}
            ${ZIndexConfig.hamburgerBtn}
            `}
        >
            <span
                className={`${tailwind} ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
                className={`w-6 h-0.5 ${ColorConfig.accordionDot} rounded transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
                className={`${tailwind} ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
        </button>
    );
}


export function Hamburger({
    res,
}: {
    res?: PostWrapper[],
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <aside className={`${ResponsiveConfig.hamburger}`}>
            <HamburgerBtn isOpen={isOpen} setIsOpen={setIsOpen} />
            <RightList isOpen={isOpen} setIsOpen={setIsOpen} res={res} />
            <Background isOpen={isOpen} setIsOpen={setIsOpen} />
        </ aside>
    )
}
