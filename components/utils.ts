import fs from 'fs/promises';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
// import { heads } from '@/components/mdx/heads';
import { lists } from '@/components/mdx/list';
// import { table } from '@/components/mdx/table';
import { highlights } from '@/components/mdx/highlights';
import { code } from '@/components/mdx/code';
import remarkGfm from "remark-gfm";
import 'github-markdown-css/github-markdown-light.css'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ReactElement } from 'react';

export interface SubjectInfo {
    enSubject: string,
    enPost: string,
    subject: string
}

export async function getSubjectInfoList(): Promise<SubjectInfo[]> {
    let res: SubjectInfo[] = [];
    let subjectList: string[] = await fs.readdir(path.join(process.cwd(), 'public'));
    for (let subject of subjectList) {
        let postList: Post[] = await getSortedPostList(subject);

        res.push({
            enSubject: subject,
            enPost: postList[0].originalName,
            subject,
        })
    }
    return res;
}

export interface SubjectParams {
    subject: string
}

export async function getSubjectParams(): Promise<SubjectParams[]> {
    let subjectList: string[] = await fs.readdir(path.join(process.cwd(), 'public'));
    return subjectList.map((subject: string) => {
        return {
            subject: subject
        }
    })
}

export interface Post {
    isOutLine: boolean,
    firstOrder: number,
    secondOrder: number,
    order: string,
    title: string,
    originalName: string
}

export async function getSortedPostList(subject: string): Promise<Post[]> {
    let postList: string[] = await fs.readdir(path.join(process.cwd(), 'public', subject));

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
                    isOutLine: true,
                    firstOrder,
                    secondOrder,
                    order: `${firstOrder}-${secondOrder}`,
                    title,
                    originalName: post.replace(".mdx", "")
                };
            }
            return {
                isOutLine: false,
                firstOrder,
                secondOrder,
                order: `${firstOrder}`,
                title,
                originalName: post.replace(".mdx", "")
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
    return newPostList;
}

export interface PostParams {
    subject: string,
    post: string
}

export async function getPostParams(): Promise<PostParams[]> {
    let res: PostParams[] = [];
    let subjectList: SubjectParams[] = await getSubjectParams();
    for (let s of subjectList) {
        let postListPath: string = path.join(process.cwd(), 'public', s.subject);
        let postList: string[] = await fs.readdir(postListPath);
        for (let p of postList as string[]) {
            let post: string = p.replace('.mdx', '');
            res.push({
                subject: s.subject,
                post: post
            })
        }
    }
    return res;
}

interface CompileMDXResult {
    content: ReactElement;
}

export async function getPost(subject: string, post: string): Promise<ReactElement> {
    let postPath: string = path.join(process.cwd(), 'public', subject, `${post}.mdx`);
    let source: string = await fs.readFile(postPath, 'utf8');

    let { content }: CompileMDXResult = await compileMDX({
        source,
        options: {
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [[rehypeKatex, { output: 'mathml' }]]
            }
        },
        components: {
            // ...heads,
            ...lists,
            // ...table,
            ...highlights,
            ...code
        }
    })
    return content;
}
