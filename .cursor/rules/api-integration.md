# API Integration & Data Management

## SWR Configuration

### SWR Setup

```typescript
// lib/swr-config.ts
import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 2,
    refreshInterval: 15000,
    fetcher: (url: string) => fetch(url).then((res) => res.json()),
};
```

### SWR Provider Setup

```typescript
// components/SWRProvider/index.tsx
"use client";

import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swr-config";

interface Props {
    children: React.ReactNode;
}

export default function SWRProvider({ children }: Props) {
    return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
```

## Google Sheets API Integration

### Google Sheets Client Setup (CSV Format)

```typescript
// lib/google-sheets.ts
import Papa from "papaparse";

export const googleSheets = {
    async getCSV(spreadsheetId: string, sheetName: string): Promise<any[]> {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

        try {
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV: ${response.statusText}`);
            }

            const csvText = await response.text();

            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => {
                        // Convert headers to camelCase
                        return header
                            .toLowerCase()
                            .replace(/\s+/g, "_")
                            .replace(/_([a-z])/g, (_, letter) =>
                                letter.toUpperCase()
                            );
                    },
                    complete: (results) => {
                        if (results.errors.length > 0) {
                            reject(
                                new Error(
                                    `CSV parsing errors: ${results.errors.map((e) => e.message).join(", ")}`
                                )
                            );
                        } else {
                            resolve(results.data);
                        }
                    },
                    error: (error) => {
                        reject(error);
                    },
                });
            });
        } catch (error) {
            console.error("Error fetching CSV:", error);
            throw error;
        }
    },

    async getCSVWithAuth(
        spreadsheetId: string,
        sheetName: string
    ): Promise<any[]> {
        // For private sheets, use Google Sheets API with authentication
        const { google } = await import("googleapis");

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(
                    /\\n/g,
                    "\n"
                ),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:Z`, // Get all columns
            });

            const values = response.data.values || [];
            if (values.length === 0) return [];

            // Convert to CSV format
            const csvLines = values.map((row) => row.join(","));
            const csvText = csvLines.join("\n");

            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => {
                        return header
                            .toLowerCase()
                            .replace(/\s+/g, "_")
                            .replace(/_([a-z])/g, (_, letter) =>
                                letter.toUpperCase()
                            );
                    },
                    complete: (results) => {
                        if (results.errors.length > 0) {
                            reject(
                                new Error(
                                    `CSV parsing errors: ${results.errors.map((e) => e.message).join(", ")}`
                                )
                            );
                        } else {
                            resolve(results.data);
                        }
                    },
                    error: (error) => {
                        reject(error);
                    },
                });
            });
        } catch (error) {
            console.error("Error fetching data with auth:", error);
            throw error;
        }
    },

    async appendValues(spreadsheetId: string, range: string, values: any[][]) {
        const { google } = await import("googleapis");

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(
                    /\\n/g,
                    "\n"
                ),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: { values },
        });
        return response.data;
    },
};
```

### Type Definitions

```typescript
// lib/types.ts
export interface Habit {
    id: number;
    displayName: string;
    iconName: string;
    type: "do" | "dont";
    frequencyType: "daily" | "weekly" | "custom";
    frequencyDays?: string; // e.g., "1,2,3,4,5" for weekdays
    reminderTime?: string; // e.g., "07:00"
    isReminderOn: boolean;
    goalValue: number;
    goalUnit: string; // e.g., "minutes", "km", "pages"
    isActive: boolean;
    createdAt: string;
}

export interface HabitLog {
    id: number;
    habitId: number;
    date: string; // YYYY-MM-DD format
    completedValue?: number; // Optional achievement value
    completedAt: string; // Timestamp when completed
}

export interface GoogleSheetsResponse {
    data: any[];
    error?: string;
}

// Helper types for form data
export interface CreateHabitData {
    displayName: string;
    iconName: string;
    type: "do" | "dont";
    frequencyType: "daily" | "weekly" | "custom";
    frequencyDays?: string;
    reminderTime?: string;
    isReminderOn: boolean;
    goalValue: number;
    goalUnit: string;
}

export interface CreateHabitLogData {
    habitId: number;
    date: string;
    completedValue?: number;
}
```

## NextAuth.js Integration

### Authentication Setup

```typescript
// app/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.sub!;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
});
```

### Session Management

```typescript
// components/SessionProvider/index.tsx
"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
    return <SessionProvider>{children}</SessionProvider>;
}
```

### Session Usage in Components

```typescript
// Using session in components
import { useSession, signIn, signOut } from "next-auth/react";

const { data: session, status } = useSession();

if (status === "loading") {
    return <Spinner />;
}

if (status === "unauthenticated") {
    return <LoginButton onClick={() => signIn()} />;
}

return <UserDashboard user={session.user} />;
```

## Google Sheets Database Structure

### Spreadsheet Structure

```typescript
// Google Sheets structure
// Sheet 1: Habits
// Columns: id, display_name, icon_name, type, frequency_type, frequency_days, reminder_time, is_reminder_on, goal_value, goal_unit, is_active, created_at

// Sheet 2: HabitLog
// Columns: id, habit_id, date, completed_value, completed_at

// Example CSV structure:
// Habits sheet:
// id,display_name,icon_name,type,frequency_type,frequency_days,reminder_time,is_reminder_on,goal_value,goal_unit,is_active,created_at
// 1,Morning Exercise,exercise_icon,do,daily,,07:00,1,30,minutes,1,2024-12-01 10:00
// 2,Read Books,book_icon,do,weekly,1,2,3,4,5,19:00,1,20,pages,1,2024-12-01 10:00
// 3,No Smoking,no_smoking_icon,dont,daily,,,1,1,times,1,2024-12-01 10:00

// HabitLog sheet:
// id,habit_id,date,completed_value,completed_at
// 101,1,2024-12-22,35,2024-12-22 07:30:15
// 102,2,2024-12-22,25,2024-12-22 19:45:30
// 103,3,2024-12-22,,2024-12-22 23:59:59
```

### Google Sheets Helper Functions

```typescript
// lib/google-sheets-helpers.ts
import { googleSheets } from "./google-sheets";
import { Habit, HabitLog, CreateHabitData, CreateHabitLogData } from "./types";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

export const habitsApi = {
    async getAll(): Promise<Habit[]> {
        try {
            // Use CSV for better performance
            const habits = await googleSheets.getCSV(SPREADSHEET_ID, "Habits");

            // Transform data to match interface
            const transformedHabits = habits.map((row: any) => ({
                id: parseInt(row.id),
                displayName: row.displayName,
                iconName: row.iconName,
                type: row.type as "do" | "dont",
                frequencyType: row.frequencyType as
                    | "daily"
                    | "weekly"
                    | "custom",
                frequencyDays: row.frequencyDays || undefined,
                reminderTime: row.reminderTime || undefined,
                isReminderOn:
                    row.isReminderOn === "1" || row.isReminderOn === true,
                goalValue: parseInt(row.goalValue) || 1,
                goalUnit: row.goalUnit,
                isActive: row.isActive === "1" || row.isActive === true,
                createdAt: row.createdAt,
            }));

            return transformedHabits.filter((habit) => habit.isActive);
        } catch (error) {
            console.error("Error fetching habits:", error);
            // Fallback to authenticated method for private sheets
            const habits = await googleSheets.getCSVWithAuth(
                SPREADSHEET_ID,
                "Habits"
            );
            return habits.filter((habit: any) => habit.isActive);
        }
    },

    async create(habitData: CreateHabitData): Promise<Habit> {
        // Get next available ID (in real implementation, you'd query the sheet first)
        const id = Date.now(); // Simple ID generation for demo
        const now = new Date().toISOString();

        const newHabit: Habit = {
            id,
            displayName: habitData.displayName,
            iconName: habitData.iconName,
            type: habitData.type,
            frequencyType: habitData.frequencyType,
            frequencyDays: habitData.frequencyDays,
            reminderTime: habitData.reminderTime,
            isReminderOn: habitData.isReminderOn,
            goalValue: habitData.goalValue,
            goalUnit: habitData.goalUnit,
            isActive: true,
            createdAt: now,
        };

        await googleSheets.appendValues(SPREADSHEET_ID, "Habits!A:L", [
            [
                newHabit.id.toString(),
                newHabit.displayName,
                newHabit.iconName,
                newHabit.type,
                newHabit.frequencyType,
                newHabit.frequencyDays || "",
                newHabit.reminderTime || "",
                newHabit.isReminderOn ? "1" : "0",
                newHabit.goalValue.toString(),
                newHabit.goalUnit,
                newHabit.isActive ? "1" : "0",
                newHabit.createdAt,
            ],
        ]);

        return newHabit;
    },

    async update(id: string, updates: Partial<Habit>): Promise<Habit> {
        // Implementation for updating habit in Google Sheets
        // This would require finding the row and updating it
        throw new Error("Not implemented yet");
    },

    async delete(id: string): Promise<void> {
        // Implementation for deleting habit from Google Sheets
        throw new Error("Not implemented yet");
    },
};

export const habitLogApi = {
    async getByHabitId(habitId: number): Promise<HabitLog[]> {
        try {
            // Use CSV for better performance
            const logs = await googleSheets.getCSV(SPREADSHEET_ID, "HabitLog");

            // Transform and filter data
            const transformedLogs = logs.map((row: any) => ({
                id: parseInt(row.id),
                habitId: parseInt(row.habitId),
                date: row.date,
                completedValue: row.completedValue
                    ? parseInt(row.completedValue)
                    : undefined,
                completedAt: row.completedAt,
            }));

            return transformedLogs.filter((log) => log.habitId === habitId);
        } catch (error) {
            console.error("Error fetching habit logs:", error);
            // Fallback to authenticated method for private sheets
            const logs = await googleSheets.getCSVWithAuth(
                SPREADSHEET_ID,
                "HabitLog"
            );
            return logs.filter((log: any) => parseInt(log.habitId) === habitId);
        }
    },

    async getByDateRange(
        startDate: string,
        endDate: string
    ): Promise<HabitLog[]> {
        try {
            const logs = await googleSheets.getCSV(SPREADSHEET_ID, "HabitLog");

            const transformedLogs = logs.map((row: any) => ({
                id: parseInt(row.id),
                habitId: parseInt(row.habitId),
                date: row.date,
                completedValue: row.completedValue
                    ? parseInt(row.completedValue)
                    : undefined,
                completedAt: row.completedAt,
            }));

            return transformedLogs.filter(
                (log) => log.date >= startDate && log.date <= endDate
            );
        } catch (error) {
            console.error("Error fetching habit logs by date range:", error);
            const logs = await googleSheets.getCSVWithAuth(
                SPREADSHEET_ID,
                "HabitLog"
            );
            return logs.filter(
                (log: any) => log.date >= startDate && log.date <= endDate
            );
        }
    },

    async create(logData: CreateHabitLogData): Promise<HabitLog> {
        const id = Date.now(); // Simple ID generation for demo
        const now = new Date().toISOString();

        const newLog: HabitLog = {
            id,
            habitId: logData.habitId,
            date: logData.date,
            completedValue: logData.completedValue,
            completedAt: now,
        };

        await googleSheets.appendValues(SPREADSHEET_ID, "HabitLog!A:E", [
            [
                newLog.id.toString(),
                newLog.habitId.toString(),
                newLog.date,
                newLog.completedValue?.toString() || "",
                newLog.completedAt,
            ],
        ]);

        return newLog;
    },

    async toggleCompletion(
        habitId: number,
        date: string
    ): Promise<HabitLog | null> {
        try {
            // Check if log already exists for this habit and date
            const existingLogs = await this.getByHabitId(habitId);
            const existingLog = existingLogs.find((log) => log.date === date);

            if (existingLog) {
                // If exists, we might want to delete it (toggle off)
                // For now, return the existing log
                return existingLog;
            } else {
                // Create new log entry
                return await this.create({
                    habitId,
                    date,
                });
            }
        } catch (error) {
            console.error("Error toggling habit completion:", error);
            throw error;
        }
    },
};
```

### API Routes with Google Sheets

```typescript
// API route for habits
// app/api/habits/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { habitsApi } from "@/lib/google-sheets-helpers";
import { CreateHabitData } from "@/lib/types";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const habits = await habitsApi.getAll();
        return NextResponse.json({ data: habits });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch habits" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const habitData: CreateHabitData = {
            displayName: body.displayName,
            iconName: body.iconName,
            type: body.type,
            frequencyType: body.frequencyType,
            frequencyDays: body.frequencyDays,
            reminderTime: body.reminderTime,
            isReminderOn: body.isReminderOn,
            goalValue: body.goalValue,
            goalUnit: body.goalUnit,
        };

        const habit = await habitsApi.create(habitData);
        return NextResponse.json({ data: habit });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create habit" },
            { status: 500 }
        );
    }
}
```

### API route for habit logs

// app/api/habits/[id]/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { habitLogApi } from "@/lib/google-sheets-helpers";
import { CreateHabitLogData } from "@/lib/types";

export async function GET(
request: NextRequest,
{ params }: { params: { id: string } }
) {
try {
const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const habitId = parseInt(params.id);
        const logs = await habitLogApi.getByHabitId(habitId);
        return NextResponse.json({ data: logs });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch habit logs" },
            { status: 500 }
        );
    }

}

