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
    params: { theme: string },
    className?: string,
    onClick?: () => void
}) {
    return (
        <Link
            href={`/${params.theme}/${post.originalName}`}
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
    params: { theme: string }
}) {
    return (
        <aside
            className={`${sideList} flex-col h-screen border-r-2 border-gray-300 mt-14 p-1 pl-5 fixed overflow-y-auto overscroll-contain`}
        >
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
        </aside>
    )
}