import React from "react";
import { ColorConfig } from "./tailwindConfig";

export const code = {
    code: (props: React.HTMLAttributes<HTMLElement>) => {
        return (
            <code
                {...props}
                className={`overflow-x-auto ${ColorConfig.code} px-1 rounded-md ${props.className || ''}`}
            >
                {props.children}
            </code>
        );
    },
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
                to-pink-500
                dark:from-blue-400
                dark:via-purple-400
                dark:to-pink-400"
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
                dark:text-purple-400
                dark:hover:text-purple-500
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
                dark:text-green-400
                dark:hover:text-green-500
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
                dark:text-blue-400
                dark:hover:text-blue-500
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
                dark:text-green-400
                dark:hover:text-green-500
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
                dark:text-gray-400
                dark:hover:text-gray-500
                transition-colors
                duration-200"
        >
            {props.children}
        </h6>
    ),
};


export const highlights = {
    R: ({ children }: { children: React.ReactNode }) => (
        <span className="
            text-rose-600
            font-bold
            text-lg
            hover:text-rose-700
            dark:text-rose-400
            dark:hover:text-rose-500
            transition-colors
            duration-200"
        >
            {children}
        </span>
    ),
    G: ({ children }: { children: React.ReactNode }) => (
        <span className="
            text-emerald-600
            font-bold
            text-lg
            hover:text-emerald-700
            dark:text-emerald-400
            dark:hover:text-emerald-500
            transition-colors
            duration-200"
        >
            {children}
        </span>
    ),
    B: ({ children }: { children: React.ReactNode }) => (
        <span className="
            text-sky-600
            font-bold
            text-lg
            hover:text-sky-700
            dark:text-sky-400
            dark:hover:text-sky-500
            transition-colors
            duration-200"
        >
            {children}
        </span>
    ),
    U: ({ children }: { children: React.ReactNode }) => (
        <span className="
            underline
            decoration-4
            decoration-blue-500
            hover:decoration-blue-600
            dark:decoration-blue-300
            dark:hover:decoration-blue-400
            transition-all
            duration-200"
        >
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