export async function POST(
request: NextRequest,
{ params }: { params: { id: string } }
) {
try {
const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const habitId = parseInt(params.id);
        const body = await request.json();
        const logData: CreateHabitLogData = {
            habitId,
            date: body.date,
            completedValue: body.completedValue,
        };

        const log = await habitLogApi.create(logData);
        return NextResponse.json({ data: log });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create habit log" },
            { status: 500 }
        );
    }

}

````

## Custom Hooks with SWR

### useHabits Hook

```typescript
// hooks/useHabits.ts
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Habit, CreateHabitData } from "@/lib/types";

export const useHabits = () => {
    const { data: session } = useSession();

    const { data, error, isLoading, mutate } = useSWR(
        session?.user?.id ? "/api/habits" : null,
        (url: string) => fetch(url).then((res) => res.json())
    );

    const createHabit = async (habitData: CreateHabitData) => {
        try {
            const response = await fetch("/api/habits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(habitData),
            });

            if (!response.ok) {
                throw new Error("Failed to create habit");
            }

            const { data: newHabit } = await response.json();

            // Optimistic update
            mutate(
                (currentData) => ({
                    ...currentData,
                    data: [...(currentData?.data || []), newHabit],
                }),
                false
            );

            return newHabit;
        } catch (err) {
            throw err;
        }
    };

    const updateHabit = async (id: number, updates: Partial<Habit>) => {
        try {
            const response = await fetch(`/api/habits/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error("Failed to update habit");
            }

            const { data: updatedHabit } = await response.json();

            // Optimistic update
            mutate(
                (currentData) => ({
                    ...currentData,
                    data: currentData?.data?.map((habit: Habit) =>
                        habit.id === id ? updatedHabit : habit
                    ),
                }),
                false
            );

            return updatedHabit;
        } catch (err) {
            throw err;
        }
    };

    const deleteHabit = async (id: number) => {
        try {
            const response = await fetch(`/api/habits/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete habit");
            }

            // Optimistic update
            mutate(
                (currentData) => ({
                    ...currentData,
                    data: currentData?.data?.filter(
                        (habit: Habit) => habit.id !== id
                    ),
                }),
                false
            );
        } catch (err) {
            throw err;
        }
    };

    return {
        habits: data?.data || [],
        isLoading,
        error: error?.message,
        createHabit,
        updateHabit,
        deleteHabit,
        mutate,
    };
};
````

### useHabitLogs Hook

```typescript
// hooks/useHabitLogs.ts
import useSWR from "swr";
import { HabitLog, CreateHabitLogData } from "@/lib/types";

export const useHabitLogs = (habitId: number) => {
    const { data, error, isLoading, mutate } = useSWR(
        habitId ? `/api/habits/${habitId}/logs` : null,
        (url: string) => fetch(url).then((res) => res.json())
    );

    const toggleCompletion = async (date: string) => {
        try {
            const response = await fetch(`/api/habits/${habitId}/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date }),
            });

            if (!response.ok) {
                throw new Error("Failed to toggle completion");
            }

            const { data: newLog } = await response.json();

            // Optimistic update
            mutate(
                (currentData) => ({
                    ...currentData,
                    data: [...(currentData?.data || []), newLog],
                }),
                false
            );

            return newLog;
        } catch (err) {
            throw err;
        }
    };

    const addLog = async (logData: CreateHabitLogData) => {
        try {
            const response = await fetch(`/api/habits/${habitId}/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                throw new Error("Failed to add log");
            }

            const { data: newLog } = await response.json();

            // Optimistic update
            mutate(
                (currentData) => ({
                    ...currentData,
                    data: [...(currentData?.data || []), newLog],
                }),
                false
            );

            return newLog;
        } catch (err) {
            throw err;
        }
    };

    const updateLog = async (logId: number, updates: Partial<HabitLog>) => {
        try {
            const response = await fetch(
                `/api/habits/${habitId}/logs/${logId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updates),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update log");
            }

            const { data: updatedLog } = await response.json();

            // Optimistic update
            mutate(
                (currentData) => ({
                    ...currentData,
                    data: currentData?.data?.map((log: HabitLog) =>
                        log.id === logId ? updatedLog : log
                    ),
                }),
                false
            );

            return updatedLog;
        } catch (err) {
            throw err;
        }
    };

    return {
        logs: data?.data || [],
        isLoading,
        error: error?.message,
        toggleCompletion,
        addLog,
        updateLog,
        mutate,
    };
};
```

## Error Handling Patterns

### API Error Response

```typescript
// utils/api.ts
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return "An unexpected error occurred";
};

export const createApiResponse = <T>(
    data?: T,
    error?: string,
    message?: string
): ApiResponse<T> => ({
    data,
    error,
    message,
});
```

### Error Boundary Component

```typescript
// components/ErrorBoundary/index.tsx
"use client";

import React, { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <h2 className="font-bold">Something went wrong</h2>
                    <p>{this.state.error?.message}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
```

## Environment Variables

### Environment Setup

```bash
# .env.local
GOOGLE_SPREADSHEET_ID="your-google-spreadsheet-id"
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Dependencies Installation

```bash
# Install required packages
npm install swr papaparse googleapis
npm install --save-dev @types/papaparse @types/googleapis
```

### Type-safe Environment Variables

```typescript
// lib/env.ts
export const env = {
    GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID!,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
} as const;
```

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for API responses
2. **Error Handling**: Implement proper error boundaries and error states
3. **Loading States**: Show loading indicators during API calls
4. **Optimistic Updates**: Update UI immediately, then sync with server
5. **Caching**: Use React Query or SWR for client-side caching
6. **Authentication**: Always check authentication status before API calls
7. **Validation**: Validate data on both client and server side
8. **Rate Limiting**: Implement rate limiting for API endpoints
9. **Logging**: Log errors and important events for debugging
10. **Testing**: Write tests for API routes and custom hooks
