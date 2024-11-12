import { MiniTitle } from "@/components/miniTitle";
import Link from 'next/link';
import { sideList } from "@/components/responsiveConfig";
import { Post } from "../utils";

export function ListLink({
    post,
    params,
    className,
    onClick
}: {
    post: Post,
    params: { subject: string },
    className?: string,
    onClick?: () => void
}) {
    return (
        <Link
            href={`/${params.subject}/${post.originalName}`}
            className={`${className} px-2 py-1 mb-1 hover:bg-gray-300 transition-colors rounded-lg`}
            onClick={onClick}>
            {post.order}. {post.title}
        </Link>
    )
}


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
                                <ListLink key={post.order} post={post} params={params} className="pl-4" />
                            )
                        }
                        return (
                            <ListLink key={post.order} post={post} params={params} />
                        )
                    })
                }
            </div>
        </div>
    )
}