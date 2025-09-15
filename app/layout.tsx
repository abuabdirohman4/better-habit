import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SWRProvider from "@/components/SWRProvider";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import PWAComponents from "@/components/PWA";
import LoadingHandler from "@/components/PWA/LoadingHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Better Habit",
    description: "A smart habit tracking app to help you build better habits",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Better Habit",
    },
    icons: {
        icon: [
            { url: "/img/logo.svg", sizes: "192x192", type: "image/svg+xml" },
            { url: "/img/logo.svg", sizes: "512x512", type: "image/svg+xml" },
        ],
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#1496F6",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="mx-auto max-w-md bg-white dark:bg-white">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#1496F6" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Better Habit" />
                <link rel="apple-touch-icon" href="/img/logo.svg" />
            </head>
            <body
                className={`${inter.className} min-h-screen shadow-2xl bg-white`}
            >
                <PWAComponents />
                <LoadingHandler />
                <SWRProvider>
                    {children}
                    <BottomNavigationBar />
                </SWRProvider>
            </body>
        </html>
    );
}
