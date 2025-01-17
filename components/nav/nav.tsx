import Link from "next/link";
import { VscGithubInverted } from "react-icons/vsc";
import { GrLanguage } from "react-icons/gr";
import { ZIndexConfig, ResponsiveConfig, ColorConfig } from "@/components/tailwindConfig";
import { DarkModeButton } from "@/components/darkmode/button";

function Search() {
    return (
        <input
            type="text"
            className="w-36 h-7 rounded-full border-2 border-black pl-2"
            placeholder="search"
        />
    )
}

export function UtilityButtons() {
    return (
        <div className="hidden lg:flex items-center">
            <Search />
            <div className={`bg-slate-300 h-10 w-0.5 ml-2`}></div>
            <Link
                href="https://github.com/tomatoM4to/tomatoM4to.github.io"
                className={`p-2 rounded-full ${ColorConfig.hover} transition-colors duration-300`}
            >
                <VscGithubInverted className="text-2xl cursor-pointer" />
            </Link>
            <button className={`p-2 rounded-full ${ColorConfig.hover} transition-colors duration-300`}>
                <GrLanguage className="text-2xl cursor-pointer" />
            </button>
            <DarkModeButton />
        </div>
    )
}

export function Nav({ className }: { className: string }) {
    return (
        <nav className={`
        ${className}
        ${ZIndexConfig.nav}
        ${ResponsiveConfig.nav}
        ${ColorConfig.nav}
        backdrop-blur-md
        w-full
        flex
        items-center
        justify-between
        pl-5
        pr-5
        mb-20
        border-b-2
        border-b-slate-300
        fixed`
        }>
            <Link href="/">tomatoM4to&apos;s blog</Link>
            <UtilityButtons />
        </nav>
    )
}