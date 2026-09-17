"use client";

import { useCallback, useEffect, useState } from "react";
import { todayWIB } from "@/utils/habit-stats";

// Reminder harian lokal: satu notifikasi per hari di jam pilihan user.
// Batasan sadar: Notification API hanya jalan selama app/PWA masih hidup.
// Push saat app tertutup butuh VAPID + server — sengaja di luar cakupan.
// ponytail: interval 60 detik, cukup presisi untuk pengingat harian.

const KEY_ENABLED = "habit-reminder-enabled";
const KEY_TIME = "habit-reminder-time";
const KEY_LAST_SENT = "habit-reminder-last-sent";

const readLocal = (key: string, fallback: string): string => {
    try {
        return localStorage.getItem(key) ?? fallback;
    } catch {
        return fallback;
    }
};

const writeLocal = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // private mode / storage blocked — reminder mati, app tetap jalan
    }
};

export const useHabitReminder = (pendingCount: number) => {
    const [enabled, setEnabled] = useState(false);
    const [time, setTime] = useState("20:00");
    const [permission, setPermission] =
        useState<NotificationPermission>("default");

    // Muat preferensi setelah mount (localStorage tidak ada saat SSR).
    useEffect(() => {
        setEnabled(readLocal(KEY_ENABLED, "false") === "true");
        setTime(readLocal(KEY_TIME, "20:00"));
        if (typeof Notification !== "undefined") {
            setPermission(Notification.permission);
        }
    }, []);

    const isSupported =
        typeof window !== "undefined" && typeof Notification !== "undefined";

    const toggle = useCallback(
        async (next: boolean) => {
            if (!next) {
                setEnabled(false);
                writeLocal(KEY_ENABLED, "false");
                return;
            }

            if (!isSupported) return;

            let granted = Notification.permission;
            if (granted === "default") {
                granted = await Notification.requestPermission();
            }
            setPermission(granted);

            if (granted !== "granted") return;

            setEnabled(true);
            writeLocal(KEY_ENABLED, "true");
        },
        [isSupported]
    );

    const changeTime = useCallback((next: string) => {
        setTime(next);
        writeLocal(KEY_TIME, next);
    }, []);

    // Cek tiap menit: sudah lewat jamnya, belum dikirim hari ini, masih ada sisa?
    useEffect(() => {
        if (!enabled || !isSupported || permission !== "granted") return;

        const check = () => {
            const today = todayWIB();
            if (readLocal(KEY_LAST_SENT, "") === today) return;

            const now = new Date().toLocaleTimeString("en-GB", {
                timeZone: "Asia/Jakarta",
                hour: "2-digit",
                minute: "2-digit",
            });
            if (now < time) return;

            // Semua sudah dicentang — tandai terkirim, jangan ganggu.
            if (pendingCount <= 0) {
                writeLocal(KEY_LAST_SENT, today);
                return;
            }

            new Notification("Better Habit", {
                body: `Masih ada ${pendingCount} habit belum dicentang hari ini.`,
                icon: "/img/logo.svg",
                tag: "habit-daily-reminder",
            });
            writeLocal(KEY_LAST_SENT, today);
        };

        check();
        const id = setInterval(check, 60000);
        return () => clearInterval(id);
    }, [enabled, isSupported, permission, time, pendingCount]);

    return {
        isSupported,
        enabled,
        time,
        permission,
        toggle,
        changeTime,
    };
};
