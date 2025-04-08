import { notFound } from 'next/navigation';
import { ResponsiveConfig } from '@/components/tailwindConfig';
import { getPostParams, getPost, PostParams, PostContent } from '@/components/utils';
import { BottomNavLayout, BottomLayoutButton, NoneButton } from '@/components/nav/bottimNav';

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
        let postContent: PostContent = await getPost(params.theme, params.post);
        return (
            <div className={`${ResponsiveConfig.postPage} mt-32 mb-32 flex-1 flex flex-col items-center overflow-x-hidden`}>
                <div className={`${ResponsiveConfig.post} markdown-body`}>
                    {postContent.content}
                </div>
                <BottomNavLayout className={ResponsiveConfig.post}>
                    {
                        !(postContent.prePost === undefined) ?
                            <BottomLayoutButton
                                isLeft={true}
                                href={postContent.prePost.URL}
                                label={postContent.prePost.title}
                            /> : <NoneButton />
                    }
                    {
                        postContent.nextPost ?
                            <BottomLayoutButton
                                isLeft={false}
                                href={postContent.nextPost.URL}
                                label={postContent.nextPost.title}
                            /> : <NoneButton />
                    }
                </BottomNavLayout>
            </div>
        )
    }
    catch (e) {
        // @ts-ignore
        console.log(`page error: ${e.message}`);
        notFound();
    }
}
