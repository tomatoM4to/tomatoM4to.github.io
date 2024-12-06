import Link from "next/link";
import { VscGithubInverted } from "react-icons/vsc";
import { GrLanguage } from "react-icons/gr";
import { BsFillMoonStarsFill } from "react-icons/bs";

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
            <div className="bg-slate-300 h-10 w-0.5 ml-2"></div>
            <Link
                href="https://github.com/tomatoM4to/tomatoM4to.github.io"
                className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300"
            >
                <VscGithubInverted className="text-2xl cursor-pointer" />
            </Link>
            <button className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300">
                <GrLanguage className="text-2xl cursor-pointer" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300">
                <BsFillMoonStarsFill className="text-2xl cursor-pointer" />
            </button>
        </div>
    )
}

export function Nav({ className }: { className: string }) {
    return (
        <nav className={`${className} bg-slate-100 w-full h-14 flex items-center justify-between pl-5 pr-5 mb-20 border-b-2 border-b-slate-300 text-2xl fixed`}>
            <Link href="/">tomatoM4to&apos;s blog</Link>
            <UtilityButtons />
        </nav>
    )
}