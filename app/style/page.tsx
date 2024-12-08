import { notFound } from 'next/navigation';
import { ResponsiveConfig } from '@/components/tailwindConfig';
import { getPost } from '@/components/utils';

export default async function Page() {
    try {
        let content = await getPost('../..', 'README.md');
        return (
            <div className={`${ResponsiveConfig.postPage} mt-32 mb-32 flex-1 flex flex-col items-center overflow-x-hidden`}>
                <div className={`${ResponsiveConfig.post} markdown-body`}>
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
