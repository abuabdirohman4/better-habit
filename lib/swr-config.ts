import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 2,
    refreshInterval: 15000,
    fetcher: (url: string) => fetch(url).then((res) => res.json()),
};
