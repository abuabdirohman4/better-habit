"use client";

interface TrendPoint {
    label: string;
    completed: number;
    goal: number;
    percentage: number;
}

interface MonthlyTrendChartProps {
    data: TrendPoint[];
}

// Grafik batang inline SVG — tanpa library, cukup buat 6 titik data.
export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
    if (data.length === 0) return null;

    const max = Math.max(...data.map((d) => Math.max(d.completed, d.goal)), 1);
    const BAR_H = 120;

    return (
        <div>
            <div className="flex items-end justify-between gap-2" style={{ height: BAR_H }}>
                {data.map((d, i) => {
                    const h = Math.round((d.completed / max) * BAR_H);
                    const goalY = Math.round((d.goal / max) * BAR_H);
                    const isLast = i === data.length - 1;
                    const met = d.goal > 0 && d.completed >= d.goal;

                    return (
                        <div
                            key={d.label + i}
                            className="flex-1 flex flex-col items-center justify-end h-full relative"
                            title={`${d.label}: ${d.completed}/${d.goal} hari`}
                        >
                            {/* garis target */}
                            {d.goal > 0 && (
                                <div
                                    className="absolute w-full border-t-2 border-dashed border-gray-300"
                                    style={{ bottom: goalY }}
                                />
                            )}
                            <span className="text-xs font-semibold text-gray-600 mb-1">
                                {d.completed}
                            </span>
                            <div
                                className={`w-full rounded-t-lg transition-all duration-500 ${
                                    met
                                        ? "bg-gradient-to-t from-habit-green to-habit-blue"
                                        : isLast
                                          ? "bg-habit-blue"
                                          : "bg-gray-300"
                                }`}
                                style={{ height: Math.max(h, 2) }}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between gap-2 mt-2">
                {data.map((d, i) => (
                    <span
                        key={d.label + i}
                        className={`flex-1 text-center text-xs ${
                            i === data.length - 1
                                ? "font-bold text-gray-800"
                                : "text-gray-500"
                        }`}
                    >
                        {d.label}
                    </span>
                ))}
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
                Garis putus-putus = monthly goal
            </p>
        </div>
    );
}
