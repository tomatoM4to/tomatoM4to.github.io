import { ColorConfig, ResponsiveConfig } from "@/components/tailwindConfig";
import { PostWrapper } from "../utils";
import { Accordion, AccordionItem, NonAccordionLink } from './accordion';

export function SideList({
    res,
}: {
    res: PostWrapper[],
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
                res.map((postWrapper, index) => {
                    if (postWrapper.contentList.length === 0) {
                        return (
                            <NonAccordionLink
                                key={index}
                                href={`./${postWrapper.originalName}`}
                                label={postWrapper.title}
                            />
                        );
                    }
                    return (
                        <Accordion label={postWrapper.title} key={index}>
                            <AccordionItem contentList={postWrapper.contentList} />
                        </Accordion>
                    );
                })
            }
        </aside>
    );
}
