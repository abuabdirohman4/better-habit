"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Navigasi yang menahan state pending sampai halaman tujuan siap.
 * Tombol pemanggilnya bisa menampilkan spinner sendiri, jadi tidak terasa hang.
 */
export function useNavigate() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const navigate = (path: string) => {
        startTransition(() => {
            router.push(path);
        });
    };

    return { navigate, isPending };
}
