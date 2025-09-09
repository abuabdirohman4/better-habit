"use client";

import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swr-config";

interface Props {
    children: React.ReactNode;
}

export default function SWRProvider({ children }: Props) {
    return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
