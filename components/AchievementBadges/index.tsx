"use client";

import { Badge } from "@/utils/habit-stats";

interface AchievementBadgesProps {
    badges: Badge[];
}

export default function AchievementBadges({ badges }: AchievementBadgesProps) {
    const earned = badges.filter((b) => b.earned).length;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Achievements
                </h2>
                <span className="text-sm font-medium text-gray-500">
                    {earned}/{badges.length}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        title={badge.description}
                        className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                            badge.earned
                                ? "bg-amber-50 border-amber-200"
                                : "bg-gray-50 border-gray-100"
                        }`}
                    >
                        <span
                            className={`text-3xl ${badge.earned ? "" : "grayscale opacity-30"}`}
                        >
                            {badge.emoji}
                        </span>
                        <span
                            className={`text-xs mt-2 font-medium leading-tight ${
                                badge.earned ? "text-amber-900" : "text-gray-400"
                            }`}
                        >
                            {badge.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
