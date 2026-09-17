"use client";

import { useState, useMemo } from "react";
import Modal from "@/components/Modal";
import Toggle from "@/components/Toggle";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useHabits } from "@/hooks/useHabits";
import { useAllHabitLogs } from "@/hooks/useHabitLogs";
import { useHabitReminder } from "@/hooks/useHabitReminder";
import { isDueOn, todayWIB } from "@/utils/habit-stats";
import { Habit, HabitCompletion } from "@/lib/types";
import {
    usePWAInstall,
    setDeferredPrompt,
    setIsInstalled,
    isIOS,
} from "@/lib/pwa-install";

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    // Sisa habit hari ini — jadi isi pesan notifikasi.
    const { habits } = useHabits();
    const { logs } = useAllHabitLogs();
    const pendingCount = useMemo(() => {
        const today = todayWIB();
        const doneCount: Record<string, number> = {};
        logs.forEach((log: HabitCompletion) => {
            if (log.date === today) {
                doneCount[log.habit_id] = (doneCount[log.habit_id] || 0) + 1;
            }
        });
        return habits.filter(
            (h: Habit) =>
                !h.is_archived &&
                isDueOn(h, today) &&
                (doneCount[h.id] || 0) < h.daily_target
        ).length;
    }, [habits, logs]);

    const reminder = useHabitReminder(pendingCount);

    const { deferredPrompt, isInstalled } = usePWAInstall();
    const canInstall = !isInstalled && !!deferredPrompt;

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") setIsInstalled(true);
        setDeferredPrompt(null);
    };

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await supabase.auth.signOut();
        router.replace("/");
    };
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-habit-blue to-habit-purple px-7 py-8 text-white rounded-b-3xl">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Settings</h1>
                        <p className="text-white/90">Manage your preferences</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-7 -mt-4 relative z-10">
                {/* Settings Sections */}
                <div className="space-y-4">
                    {/* Profile Section */}
                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Profile
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            {reminder.isSupported ? (
                                <>
                                    <Toggle
                                        checked={reminder.enabled}
                                        onChange={reminder.toggle}
                                        label="Daily Reminder"
                                        helperText={
                                            reminder.permission === "denied"
                                                ? "Notifikasi diblokir browser — izinkan dulu di setelan situs"
                                                : "Pengingat harian kalau masih ada habit belum dicentang"
                                        }
                                        color="primary"
                                    />

                                    {reminder.enabled && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Jam pengingat
                                            </label>
                                            <input
                                                type="time"
                                                value={reminder.time}
                                                onChange={(e) =>
                                                    reminder.changeTime(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-habit-blue focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                Hari ini sisa {pendingCount} habit.
                                                Notifikasi hanya muncul selama app
                                                masih terbuka.
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Browser ini tidak mendukung notifikasi.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* App Settings Section */}
                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            App Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Theme
                                </label>
                                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-habit-blue focus:border-transparent">
                                    <option>Light</option>
                                    <option>Dark</option>
                                    <option>System</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Language
                                </label>
                                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-habit-blue focus:border-transparent">
                                    <option>English</option>
                                    <option>Bahasa Indonesia</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Install App Section */}
                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            Install App
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Pasang Better Habit di perangkat untuk akses cepat
                            dan tampilan full-screen.
                        </p>

                        {isInstalled ? (
                            <div className="flex items-center gap-2 text-sm font-medium text-habit-green">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                Sudah terpasang di perangkat ini
                            </div>
                        ) : canInstall ? (
                            <button
                                onClick={handleInstall}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-habit-blue px-4 py-3 font-medium text-white transition-colors hover:brightness-110"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3v12m0 0l-5-5m5 5l5-5M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4"
                                    />
                                </svg>
                                Install Better Habit
                            </button>
                        ) : isIOS() ? (
                            <p className="text-sm text-gray-500">
                                Di Safari: tap tombol <strong>Share</strong>{" "}
                                lalu pilih <strong>Add to Home Screen</strong>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Buka Better Habit di Chrome, lalu tap ikon
                                install di address bar
                            </p>
                        )}
                    </div>

                    {/* Account Section */}
                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            Account
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Keluar dari sesi akunmu di perangkat ini.
                        </p>
                        <button
                            onClick={() => setShowSignOutModal(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition-colors hover:bg-red-600"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Sign Out
                        </button>
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            About
                        </h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Version 1.0.0</p>
                            <p>Better Habit - Track your daily habits</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom spacing for navigation */}
            <div className="pb-20"></div>

            {/* Sign Out Confirmation */}
            <Modal
                isOpen={showSignOutModal}
                onClose={() => !isSigningOut && setShowSignOutModal(false)}
                title="Sign Out"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Yakin mau keluar? Kamu perlu masuk lagi untuk melihat
                        kebiasaanmu.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setShowSignOutModal(false)}
                            disabled={isSigningOut}
                            className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                        >
                            {isSigningOut && (
                                <Spinner className="h-4 w-4 fill-white text-red-300" />
                            )}
                            {isSigningOut ? "Keluar..." : "Sign Out"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Account"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                // Handle delete account
                                setShowDeleteModal(false);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
