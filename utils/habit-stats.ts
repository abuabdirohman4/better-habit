import { Habit, HabitCompletion } from "@/lib/types";

// Tanggal "hari ini" versi WIB — samakan dengan better-planner (dua app baca DB yang sama).
export const todayWIB = (): string =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

export const toDateString = (date: Date): string =>
    date.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

// Tanggal yang completion-nya sudah mencapai daily_target.
export const buildCompletedDates = (
    completions: HabitCompletion[],
    dailyTarget: number
): Set<string> => {
    const counts = new Map<string, number>();
    for (const c of completions) {
        counts.set(c.date, (counts.get(c.date) ?? 0) + 1);
    }
    const dates = new Set<string>();
    counts.forEach((n, date) => {
        if (n >= Math.max(1, dailyTarget)) dates.add(date);
    });
    return dates;
};

// Apakah habit jatuh tempo pada tanggal ini?
// daily = tiap hari; weekly = sekali per minggu (dianggap due Senin);
// flexible = tidak pernah wajib harian, dinilai lewat monthly_goal.
export const isDueOn = (habit: Habit, date: string): boolean => {
    if (habit.frequency === "daily") return true;
    if (habit.frequency === "weekly") {
        return new Date(date + "T00:00:00").getDay() === 1; // Monday
    }
    return false;
};

const DAY_MS = 86400000;

// Hari sejak completion terakhir. null = belum pernah sama sekali.
export const daysSinceLastCompletion = (
    completions: HabitCompletion[],
    today: string
): number | null => {
    if (completions.length === 0) return null;
    let last = completions[0].date;
    for (const c of completions) if (c.date > last) last = c.date;
    return Math.round(
        (new Date(today + "T00:00:00").getTime() -
            new Date(last + "T00:00:00").getTime()) /
            DAY_MS
    );
};

export const STALE_DAYS = 30;

// Habit aktif yang lama tak tersentuh — kandidat arsip.
export const findStaleHabits = (
    habits: Habit[],
    completions: HabitCompletion[],
    today: string
): Array<{ habit: Habit; days: number | null }> => {
    const byHabit = new Map<string, HabitCompletion[]>();
    for (const c of completions) {
        if (!byHabit.has(c.habit_id)) byHabit.set(c.habit_id, []);
        byHabit.get(c.habit_id)!.push(c);
    }

    return habits
        .filter((h) => !h.is_archived)
        .map((habit) => ({
            habit,
            days: daysSinceLastCompletion(byHabit.get(habit.id) ?? [], today),
        }))
        .filter(({ days }) => days === null || days >= STALE_DAYS)
        .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity));
};

// Progress bulan berjalan terhadap monthly_goal.
export const monthlyProgress = (
    habit: Habit,
    completions: HabitCompletion[],
    year: number,
    month: number // 1-based
): { completed: number; goal: number; percentage: number } => {
    const prefix = `${year}-${String(month).padStart(2, "0")}-`;
    const dates = buildCompletedDates(
        completions.filter((c) => c.date.startsWith(prefix)),
        habit.daily_target
    );
    const completed = dates.size;
    const goal = habit.monthly_goal;
    return {
        completed,
        goal,
        percentage: goal > 0 ? Math.round((completed / goal) * 100) : 0,
    };
};

// ---------------------------------------------------------------------------
// Grafik, insight, badge — semua turunan dari data yang sudah ada, tanpa kolom baru.
// ---------------------------------------------------------------------------

// Penyelesaian 6 bulan terakhir (termasuk bulan acuan), untuk grafik batang.
export const monthlyTrend = (
    habit: Habit,
    completions: HabitCompletion[],
    year: number,
    month: number, // 1-based, bulan acuan (paling kanan)
    months: number = 6
): Array<{ label: string; completed: number; goal: number; percentage: number }> => {
    const NAMA_BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const out = [];
    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(year, month - 1 - i, 1);
        const p = monthlyProgress(habit, completions, d.getFullYear(), d.getMonth() + 1);
        out.push({ label: NAMA_BULAN[d.getMonth()], ...p });
    }
    return out;
};

