import fs from 'fs/promises';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import {
    heads,
    lists,
    highlights,
    code,
    table
} from '@/components/mdx';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ReactElement } from 'react';
import rehypeHighlight from 'rehype-highlight';
import rehypeCodeTitles from 'rehype-code-titles';

export interface ThemeInfo {
    enTheme: string,
    enPost: string,
    theme: string
}

export interface ThemeParams {
    theme: string
}

export interface Post {
    isTitle: boolean,
    firstOrder: number,
    secondOrder: number,
    order: string,
    title: string,
    originalName: string,
    index: number
}

export interface PostMoreInfo {
    title: string,
    originalName: string,
    order: number,
    contentList: Post[]
}


export interface PostParams {
    theme: string,
    post: string
}

interface CompileMDXResult {
    content: ReactElement<any>;
}

export interface PostContent {
    content: ReactElement<any>;
    prePost: {
        originalName: string,
        title: string
    } | null,
    nextPost: {
        originalName: string,
        title: string
    } | null
}


function encodePost(post: string): string {
    if (!post.includes(']')) return post;

    let nPost: string[] = post.split(']');
    if (nPost.length === 1) throw new Error('encodePost: Invalid post');
    return nPost[0] + ']' + encodeURIComponent(nPost[1]);
}

export async function getThemeParams(): Promise<ThemeParams[]> {
    let themeList: string[] = await fs.readdir(
        path.join(process.cwd(), 'public', 'kr')
    );
    return themeList.map((theme: string) => {
        return {
            theme: encodeURIComponent(theme)
        }
    })
}

export async function getPostParams(): Promise<PostParams[]> {
    let res: PostParams[] = [];
    let themeList: ThemeParams[] = await getThemeParams();
    for (let s of themeList) {
        let postListPath: string = path.join(
            process.cwd(),
            'public',
            'kr',
            decodeURIComponent(s.theme)
        );
        let postList: string[] = await fs.readdir(postListPath);
        for (let p of postList as string[]) {
            let post: string = p.replace('.mdx', '');
            res.push({
                theme: encodeURIComponent(s.theme),
                // TODO: dev 모드에선 정상작동 하지 않음, encodePost(post)로 수정해야 함
                // post: encodePost(post)
                post: post
            })
        }
    }
    return res;
}

export async function getSortedPostList(
    theme: string,
): Promise<Post[]> {
    let postList: string[] = await fs.readdir(
        path.join(process.cwd(), 'public', 'kr', theme)
    );
    let index: number = 1;

    let newPostList: Post[] = postList
        .filter((post: string) => post !== 'img')
        .map((post: string) => {
            let cleanName: string = post.replace(/[\[\]]/g, "").replace(".mdx", "");
            let parts: string[] = cleanName.split("-");

            let firstOrder: number = parseInt(parts[0]);
            let secondOrder: number = parseInt(parts[1]);
            let title: string = isNaN(secondOrder) ? parts.slice(1).join(" ") : parts.slice(2).join(" ");
            secondOrder = isNaN(secondOrder) ? -1 : secondOrder;

            if (secondOrder !== -1) {
                return {
                    isTitle: false,
                    firstOrder,
                    secondOrder,
                    order: `${firstOrder}-${secondOrder}`,
                    title,
                    originalName: post.replace(".mdx", ""),
                    index: -1
                };
            }
            return {
                isTitle: true,
                firstOrder,
                secondOrder,
                order: `${firstOrder}`,
                title,
                originalName: post.replace(".mdx", ""),
                index: -1
            };
        })
        .sort((a: Post, b: Post) => {
            // firstOrder
            if (a.firstOrder !== b.firstOrder) {
                return a.firstOrder - b.firstOrder;
            }
            // secondOrder
            return a.secondOrder - b.secondOrder;
        })
        .map((post: Post, _: number, arr: Post[]) => {
            if (
                post.isTitle &&
                index + 1 < arr.length &&
                arr[index + 1].order.includes(`${post.order}-`)
            ) return post;
            post.index = index++;
            return post;
        })

    return newPostList;
}

export async function getPostListMoreInfo(
    theme: string
): Promise<PostMoreInfo[]> {
    let postList: Post[] = await getSortedPostList(theme);
    let postListMoreInfo: PostMoreInfo[] = []
    for (let post of postList) {
        if (post.isTitle) {
            postListMoreInfo.push({
                title: post.title,
                originalName: post.originalName,
                order: post.firstOrder,
                contentList: []
            });
        }
        else {
            postListMoreInfo[postListMoreInfo.length - 1].contentList.push(post);
        }
    }
    return postListMoreInfo;
}



export async function getPost(theme: string, post: string): Promise<PostContent> {
    let postList: Post[] = await getSortedPostList(theme);

    let currentIndex: Post | undefined = postList.find((p: Post) => `${p.originalName}.mdx` === decodeURIComponent(post));
    if (currentIndex === undefined) throw new Error('getPost: Post not found');

    let prePost: Post | undefined = postList.find((p: Post) => p.index === currentIndex.index - 1);
    let nextPost: Post | undefined = postList.find((p: Post) => p.index === currentIndex.index + 1);

    let postPath: string = path.join(process.cwd(), 'public', 'kr', theme, post);
    postPath = decodeURIComponent(postPath);
    let source: string = await fs.readFile(postPath, 'utf8');

    let { content }: CompileMDXResult = await compileMDX({
        source,
        options: {
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [
                    rehypeCodeTitles,
                    [rehypeKatex, { output: 'mathml' }],
                    rehypeHighlight
                ]
            }
        },
        components: {
            ...heads,
            ...lists,
            ...table,
            ...highlights,
            // ...code
        }
    })
    return {
        content,
        prePost: prePost === undefined ? null : {
            originalName: prePost.originalName,
            title: prePost.title
        },
        nextPost: nextPost === undefined ? null : {
            originalName: nextPost.originalName,
            title: nextPost.title
        }
    };
}
