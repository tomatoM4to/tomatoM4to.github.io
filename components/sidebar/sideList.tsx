import { ColorConfig, ResponsiveConfig } from "@/components/tailwindConfig";
import { Post } from "../utils";
import { Accordion, AccordionItem, NonAccordionLink } from './accordion';

export function SideList({
    res,
}: {
    res: Post[],
}) {
    return (
        <aside
            className={`
                ${ResponsiveConfig.sideList}
                ${ColorConfig.sideList}
                flex-col
                h-screen
                border-r-2
                p-1
                pl-5
                pt-14
                fixed
                overflow-y-auto
                overscroll-contain
                z-auto
                `}
        >
            {
                res.map((pmi, index) => {
                    if (pmi.contentList.length === 0) {
                        return (
                            <NonAccordionLink
                                key={index}
                                href={`./${pmi.URL}`}
                                label={pmi.title}
                            />
                        );
                    }
                    return (
                        <Accordion label={pmi.title} key={index}>
                            <AccordionItem contentList={pmi.contentList} />
                        </Accordion>
                    );
                })
            }
        </aside>
    );
}