// Streak berjalan: mundur dari `today` selama tanggalnya lengkap.
export const currentStreak = (completedDates: Set<string>, today: string): number => {
    let streak = 0;
    let cursor = today;
    while (completedDates.has(cursor)) {
        streak++;
        const d = new Date(cursor + "T00:00:00");
        d.setDate(d.getDate() - 1);
        cursor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    return streak;
};

// Streak terpanjang sepanjang masa.
export const bestStreak = (completedDates: Set<string>): number => {
    const sorted = Array.from(completedDates).sort();
    if (sorted.length === 0) return 0;

    let best = 1;
    let run = 1;
    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1] + "T00:00:00");
        prev.setDate(prev.getDate() + 1);
        const expected = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-${String(prev.getDate()).padStart(2, "0")}`;
        if (sorted[i] === expected) {
            run++;
            if (run > best) best = run;
        } else {
            run = 1;
        }
    }
    return best;
};

export interface Badge {
    id: string;
    emoji: string;
    label: string;
    description: string;
    earned: boolean;
}

// Badge dihitung dari streak, total hari, dan pencapaian monthly_goal.
export const calculateBadges = (
    completedDates: Set<string>,
    goalProgress: { completed: number; goal: number },
    today: string
): Badge[] => {
    const total = completedDates.size;
    const streak = currentStreak(completedDates, today);
    const best = Math.max(bestStreak(completedDates), streak);
    const goalMet = goalProgress.goal > 0 && goalProgress.completed >= goalProgress.goal;

    return [
        { id: "first-step", emoji: "🌱", label: "Langkah Pertama", description: "Selesaikan 1 hari pertama", earned: total >= 1 },
        { id: "week-streak", emoji: "🔥", label: "Seminggu Beruntun", description: "Streak 7 hari berturut-turut", earned: best >= 7 },
        { id: "month-streak", emoji: "⚡", label: "Sebulan Beruntun", description: "Streak 30 hari berturut-turut", earned: best >= 30 },
        { id: "goal-met", emoji: "🎯", label: "Target Tercapai", description: "Capai monthly goal bulan ini", earned: goalMet },
        { id: "fifty-days", emoji: "💪", label: "50 Hari", description: "Total 50 hari selesai", earned: total >= 50 },
        { id: "century", emoji: "👑", label: "100 Hari", description: "Total 100 hari selesai", earned: total >= 100 },
    ];
};

// Satu kalimat insight paling relevan — dipilih berdasar kondisi paling menonjol.
export const mainInsight = (
    habit: Habit,
    completedDates: Set<string>,
    trend: Array<{ completed: number; goal: number }>,
    goalProgress: { completed: number; goal: number; percentage: number },
    today: string
): string => {
    const streak = currentStreak(completedDates, today);
    const days = daysSinceLastCompletion(
        Array.from(completedDates).map((date) => ({ date }) as HabitCompletion),
        today
    );

    if (completedDates.size === 0) {
        return `Belum ada catatan untuk ${habit.name}. Mulai hari ini — satu centang sudah cukup.`;
    }
    if (days !== null && days >= STALE_DAYS) {
        return `${habit.name} tidak tersentuh ${days} hari. Kalau sudah tidak relevan, arsipkan saja biar progress harian lebih jujur.`;
    }
    if (streak >= 7) {
        return `Streak ${streak} hari berjalan. Ini momentum terbaikmu — jangan putus hari ini.`;
    }
    if (goalProgress.goal > 0 && goalProgress.completed >= goalProgress.goal) {
        return `Target bulan ini sudah tercapai (${goalProgress.completed}/${goalProgress.goal}). Sisanya bonus.`;
    }

    // Bandingkan bulan ini vs bulan lalu kalau datanya ada.
    if (trend.length >= 2) {
        const now = trend[trend.length - 1].completed;
        const prev = trend[trend.length - 2].completed;
        if (prev > 0 && now > prev) {
            return `Bulan ini ${now} hari, naik dari ${prev} bulan lalu. Arahnya benar.`;
        }
        if (now < prev) {
            return `Bulan ini ${now} hari, turun dari ${prev} bulan lalu. Sisa ${Math.max(0, goalProgress.goal - now)} hari buat kejar target.`;
        }
    }

    const sisa = Math.max(0, goalProgress.goal - goalProgress.completed);
    return `${goalProgress.completed} dari ${goalProgress.goal} hari tercapai bulan ini. Kurang ${sisa} hari lagi.`;
};
