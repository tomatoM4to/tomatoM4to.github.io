import { mainPage } from "@/components/responsiveConfig";
import { SideMenu } from "@/components/sideMenu/menu";
import { Book } from "@/components/book";
import { GiMeshNetwork } from "react-icons/gi";
import { IoHardwareChipOutline } from "react-icons/io5";
import { FaHeadSideVirus } from "react-icons/fa";
import { GoDatabase } from "react-icons/go";
import { post } from '@/components/responsiveConfig';

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

function Dummy() {
    return <div className={`${mainPage}`}></div>;
}

function BookLayout({
    children,
    title
}: {
    children: React.ReactNode,
    title: string
}) {
    return (
        <div>
            <h1 className="text-3xl mb-10">{title}</h1>
            <div
                className="
                grid
                grid-cols-1 sm:grid-cols-2 md:grid-cols-4
                gap-20
                place-items-center
                custom-style
                "
            >
                {children}
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <div className="mt-32 flex w-full">
            <SideMenu />
            <Dummy />
            <div className="flex-1 flex justify-center">
                <div className={`${post} ${inter.className} flex flex-col gap-52`}>
                    <BookLayout title="컴퓨터 과학">
                        <Book href="/os/1-Computer-System-Overview" icon={<IoHardwareChipOutline size={80} />} title="OS" />
                        <Book href="/network/1-Introduction" icon={<GiMeshNetwork size={80} />} title="Network" />
                        <Book href="/ai/1-Basis-math" icon={<FaHeadSideVirus size={80} />} title="AI" />
                        <Book href="/database/1-Introduction" icon={<GoDatabase size={80} />} title="Database" />
                    </BookLayout>
                </div>
            </div>
        </div>
    );
}