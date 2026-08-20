"use client";

import { usePathname } from "next/navigation";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import SplashScreen from "./SplashScreen";

// Halaman publik tidak menunggu data apa pun — splash cuma bikin lambat.
const NO_SPLASH_ROUTES = ["/", "/signin"];

export default function LoadingHandler() {
    const pathname = usePathname();
    const { isLoading } = useGlobalLoading();

    if (NO_SPLASH_ROUTES.includes(pathname)) return null;

    return <SplashScreen isLoading={isLoading} />;
}
