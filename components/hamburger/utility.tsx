import Link from "next/link";
import { VscGithubInverted } from "react-icons/vsc";
import { GrLanguage } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { DarkModeButton } from "../darkmode/button";
import { ColorConfig } from "../tailwindConfig";

export function UtilityButtons() {
    return (
        <nav className={`h-14 flex items-center border-b-2 ${ColorConfig.nav}`}>
            <Link
                href="https://github.com/tomatoM4to/tomatoM4to.github.io"
                className="p-2 rounded-full hover:bg-slate-300 transition-colors duration-300"
            >
                <VscGithubInverted className="text-2xl cursor-pointer" />
            </Link>
            <button className="p-2 rounded-full hover:bg-slate-300 transition-colors duration-300">
                <GrLanguage className="text-xl cursor-pointer" />
            </button>
            <DarkModeButton />
            <button className="p-2 rounded-full hover:bg-slate-300 transition-colors duration-300">
                <FaSearch className="text-xl cursor-pointer" />
            </button>
        </nav>
    )
}