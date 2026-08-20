"use client";

import { usePathname } from "next/navigation";

// Halaman app dikunci selebar mobile; landing & signin dibiarkan full-width.
const FULL_WIDTH_ROUTES = ["/", "/signin"];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFullWidth = FULL_WIDTH_ROUTES.includes(pathname);

    return (
        <div className={isFullWidth ? "" : "mx-auto max-w-md"}>{children}</div>
    );
}
