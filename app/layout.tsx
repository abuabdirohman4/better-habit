import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SWRProvider from "@/components/SWRProvider";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import AppShell from "@/components/AppShell";
import PWAComponents from "@/components/PWA";
import LoadingHandler from "@/components/PWA/LoadingHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Better Habit — Build small habits, build your better self",
    description:
        "A free habit tracker with monthly goals, streaks, positive and negative habits, and stale-habit reminders. Installs like an app.",
    openGraph: {
        title: "Better Habit — Build small habits, build your better self",
        description:
            "A free habit tracker with monthly goals, streaks, positive and negative habits, and stale-habit reminders.",
        type: "website",
    },
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

// Semua halaman bergantung pada sesi Supabase — tidak ada yang bisa di-prerender statis.
export const dynamic = "force-dynamic";

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#ffffff",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-white dark:bg-white">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Better Habit" />
                <link rel="apple-touch-icon" href="/img/logo.svg" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-navbutton-color" content="#ffffff" />
                <meta name="application-name" content="Better Habit" />
            </head>
            <body
                className={`${inter.className} min-h-screen shadow-2xl bg-white`}
            >
                <PWAComponents />
                <LoadingHandler />
                <SWRProvider>
                    <AppShell>{children}</AppShell>
                    <BottomNavigationBar />
                </SWRProvider>
            </body>
        </html>
    );
}
