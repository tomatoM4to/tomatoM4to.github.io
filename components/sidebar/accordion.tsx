'use client';

import { useState } from "react";
import { Post } from "@/components/utils";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { ResponsiveConfig } from "../tailwindConfig";

export function NonAccordionLink({
    href,
    label,
    setIsOpen
}: {
    href: string,
    label: string,
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Link
            href={href}
            className={`
                flex
                items-center
                px-1 py-2
                rounded-lg
                hover:bg-slate-300
                ${ResponsiveConfig.accordion}
                `}
            onClick={() => setIsOpen && setIsOpen(false)}
        >
            <div
                className={`
                    ${ResponsiveConfig.accordionDot} bg-blue-950 rounded-full mr-3
                `}
            />
            {label}
        </Link>
    )
}


export function Accordion({
    label,
    children
}: {
    label: string,
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className={`flex flex-col ${ResponsiveConfig.accordion}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center text-left px-1 py-2 hover:bg-slate-300 focus:outline-none rounded-lg"
            >
                <div className="flex items-center">
                    <span
                        className={
                            `${ResponsiveConfig.accordionDot} bg-blue-950 rounded-full mr-3`
                        } />
                    {label}
                </div>
                <IoIosArrowForward className={`${isOpen ? "rotate-90" : "rotate-0"}`} />
            </button>
            <div className={`overflow-hidden ${isOpen ? "max-h-screen" : "max-h-0"}`}>
                <div className="p-2">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function AccordionItem({
    contentList,
    setIsOpen
}: {
    contentList: Post[],
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <div className="flex flex-col">
            {contentList.map((content, index) => (
                <Link
                    key={index}
                    href={`./${content.originalName}`}
                    className="p-2 border-l-2 border-gray-300 hover:text-blue-500 hover:border-blue-500"
                    onClick={() => setIsOpen && setIsOpen(false)}
                >
                    {content.title}
                </Link>
            ))}
        </div>
    );
}
