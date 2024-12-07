'use client';

import { useState } from "react";
import { Post, PostWrapper } from "@/components/utils";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

export function AccordionWrapper({
    postWrapper,
    children
}: {
    postWrapper: PostWrapper,
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center text-left px-1 py-2 hover:bg-slate-300 focus:outline-none rounded-lg"
            >
                <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-950 rounded-full mr-3" />
                    {postWrapper.title}
                </div>
                <IoIosArrowForward className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen" : "max-h-0"
                    }`}
            >
                <div className="p-2">{children}</div>
            </div>
        </div>
    );
}

export function Accordion({
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
