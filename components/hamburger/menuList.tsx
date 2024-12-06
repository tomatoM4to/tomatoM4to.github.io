'use client';

import { Post } from "../utils";
import { ListLink } from "../sidebar/sideList";
import { UtilityButtons } from "@/components/hamburger/utility";

function PostList({
    res,
    params,
    setIsOpen
}: {
    res: Post[],
    params: { theme: string },
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <div className="pb-5 flex flex-col overflow-y-auto overscroll-contain">
            {
                res.map((post, idx) => {
                    if (post.isOutLine) {
                        return (
                            <ListLink key={post.order} post={post} params={params} className="pl-4" onClick={() => setIsOpen(false)} />
                        )
                    }
                    return (
                        <ListLink key={post.order} post={post} params={params} onClick={() => setIsOpen(false)} />
                    )
                })
            }
        </div>
    )
}

export function MenuList({
    isOpen,
    setIsOpen,
    res,
    params
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    res: Post[],
    params: { theme: string }
}) {
    return (
        <div
            className={`
                bg-slate-100
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
                `}
            style={{ zIndex: 10 }}
        >
            <UtilityButtons />

            <PostList res={res} params={params} setIsOpen={setIsOpen} />
        </div>
    )
}