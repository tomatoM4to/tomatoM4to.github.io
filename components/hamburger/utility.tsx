import Link from "next/link";
import { VscGithubInverted } from "react-icons/vsc";
import { DarkModeButton } from "@/components/darkmode/button";
import { ColorConfig } from "@/components/tailwindConfig";

export function UtilityButtons() {
    return (
        <nav className={`h-12 md:h-14 flex items-center border-b-2 ${ColorConfig.nav}`}>
            <Link
                href="https://github.com/tomatoM4to/tomatoM4to.github.io"
                className={`p-2 rounded-full duration-300 ${ColorConfig.hover}`}
            >
                <VscGithubInverted className="text-xl md:text-2xl cursor-pointer" />
            </Link>
            <DarkModeButton />
        </nav>
    )
}