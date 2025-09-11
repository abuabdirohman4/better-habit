import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: "#1496F6",
                // Mockup Color Palette
                "habit-blue": "#1496F6",
                "habit-purple": "#8B5CF6",
                "habit-green": "#10B981",
                "habit-yellow": "#F59E0B",
                "habit-red": "#EF4444",
                "habit-pink": "#EC4899",
                "habit-indigo": "#6366F1",
                "habit-orange": "#F97316",
                "habit-brown": "#A16207",
                "habit-gray": "#6B7280",
                "habit-light-gray": "#F3F4F6",
                "habit-dark": "#1F2937",
                // Gradient colors
                "gradient-start": "#1496F6",
                "gradient-end": "#8B5CF6",
                // Card colors
                "card-green": "#D1FAE5",
                "card-blue": "#DBEAFE",
                "card-purple": "#EDE9FE",
                "card-yellow": "#FEF3C7",
                "card-red": "#FEE2E2",
                "card-pink": "#FCE7F3",
                "card-orange": "#FED7AA",
                "card-indigo": "#E0E7FF",
                "card-brown": "#FEF3C7",
            },
        },
    },
    plugins: [require("daisyui")],
};
export default config;
