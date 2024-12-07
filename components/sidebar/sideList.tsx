import Link from 'next/link';
import { sideList } from "@/components/responsiveConfig";
import { Post, PostWrapper } from "../utils";
import { Accordion, AccordionWrapper } from './accordion';

export function SideList({
    res,
    params
}: {
    res: PostWrapper[],
    params: { theme: string }
}) {
    return (
        <aside
            className={`${sideList} flex-col h-screen border-r-2 border-gray-300 mt-14 p-1 pl-5 fixed overflow-y-auto overscroll-contain`}
        >
            {
                res.map((postWrapper, index) => {
                    if (postWrapper.contentList.length === 0) {
                        return (
                            <Link key={index} href={`./${postWrapper.originalName}`} className='flex items-center px-1 py-2 rounded-lg hover:bg-slate-300'>
                                <div className='w-2 h-2 bg-blue-950 rounded-full mr-3' /> {postWrapper.title}
                            </Link>
                        );
                    }
                    return (
                        <AccordionWrapper postWrapper={postWrapper} key={index}>
                            <Accordion contentList={postWrapper.contentList} />
                        </AccordionWrapper>
                    );
                })
            }
        </aside>
    );
}
