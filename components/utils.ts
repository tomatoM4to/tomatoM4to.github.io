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

export interface ThemeInfo {
    enTheme: string,
    enPost: string,
    theme: string
}

export interface ThemeParams {
    theme: string
}

export async function getThemeParams(): Promise<ThemeParams[]> {
    let themeList: string[] = await fs.readdir(path.join(process.cwd(), 'public', 'kr'));
    return themeList.map((theme: string) => {
        return {
            theme: theme
        }
    })
}

export interface PostWrapper {
    title: string,
    originalName: string,
    order: number,
    contentList: Post[]
}

export interface Post {
    isTitle: boolean,
    firstOrder: number,
    secondOrder: number,
    order: string,
    title: string,
    originalName: string,
}

export async function getSortedPostList(theme: string, wrapper: boolean = false): Promise<PostWrapper[] | Post[]> {
    let postList: string[] = await fs.readdir(path.join(process.cwd(), 'public', 'kr', theme));

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
                };
            }
            return {
                isTitle: true,
                firstOrder,
                secondOrder,
                order: `${firstOrder}`,
                title,
                originalName: post.replace(".mdx", ""),
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
    if (!wrapper) return newPostList;

    let postWrapper: PostWrapper[] = [];
    for (let post of newPostList) {
        if (post.isTitle) {
            postWrapper.push({
                title: post.title,
                originalName: post.originalName,
                order: post.firstOrder,
                contentList: []
            })
        } else {
            postWrapper[postWrapper.length - 1].contentList.push(post);
        }
    }

    return postWrapper;
}

export function isPostWrapperArray(res: (Post | PostWrapper)[]): res is PostWrapper[] {
    return res.every((item) => 'contentList' in item && Array.isArray(item.contentList));
}

export interface PostParams {
    theme: string,
    post: string
}

export async function getPostParams(): Promise<PostParams[]> {
    let res: PostParams[] = [];
    let themeList: ThemeParams[] = await getThemeParams();
    for (let s of themeList) {
        let postListPath: string = path.join(process.cwd(), 'public', 'kr', s.theme);
        postListPath = decodeURIComponent(postListPath);
        let postList: string[] = await fs.readdir(postListPath);
        for (let p of postList as string[]) {
            let post: string = p.replace('.mdx', '');
            res.push({
                theme: s.theme,
                post: post
            })
        }
    }
    return res;
}

interface CompileMDXResult {
    content: ReactElement<any>;
}

export async function getPost(theme: string, post: string): Promise<ReactElement<any>> {
    let postPath: string = path.join(process.cwd(), 'public', 'kr', theme, post);
    postPath = decodeURIComponent(postPath);
    let source: string = await fs.readFile(postPath, 'utf8');

    let { content }: CompileMDXResult = await compileMDX({
        source,
        options: {
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [
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
            ...code
        }
    })
    return content;
}
