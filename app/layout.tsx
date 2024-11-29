import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/nav/nav";
import { Noto_Sans, Playball } from 'next/font/google';

const notoSans = Noto_Sans({
    subsets: ['latin'],
    weight: ['400', '700'], // Adjust weights as needed
});

const sixCaps = Playball({
    subsets: ['latin'],
    weight: '400',
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
};

export const metadata: Metadata = {
    metadataBase: new URL('https://tomatom4to.github.io'),
    title: {
        default: "tomatom4to's Computer Science Blog",
        template: "%s | tomatom4to's CS Blog"
    },
    description: "Comprehensive computer science knowledge covering OS, Database, AI, Networks, Linux, and Docker. Learn computer science concepts with clear explanations and practical examples.",
    keywords: ['Computer Science', 'Operating Systems', 'Database', 'AI', 'Network', 'Linux', 'Docker', 'Programming', 'Software Development'],
    authors: [{ name: 'tomatom4to' }],
    creator: 'tomatom4to',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "tomatom4to's Computer Science Blog",
        description: "Your gateway to comprehensive computer science knowledge and practical programming skills",
        url: 'https://tomatom4to.github.io',
        siteName: "tomatom4to's CS Blog",
        locale: 'ko_KR',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://tomatom4to.github.io',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${notoSans.className} min-h-screen`}>
                <div className="grid grid-cols-[24rem_1fr] auto-rows-auto">
                    <Nav className={sixCaps.className} />
                    <main className="col-span-2">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}