import { notFound } from 'next/navigation';
import { ResponsiveConfig, ZIndexConfig } from '@/components/tailwindConfig';
import { getPostParams, getPost, PostParams, PostContent } from '@/components/utils';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
        let postContent: PostContent = await getPost(params.theme, `${params.post}.mdx`);
        return (
            <div className={`${ResponsiveConfig.postPage} mt-32 mb-32 flex-1 flex flex-col items-center overflow-x-hidden`}>
                <div className={`${ResponsiveConfig.post} markdown-body`}>
                    {postContent.content}
                </div>
                <div className="flex justify-between items-center w-full mt-8 pt-4 gap-4 border-t-slate-600 border-t-2">
                    {postContent.prePost ? (
                        <Link
                            href={`./${postContent.prePost.originalName}`}
                            className="flex gap-2 justify-center items-center text-lg font-medium mx-5 py-4 rounded-lg basis-1/2 hover:bg-slate-700"
                        >
                            <FaArrowLeft /> {postContent.prePost.title}
                        </Link>
                    ) : (
                        <div className="basis-1/2"></div>
                    )}

                    {postContent.nextPost ? (
                        <Link
                            href={`./${postContent.nextPost.originalName}`}
                            className="flex gap-2 justify-center items-center text-lg font-medium py-4 rounded-lg basis-1/2 hover:bg-slate-700"
                        >
                            {postContent.nextPost.title} <FaArrowRight />
                        </Link>
                    ) : (
                        <div className="basis-1/2"></div>
                    )}
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
