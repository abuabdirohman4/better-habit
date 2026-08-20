"use client";

import { useNavigate } from "@/hooks/useNavigate";

interface NavButtonProps {
    href: string;
    className?: string;
    children: React.ReactNode;
    spinnerClassName?: string;
}

/**
 * Pengganti <Link> untuk tombol navigasi penting: menahan spinner di dalam
 * tombol sampai halaman tujuan siap, supaya jeda tidak terasa seperti hang.
 */
export default function NavButton({
    href,
    className = "",
    children,
    spinnerClassName = "border-white border-t-transparent",
}: NavButtonProps) {
    const { navigate, isPending } = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(href)}
            disabled={isPending}
            className={`inline-flex items-center justify-center gap-2 disabled:cursor-wait ${className}`}
        >
            {isPending && (
                <span
                    className={`h-4 w-4 shrink-0 animate-spin rounded-full border-2 ${spinnerClassName}`}
                    aria-hidden="true"
                />
            )}
            {children}
        </button>
    );
}
