'use client';

import { PostMoreInfo } from "../utils";
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
    res?: PostMoreInfo[],
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
                res && res.map((pmi, index) => {
                    if (pmi.contentList.length === 0) {
                        return (
                            <NonAccordionLink
                                key={index}
                                href={`./${pmi.originalName}`}
                                label={pmi.title}
                                setIsOpen={setIsOpen}
                            />
                        );
                    }
                    return (
                        <Accordion label={pmi.title} key={index}>
                            <AccordionItem
                                contentList={pmi.contentList}
                                setIsOpen={setIsOpen}
                            />
                        </Accordion>
                    );
                })
            }
        </div>
    )
}