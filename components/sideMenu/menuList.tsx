'use client';

import { MiniTitle } from "@/components/miniTitle";
import Link from 'next/link';
import path from 'path';
import { Button } from "@/components/button";
import { VscCode } from "react-icons/vsc";
import { VscSourceControl } from "react-icons/vsc";
import { VscSparkle } from "react-icons/vsc";
import { VscTerminalLinux } from "react-icons/vsc";
import { VscGithubInverted } from "react-icons/vsc";
import { Post } from "../utils";

function PostList({
    res,
    params,
    setIsOpen
}: {
    res: Post[],
    params: { subject: string },
    setIsOpen: Function
}) {
    return (
        <div className="pb-5 flex flex-col overflow-y-auto overscroll-contain">
            {
                res.map((post, idx) => {
                    if (post.isOutLine) {
                        return (
                            <Link key={post.order} href={`/${params.subject}/${post.originalName}`} onClick={() => setIsOpen(false)}>
                                {post.order}. {post.title}
                            </Link>
                        )
                    }
                    return (
                        <Link key={post.order} href={`/${params.subject}/${post.originalName}`} className="ml-3" onClick={() => setIsOpen(false)}>
                            {post.order}. {post.title}
                        </Link>
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
    setIsOpen: Function,
    res?: Post[],
    params?: { subject: string }
}) {
    return (
        <div
            className={`
                fixed
                top-0
                right-0
                flex
                flex-col
                px-5
                h-full
                w-7/12
                bg-white
                shadow-lg
                transform
                transition-transform
                duration-300
                ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            style={{ zIndex: 10 }}
        >
            <MiniTitle title="메인메뉴" className="mt-12" />
            <div className="flex flex-col border-b-2 border-gray-300">
                <Button href="/" icon={<VscSparkle />} title="소개" count={-1} />
                <Button href="/" icon={<VscSourceControl />} title="컴퓨터 과학" count={0} />
                <Button href="/" icon={<VscCode />} title="데브" count={0} />
                <Button href="/" icon={<VscTerminalLinux />} title="리눅스/도커" count={0} />
                <Button href="/" icon={<VscGithubInverted />} title="깃헙" count={0} />
            </div>

            {
                res && params && (
                    <MiniTitle title="목차" className="mt-2" />
                )
            }

            {
                res && params && (
                    <PostList res={res} params={params} setIsOpen={setIsOpen} />
                )
            }
        </div>
    )
}