import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        serverComponentsExternalPackages: ["@prisma/client"],
    },
    images: {
        domains: ["your-domain.com"],
        formats: ["image/webp", "image/avif"],
    },
    compress: true,
    poweredByHeader: false,
    generateEtags: false,
    httpAgentOptions: {
        keepAlive: true,
    },
};

const config = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: [
        // Static assets caching
        {
            urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "static-image-assets",
                expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 24 * 60 * 60, // 1 day
                },
            },
        },
        // API routes - NO CACHING for dynamic data
        {
            urlPattern: ({ url }) => {
                return (
                    url.origin === self.origin &&
                    url.pathname.startsWith("/api/")
                );
            },
            handler: "NetworkFirst",
            options: {
                cacheName: "apis-no-cache",
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 0,
                    maxAgeSeconds: 0,
                },
            },
        },
    ],
})(nextConfig);

export default config;
