import Script from "next/script";

export default function UmamiScript() {
    const id = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
    if (!id) {
        return null;
    }

    const host =
        process.env.NEXT_PUBLIC_UMAMI_HOST ?? "https://umami.abuabdirohman.com";

    return (
        <Script
            defer
            src={`${host}/script.js`}
            data-website-id={id}
            strategy="afterInteractive"
        />
    );
}
