"use client";

import { useState } from "react";
import { Habit } from "@/lib/types";
import { STALE_DAYS } from "@/utils/habit-stats";

interface StaleHabitsBannerProps {
    stale: Array<{ habit: Habit; days: number | null }>;
    onArchive: (habitIds: string[]) => Promise<void>;
}

export default function StaleHabitsBanner({
    stale,
    onArchive,
}: StaleHabitsBannerProps) {
    const [dismissed, setDismissed] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [selected, setSelected] = useState<string[]>(() =>
        stale.map((s) => s.habit.id)
    );

    if (dismissed || stale.length === 0) return null;

    const toggle = (id: string) =>
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const handleArchive = async () => {
        if (selected.length === 0) return;
        setIsArchiving(true);
        try {
            await onArchive(selected);
            setDismissed(true);
        } catch (error) {
            console.error("Failed to archive stale habits:", error);
        } finally {
            setIsArchiving(false);
        }
    };

    const describe = (days: number | null) =>
        days === null ? "belum pernah" : `${days} hari lalu`;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">🧹</span>
                <div className="flex-1">
                    <p className="font-semibold text-amber-900">
                        {stale.length} habit tidak tersentuh {STALE_DAYS}+ hari
                    </p>
                    <p className="text-sm text-amber-800 mt-0.5">
                        Arsipkan biar progress harian mencerminkan yang benar-benar kamu jalani.
                    </p>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-sm font-medium text-amber-900 underline mt-2"
                    >
                        {expanded ? "Sembunyikan" : "Lihat daftar"}
                    </button>

                    {expanded && (
                        <ul className="mt-3 space-y-2">
                            {stale.map(({ habit, days }) => (
                                <li
                                    key={habit.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(habit.id)}
                                        onChange={() => toggle(habit.id)}
                                        className="checkbox checkbox-sm"
                                    />
                                    <span className="text-amber-900 flex-1">
                                        {habit.name}
                                    </span>
                                    <span className="text-amber-700">
                                        {describe(days)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleArchive}
                            disabled={isArchiving || selected.length === 0}
                            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                        >
                            {isArchiving
                                ? "Mengarsipkan..."
                                : `Arsipkan ${selected.length}`}
                        </button>
                        <button
                            onClick={() => setDismissed(true)}
                            className="px-4 py-2 text-amber-900 text-sm font-medium"
                        >
                            Nanti saja
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
