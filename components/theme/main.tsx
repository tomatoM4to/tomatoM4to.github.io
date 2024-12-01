import Link from "next/link";
import { FaLink } from "react-icons/fa6";
import { themeH1, themeH2, themeGridLayout } from "@/components/responsiveConfig";
import { ThemeType, SubThemeType } from "@/components/theme/data";

export function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="mt-32 w-full flex justify-center">
            <div className={`grid ${themeGridLayout} gap-10`}>
                {children}
            </div>
        </div>
    )
}

function SubTheme({
    subTheme
}: {
    subTheme: SubThemeType
}) {
    return (
        <div className="p-5">
            <Link href={subTheme.link} className="flex items-center group">
                <h2 className={`${themeH2} text-blue-600 hover:underline`}>{subTheme.header}</h2>
                <FaLink size={20} className="ml-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
            </Link>
            <p>{subTheme.explanation}</p>
            <p className="mt-3">목차</p>
            <ul className="list-disc ml-5">
                {
                    subTheme.list.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                }
            </ul>
            <Link href={subTheme.link}>
                <p className=" text-blue-600 hover:underline">read more</p>
            </Link>
        </div>
    )
}

export function Theme({
    theme
}: {
    theme: ThemeType
}) {
    return (
        <section className="w-full">
            <h1 className={themeH1}>{theme.header}</h1>
            <div className=" border-2 border-gray-300 rounded-2xl mt-2">
                {
                    theme.subTheme.map((subTheme, index) => (
                        <SubTheme key={index} subTheme={subTheme} />
                    ))
                }
            </div>
        </section>
    )
}