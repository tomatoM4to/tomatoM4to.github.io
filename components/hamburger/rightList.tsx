'use client';

import { PostWrapper } from "../utils";
import { UtilityButtons } from "@/components/hamburger/utility";
import Link from "next/link";
import { Accordion, AccordionWrapper } from '@/components/sidebar/accordion';
import { ZIndexConfig } from "@/components/tailwindConfig";

export function RightList({
    isOpen,
    setIsOpen,
    res,
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    res: PostWrapper[],
}) {
    return (
        <div
            className={`
                bg-slate-50
                fixed
                top-0
                right-0
                flex
                flex-col
                px-5
                h-full
                w-7/12
                shadow-lg
                transform
                transition-transform
                duration-300
                ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                overflow-y-auto
                ${ZIndexConfig.rightList}`}
        >
            <UtilityButtons />

            {
                res.map((postWrapper, index) => {
                    if (postWrapper.contentList.length === 0) {
                        return (
                            <Link
                                key={index}
                                href={`./${postWrapper.originalName}`}
                                className='flex items-center px-1 py-2 rounded-lg hover:bg-slate-300'
                                onClick={() => setIsOpen(false)}>
                                <div className='w-2 h-2 bg-blue-950 rounded-full mr-3' /> {postWrapper.title}
                            </Link>
                        );
                    }
                    return (
                        <AccordionWrapper postWrapper={postWrapper} key={index}>
                            <Accordion
                                contentList={postWrapper.contentList}
                                setIsOpen={setIsOpen}
                            />
                        </AccordionWrapper>
                    );
                })
            }
        </div>
    )
}