import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import { SideList } from '@/components/sidebar/sideList';
import { SideMenu } from '@/components/sideMenu/menu';

function sortedFileList(res: string[]) {
    let newRes = res
        .map(res => res.split("-"))
        .map(res => {
            return {
                order: parseInt(res[0]),
                name: res.join("-"),
            }
        })
        .sort((a, b) => a.order - b.order)
        .map(res => res.name);
    return newRes;
}


export async function generateStaticParams() {
    let params = [];
    let root = path.join(process.cwd(), 'public');
    let dirList = await fs.readdir(root);

    for (let dir of dirList) {
        params.push({
            subject: dir
        })
    }
    return params;
}

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode,
    params: { subject: string }
}) {
    const filePath = path.join(process.cwd(), 'public', params.subject);
    try {
        let res: string[] = sortedFileList(await fs.readdir(filePath));
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