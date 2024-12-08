import React from "react";

export const code = {
    code: (props: React.HTMLAttributes<HTMLElement>) => {
        return (
            <code
                {...props}
                className={`overflow-x-auto bg-slate-300 px-1 rounded-md ${props.className || ''}`}
            >
                {props.children}
            </code>
        );
    },

    pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
        return (
            <pre
                {...props}
                className={`overflow-x-auto bg-gray-200 rounded-lg ${props.className || ''}`}
            >
                {props.children}
            </pre>
        );
    }
};


export const heads = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1 {...props}
            className="
                text-3xl
                md:text-4xl
                font-extrabold
                my-6
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-blue-500
                via-purple-500
                to-pink-500"
        >
            {props.children}
        </h1>
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2 {...props}
            className="
                text-2xl
                md:text-3xl
                font-bold
                my-5
                text-purple-600
                hover:text-purple-800
                transition-colors
                duration-200"
        >
            {props.children}
        </h2>
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3 {...props}
            className="
                text-xl
                md:text-2xl
                font-bold
                my-4
                text-green-600
                hover:text-green-800
                transition-colors
                duration-200"
        >
            {props.children}
        </h3>
    ),
    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h4 {...props}
            className="
                text-lg
                md:text-xl
                font-semibold
                my-3
                text-blue-600
                hover:text-blue-800
                transition-colors
                duration-200"
        >
            {props.children}
        </h4>
    ),
    h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h5 {...props}
            className="
                text-lg
                font-medium
                my-2
                text-green-600
                hover:text-green-800
                transition-colors
                duration-200"
        >
            {props.children}
        </h5>
    ),
    h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h6 {...props}
            className="
                text-base
                font-medium
                my-2
                text-gray-700
                hover:text-gray-900
                transition-colors
                duration-200"
        >
            {props.children}
        </h6>
    ),
};


export const highlights = {
    R: ({ children }: { children: React.ReactNode }) => (
        <span className="text-rose-500 font-bold hover:text-red-700 transition-colors duration-200">
            {children}
        </span>
    ),
    G: ({ children }: { children: React.ReactNode }) => (
        <span className="text-emerald-500 text- font-bold hover:text-green-700 transition-colors duration-200">
            {children}
        </span>
    ),
    B: ({ children }: { children: React.ReactNode }) => (
        <span className="text-sky-500 font-bold hover:text-blue-700 transition-colors duration-200">
            {children}
        </span>
    ),
    U: ({ children }: { children: React.ReactNode }) => (
        <span className="underline decoration-dotted decoration-blue-400 hover:decoration-solid hover:decoration-blue-600 transition-all duration-200">
            {children}
        </span>
    ),
};


export const lists = {
    ul: (props: any) => (
        <ul {...props} className="list-disc ml-12 space-y-2 my-3">
            {props.children}
        </ul>
    ),
    ol: (props: any) => (
        <ol {...props} className="list-decimal ml-12 space-y-2 my-3">
            {props.children}
        </ol>
    ),
};

export const table = {
    table: (props: any) => (
        <div {...props} className=" overflow-x-auto mb-8">
            <table>
                {props.children}
            </table>
        </div>
    )
}