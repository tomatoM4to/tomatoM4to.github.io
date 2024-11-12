import { MiniTitle } from "@/components/miniTitle";
import Link from 'next/link';
import { sideList } from "@/components/responsiveConfig";
import { Post } from "../utils";


export function SideList({
    res,
    params
}: {
    res: Post[],
    params: { subject: string }
}) {
    return (
        <div className={`${sideList} flex-col mt-52 p-7 pb-60 fixed h-screen`}>
            <MiniTitle title="포스팅" />
            <div className="h-full flex flex-col overflow-y-scroll overscroll-contain">
                {
                    res.map((post: Post) => {
                        if (post.isOutLine) {
                            return (
                                <Link key={post.order} href={`/${params.subject}/${post.originalName}`} className="ml-3">
                                    {post.order}. {post.title}
                                </Link>
                            )
                        }
                        return (
                            <Link key={post.order} href={`/${params.subject}/${post.originalName}`}>
                                {post.order}. {post.title}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}