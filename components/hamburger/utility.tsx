import Link from "next/link";
import { VscGithubInverted } from "react-icons/vsc";
import { GrLanguage } from "react-icons/gr";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";

export function UtilityButtons() {
    return (
        <nav className="h-14 flex items-center border-b-2">
            <Link
                href="https://github.com/tomatoM4to/tomatoM4to.github.io"
                className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300"
            >
                <VscGithubInverted className="text-2xl cursor-pointer" />
            </Link>
            <button className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300">
                <GrLanguage className="text-xl cursor-pointer" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300">
                <BsFillMoonStarsFill className="text-xl cursor-pointer" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-300">
                <FaSearch className="text-xl cursor-pointer" />
            </button>
        </nav>
    )
}