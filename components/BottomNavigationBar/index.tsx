"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

interface BottomNavigationBarProps {
    className?: string;
}

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    isActive: boolean;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
    className = "",
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [pendingPath, setPendingPath] = useState<string | null>(null);

    const navItems: NavItem[] = useMemo(
        () => [
            {
                id: "home",
                label: "Home",
                icon: (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                ),
                path: "/dashboard",
                isActive: pathname === "/dashboard",
            },
            {
                id: "manage",
                label: "Manage",
                icon: (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h7"
                        />
                    </svg>
                ),
                path: "/manage-habits",
                isActive: pathname === "/manage-habits",
            },
            {
                id: "settings",
                label: "Settings",
                icon: (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                ),
                path: "/settings",
                isActive: pathname === "/settings",
            },
        ],
        [pathname]
    );

    const handleNavigation = (path: string) => {
        if (path === pathname) return;
        setPendingPath(path);
        startTransition(() => {
            router.push(path);
        });
    };

    // Halaman login belum punya sesi — nav ke halaman terproteksi tidak berguna di sana.
    if (pathname === "/" || pathname === "/signin") return null;

    return (
        <nav
            className={`fixed bottom-0 left-1/2 -translate-x-1/2 bg-white border-t border-gray-200 shadow-lg max-w-md w-full z-10 ${className}`}
        >
            <div className="flex items-center justify-around px-4 py-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        disabled={isPending}
                        className={`flex flex-col items-center justify-center py-2 px-4 min-w-0 flex-1 transition-all duration-200 disabled:cursor-default ${
                            item.isActive
                                ? "text-habit-blue"
                                : "text-habit-gray hover:text-habit-blue"
                        }`}
                        aria-label={`Navigate to ${item.label}`}
                    >
                        <div
                            className={`transition-all duration-200 ${
                                item.isActive ? "scale-110" : "scale-100"
                            }`}
                        >
                            {isPending && pendingPath === item.path ? (
                                <div
                                    className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
                                    aria-label="Loading"
                                />
                            ) : (
                                item.icon
                            )}
                        </div>
                        <span
                            className={`text-xs font-medium mt-1 transition-all duration-200 ${
                                item.isActive ? "opacity-100" : "opacity-70"
                            }`}
                        >
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavigationBar;
