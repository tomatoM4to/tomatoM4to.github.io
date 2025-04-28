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
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrettyCode from "rehype-pretty-code";


export interface ThemeInfo {
    enTheme: string,
    enPost: string,
    theme: string
}

export interface ThemeParams {
    theme: string
}

export interface Post {
    includeHyphen: boolean,
    firstOrder: number,
    secondOrder: number,
    URL: string,
    title: string
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
    prePost: Post | undefined,
    nextPost: Post | undefined
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

    let newPostList: Post[] = postList
        .filter((post: string) => post !== 'img')
        .map((post: string) => {
            let cleanName: string = post
            .replace(/[\[\]]/g, "")
            .replace(".mdx", "");
            let parts: string[] = cleanName.split("-");

            let firstOrder: number = parseInt(parts[0]);
            let secondOrder: number = parseInt(parts[1]);
            secondOrder = isNaN(secondOrder) ? -1 : secondOrder;

            let title: string = secondOrder === -1 ?
                parts.slice(1).join(" ") : parts.slice(2).join(" ");


            if (secondOrder !== -1) {
                return {
                    includeHyphen: true,
                    firstOrder,
                    secondOrder,
                    URL: post.replace(".mdx", ""),
                    title,
                    contentList: [],
                };
            }
            return {
                includeHyphen: false,
                firstOrder,
                secondOrder,
                URL: post.replace(".mdx", ""),
                title,
                contentList: [],
            };
        })
        .sort((a: Post, b: Post) => {
            // firstOrder
            if (a.firstOrder !== b.firstOrder) {
                return a.firstOrder - b.firstOrder;
            }
            // secondOrder
            return a.secondOrder - b.secondOrder;
        });

        let result: Post[] = [];
        newPostList.forEach((post: Post) => {
            if (!post.includeHyphen) {
                result.push(post);
            }
            else {
                let lastPost: Post | undefined = result.at(-1);
                if (lastPost) {
                    lastPost.contentList.push(post);
                }
                else {
                    throw new Error(
                        "No parent post found for a hyphenated post."
                    );
                }
            }
        });

        return result;
}


export async function getPost(theme: string, post: string): Promise<PostContent> {
    let postList: Post[] = await getSortedPostList(theme);

    let currentPost: Post | undefined = undefined;
    let prePost: Post | undefined = undefined;
    let nextPost: Post | undefined = undefined;

    postList.forEach((p: Post, i: number, arr: Post[]) => {
        if (p.URL === decodeURIComponent(post)) {
            currentPost = p;

            if (i - 1 >= 0) {
                if (arr[i - 1].contentList.length > 0) {
                    prePost = arr[i - 1].contentList.at(-1);
                }
                else {
                    prePost = arr[i - 1];
                }
            }

            if (i + 1 < arr.length) {
                if (arr[i + 1].contentList.length > 0) {
                    nextPost = arr[i + 1].contentList[0];
                }
                else {
                    nextPost = arr[i + 1];
                }
            }
        }

        p.contentList.forEach((c: Post, j: number, arr_: Post[]) => {
            if (c.URL === decodeURIComponent(post)) {
                currentPost = c;

                if (j - 1 >= 0) {
                    prePost = arr_[j - 1];
                }
                else if (i - 1 >= 0) {
                    if (arr[i - 1].contentList.length > 0) {
                        prePost = arr[i - 1].contentList.at(-1);
                    }
                    else {
                        prePost = arr[i - 1];
                    }
                }

                if (j + 1 < arr_.length) {
                    nextPost = arr_[j + 1];
                }
                else if (i + 1 < arr.length) {
                    if (arr[i + 1].contentList.length > 0) {
                        nextPost = arr[i + 1].contentList[0];
                    }
                    else {
                        nextPost = arr[i + 1];
                    }
                }
            }
        });
    });

    let postPath: string = path.join(process.cwd(), 'public', 'kr', theme, `${post}.mdx`);
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
                    [rehypePrettyCode, {
                        theme: "one-dark-pro",
                        keepBackground: true,
                    }]
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
    });
    return {
        content,
        prePost: prePost === undefined ? undefined : prePost,
        nextPost: nextPost === undefined ? undefined : nextPost
    };
}
