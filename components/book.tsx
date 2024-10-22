import Link from "next/link";

function Info({
    title
}: {
    title: string
}) {
    return (
        <div>
            <h2 className="text-3xl">
                {title}
            </h2>
            <div>tomatoM4to</div>
        </div>
    )
}

export function Book({
    href,
    title,
    icon
}: {
    href: string,
    title: string
    icon: React.ReactNode
}) {
    return (
        <Link className="book-container" href={href}>
            <div className="book">
                <div className="cover p-5 grid grid-rows-2 place-items-center">
                    {icon}
                    <Info title={title} />
                </div>
            </div>
        </Link>
    )
}