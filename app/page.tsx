import { mainPage } from "@/components/responsiveConfig";
import { SideMenu } from "@/components/sideMenu/menu";
import { Book } from "@/components/book";
import { GiMeshNetwork } from "react-icons/gi";
import { IoHardwareChipOutline } from "react-icons/io5";
import { FaHeadSideVirus } from "react-icons/fa";
import { GoDatabase } from "react-icons/go";
import { post } from '@/components/responsiveConfig';

import { Inter } from 'next/font/google'
import { getSubjectInfoList } from "@/components/utils";

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

export default async function Home() {
    let info = await getSubjectInfoList();
    return (
        <div className="mt-32 flex w-full">
            <SideMenu />
            <Dummy />
            <div className="flex-1 flex justify-center">
                <div className={`${post} ${inter.className} flex flex-col gap-52`}>
                    <BookLayout title="컴퓨터 과학">
                        {
                            info.map((s) => {
                                if (s.subject !== 'embedded' && s.subject !== 'network-knu' && s.subject !== 'example') {
                                    return (
                                        <Book
                                            key={s.enSubject}
                                            href={`/${s.enSubject}/${s.enPost}`}
                                            title={s.subject}
                                            icon={<GiMeshNetwork size={80} />}
                                        />
                                    )
                                }
                            })
                        }
                    </BookLayout>
                </div>
            </div>
        </div>
    );
}