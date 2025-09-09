"use client";

export default function SettingsPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-habit-blue to-habit-purple px-7 pt-16 pb-8 text-white rounded-b-3xl">
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
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Push Notifications
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Receive habit reminders
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        defaultChecked
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-habit-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-habit-blue"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Email Reminders
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Get daily progress emails
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-habit-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-habit-blue"></div>
                                </label>
                            </div>
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
        </main>
    );
}
