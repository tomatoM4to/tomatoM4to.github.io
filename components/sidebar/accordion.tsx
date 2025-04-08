'use client';

import { useState } from "react";
import { Post } from "@/components/utils";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { ColorConfig, ResponsiveConfig } from "../tailwindConfig";

function Dot() {
    return (
        <div
            className={`
                ${ResponsiveConfig.accordionDot}
                ${ColorConfig.accordionDot}
                rounded-full
                mr-3
            `}
        />
    )
}

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
                ${ColorConfig.hover}
                ${ResponsiveConfig.accordion}
                `}
            onClick={() => setIsOpen && setIsOpen(false)}
        >
            <Dot />
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
                className={`
                    flex
                    justify-between
                    items-center
                    text-left
                    px-1 py-2
                    ${ColorConfig.hover}
                    focus:outline-none
                    rounded-lg`}
            >
                <div className="flex items-center">
                    <Dot />
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
                    href={`./${content.URL}`}
                    className={`
                        p-2
                        border-l-2
                        ${ColorConfig.accordionItem}`
                    }
                    onClick={() => setIsOpen && setIsOpen(false)}
                >
                    {content.title}
                </Link>
            ))}
        </div>
    );
}
