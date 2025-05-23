import Link from "next/link";
import { FaLink } from "react-icons/fa6";
import { ResponsiveConfig, ColorConfig } from "@/components/tailwindConfig";
import { ThemeType, SubThemeType } from "@/components/theme/data";

export function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="mt-32 w-full flex justify-center">
            <div className={`grid ${ResponsiveConfig.themeGridLayout} gap-10`}>
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
            <Link
                href={subTheme.link}
                className={`inline-flex items-center group ${ColorConfig.pointText} hover:underline`}
            >
                <h2 className={`${ResponsiveConfig.themeH2}`}>{subTheme.header}</h2>
                <FaLink
                    size={20}
                    className={`
                    ml-1
                    ${ColorConfig.pointText}
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-100`}
                />
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
            <Link
                href={subTheme.link}
                className={`${ColorConfig.pointText} hover:underline`}
            >
                read more
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
            <h1 className={ResponsiveConfig.themeH1}>{theme.header}</h1>
            <div className={`border-2 ${ColorConfig.theme} rounded-2xl mt-2`}>
                {
                    theme.subTheme.map((subTheme, index) => (
                        <SubTheme key={index} subTheme={subTheme} />
                    ))
                }
            </div>
        </section>
    )
}