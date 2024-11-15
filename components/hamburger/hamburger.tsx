'use client';

import { useState } from "react"
import { MenuList } from "./menuList";
import { hamburger } from "@/components/responsiveConfig";
import { Background } from "./background";
import { Post } from "@/components/utils";


function Template({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const tailwind = `w-6 h-0.5 bg-black rounded transform transition-transform duration-300 ease-in-out`;
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="
            flex
            flex-col
            gap-1
            justify-center
            items-center
            w-10
            h-10
            rounded-lg
            fixed
            right-2
            top-2
            active:outline-none
            p-2
            hover:bg-gray-200
            transition-all"
            style={{ zIndex: 15 }}
        >
            <span
                className={`${tailwind} ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
                className={`w-6 h-0.5 bg-black rounded transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
                className={`${tailwind} ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
        </button>
    );
}

/*
Background -> z-index: 5
MenuList -> z-index: 10
Template -> z-index: 15
*/
export function Hamburger({
    res,
    params
}: {
    res: Post[],
    params: { subject: string }
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`${hamburger}`}>
            <Template isOpen={isOpen} setIsOpen={setIsOpen} />
            <MenuList isOpen={isOpen} setIsOpen={setIsOpen} res={res} params={params} />
            <Background isOpen={isOpen} setIsOpen={setIsOpen} />
        </ div>
    )
}
