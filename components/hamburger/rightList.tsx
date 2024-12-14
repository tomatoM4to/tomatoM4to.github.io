'use client';

import { PostWrapper } from "../utils";
import { UtilityButtons } from "@/components/hamburger/utility";
import { Accordion, AccordionItem, NonAccordionLink } from '@/components/sidebar/accordion';
import { ColorConfig, ZIndexConfig } from "@/components/tailwindConfig";

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
                ${ColorConfig.root}
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
                            <NonAccordionLink
                                key={index}
                                href={`./${postWrapper.originalName}`}
                                label={postWrapper.title}
                                setIsOpen={setIsOpen}
                            />
                        );
                    }
                    return (
                        <Accordion label={postWrapper.title} key={index}>
                            <AccordionItem
                                contentList={postWrapper.contentList}
                                setIsOpen={setIsOpen}
                            />
                        </Accordion>
                    );
                })
            }
        </div>
    )
}