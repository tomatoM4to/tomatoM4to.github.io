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


export async function getSubjectParams() {
    let subjectList = await fs.readdir(path.join(process.cwd(), 'public'));
    return subjectList.map(subject => {
        return {
            subject: encodeURIComponent(subject)
        }
    })
}

export type Post = {
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

export async function getPostParams() {
    let res = [];
    let subjectList = await getSubjectParams();
    for (let s of subjectList) {
        let postListPath = path.join(process.cwd(), 'public', decodeURIComponent(s.subject));
        let postList = await fs.readdir(postListPath);
        for (let p of postList) {
            let post = p.replace('.mdx', '');
            res.push({
                subject: s.subject,
                post: encodeURIComponent(post)
            })
        }
    }
    return res;
}

export async function getPost(subject: string, post: string) {
    let postPath = path.join(process.cwd(), 'public', decodeURIComponent(subject), `${decodeURIComponent(post)}.mdx`);
    let source = await fs.readFile(postPath, 'utf8');

    let { content } = await compileMDX({
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
