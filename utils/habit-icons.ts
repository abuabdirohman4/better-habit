import { HabitCategory } from "@/lib/types";

// Icon & warna per kategori (skema better-planner)
const CATEGORY_STYLES: Record<
    HabitCategory,
    { emoji: string; card: string; text: string }
> = {
    spiritual: { emoji: "🕌", card: "bg-card-green", text: "text-habit-green" },
    kesehatan: { emoji: "💪", card: "bg-card-red", text: "text-habit-red" },
    karir: { emoji: "💼", card: "bg-card-blue", text: "text-habit-blue" },
    keuangan: { emoji: "💰", card: "bg-card-yellow", text: "text-habit-yellow" },
    relasi: { emoji: "🤝", card: "bg-card-pink", text: "text-habit-pink" },
    petualangan: { emoji: "🧭", card: "bg-card-orange", text: "text-habit-orange" },
    kontribusi: { emoji: "🎁", card: "bg-card-purple", text: "text-habit-purple" },
    other: { emoji: "✅", card: "bg-card-green", text: "text-habit-green" },
};

const styleFor = (category: string) =>
    CATEGORY_STYLES[category as HabitCategory] || CATEGORY_STYLES.other;

export const getHabitIcon = (category: string) => styleFor(category).emoji;
export const getHabitCardColor = (category: string) => styleFor(category).card;
export const getHabitTextColor = (category: string) => styleFor(category).text;
