import { notFound } from 'next/navigation';
import { SideList } from '@/components/sidebar/sideList';
import { Hamburger } from '@/components/hamburger/hamburger';
import { getThemeParams, ThemeParams, getSortedPostList, Post, PostWrapper, isPostWrapperArray } from '@/components/utils';

export async function generateStaticParams(): Promise<ThemeParams[]> {
    return await getThemeParams();
}

export default async function Layout(
    props: {
        children: React.ReactNode,
        params: Promise<{ theme: string }>
    }
) {
    const params = await props.params;
    const { children } = props;

    try {
        let res: Post[] | PostWrapper[] = await getSortedPostList(params.theme, true);
        return (
            <div className="flex">
                {res.length > 0 && isPostWrapperArray(res) &&
                    <Hamburger res={res} params={params} />}
                {res.length > 0 && isPostWrapperArray(res) &&
                    <SideList res={res} params={params} />}
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