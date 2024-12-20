import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ColorConfig } from "../tailwindConfig";

export function BottomNavLayout({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`
            flex
            justify-between
            items-center
            w-full
            mt-8
            pt-4
            ${ColorConfig.bottomNav}
            border-t-2
            ${className}
        `}>
            {children}
        </div>
    )
}

export function BottomLayoutButton({
    href,
    label,
    isLeft
}: {
    href: string;
    label: string;
    isLeft: boolean;
}) {
    return (
        <Link
            href={href}
            className={`
                flex
                gap-2
                ${isLeft ? "justify-start" : "justify-end"}
                items-center
                text-lg
                font-medium
                py-4
                px-2
                rounded-lg
                basis-1/2
                ${ColorConfig.hover}
            `}
        >
            {isLeft && <IoIosArrowBack />
            }
            <span>{label}</span>
            {!isLeft && <IoIosArrowForward />}
        </Link >
    )
}

export function NoneButton() {
    return <div className="basis-1/2" />
}