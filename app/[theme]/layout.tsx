import { notFound } from 'next/navigation';
import { SideList } from '@/components/sidebar/sideList';
import { Hamburger } from '@/components/hamburger/hamburger';
import {
    getThemeParams,
    ThemeParams,
    getSortedPostList,
    Post,
} from '@/components/utils';

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
        let res: Post[] = await getSortedPostList(params.theme);
        return (
            <div className="flex">
                <Hamburger res={res} />
                <SideList res={res} />
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