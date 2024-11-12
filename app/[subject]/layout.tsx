import { notFound } from 'next/navigation';
import { SideList } from '@/components/sidebar/sideList';
import { SideMenu } from '@/components/sideMenu/menu';
import { getPostParams, getSortedPostList } from '@/components/utils';

export async function generateStaticParams() {
    return getPostParams();
}

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode,
    params: { subject: string }
}) {
    try {
        let res = await getSortedPostList(params.subject);
        return (
            <div className="flex">
                <SideMenu res={res} params={params} />
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