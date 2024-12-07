import { notFound } from 'next/navigation';
import { postPage, post } from '@/components/responsiveConfig';
import { getPostParams, getPost, PostParams } from '@/components/utils';
import 'katex/dist/katex.min.css';

export async function generateStaticParams(): Promise<PostParams[]> {
    return await getPostParams();
}



export default async function Page(
    props: {
        params: Promise<{ theme: string; post: string }>
    }
) {
    const params = await props.params;
    try {
        let content = await getPost(params.theme, params.post);
        return (
            <div className={`${postPage} mt-32 mb-32 flex-1 flex flex-col items-center overflow-x-hidden`}>
                <div className={`${post} markdown-body`}>
                    {content}
                </div>
            </div>
        )
    }
    catch (e) {
        // @ts-ignore
        console.log(`page error: ${e.message}`);
        notFound();
    }
}
