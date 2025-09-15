"use client";

import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import SplashScreen from "./SplashScreen";

export default function LoadingHandler() {
    const { isLoading } = useGlobalLoading();
    
    return <SplashScreen isLoading={isLoading} />;
}
