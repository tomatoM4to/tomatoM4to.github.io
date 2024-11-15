import { notFound } from 'next/navigation';
import { SideList } from '@/components/sidebar/sideList';
import { Hamburger } from '@/components/hamburger/hamburger';
import { getSubjectParams, SubjectParams, getSortedPostList, Post } from '@/components/utils';

export async function generateStaticParams(): Promise<SubjectParams[]> {
    return await getSubjectParams();
}

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode,
    params: { subject: string }
}) {
    try {
        let res: Post[] = await getSortedPostList(params.subject);
        return (
            <div className="flex">
                <Hamburger res={res} params={params} />
                <SideList res={res} params={params} />
                {children}
            </div>
        );
    }
    catch (e) {
        // @ts-ignore
        console.log(`layout error: ${e.message}`);
        notFound();
    }
}