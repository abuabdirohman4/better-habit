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

### Google Sheets Client Setup

```typescript
// lib/google-sheets.ts
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export const googleSheets = {
    async getValues(spreadsheetId: string, range: string) {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return response.data.values || [];
    },

    async updateValues(spreadsheetId: string, range: string, values: any[][]) {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: { values },
        });
        return response.data;
    },

    async appendValues(spreadsheetId: string, range: string, values: any[][]) {
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
    id: string;
    title: string;
    description?: string;
    frequency: "daily" | "weekly" | "monthly";
    target: number;
    color: string;
    icon?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface HabitEntry {
    id: string;
    habitId: string;
    date: string;
    completed: boolean;
    notes?: string;
    createdAt: string;
}

export interface GoogleSheetsResponse {
    data: any[];
    error?: string;
}
```

## NextAuth.js Integration

### Authentication Setup

```typescript
// app/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
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
    session: {
        strategy: "jwt",
    },
};

export default NextAuth(authOptions);
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
// Sheet 1: habits
// Columns: id, title, description, frequency, target, color, icon, userId, createdAt, updatedAt

// Sheet 2: habit_entries
// Columns: id, habitId, date, completed, notes, createdAt

// Sheet 3: users
// Columns: id, name, email, image, createdAt, updatedAt
```

### Google Sheets Helper Functions

```typescript
// lib/google-sheets-helpers.ts
import { googleSheets } from "./google-sheets";
import { Habit, HabitEntry } from "./types";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

export const habitsApi = {
    async getAll(userId: string): Promise<Habit[]> {
        const values = await googleSheets.getValues(
            SPREADSHEET_ID,
            "habits!A:J"
        );

        // Skip header row
        const habits = values.slice(1).map((row) => ({
            id: row[0],
            title: row[1],
            description: row[2],
            frequency: row[3],
            target: parseInt(row[4]),
            color: row[5],
            icon: row[6],
            userId: row[7],
            createdAt: row[8],
            updatedAt: row[9],
        }));

        return habits.filter((habit) => habit.userId === userId);
    },

    async create(
        habit: Omit<Habit, "id" | "createdAt" | "updatedAt">
    ): Promise<Habit> {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        const newHabit: Habit = {
            ...habit,
            id,
            createdAt: now,
            updatedAt: now,
        };

        await googleSheets.appendValues(SPREADSHEET_ID, "habits!A:J", [
            [
                newHabit.id,
                newHabit.title,
                newHabit.description || "",
                newHabit.frequency,
                newHabit.target.toString(),
                newHabit.color,
                newHabit.icon || "",
                newHabit.userId,
                newHabit.createdAt,
                newHabit.updatedAt,
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

export const habitEntriesApi = {
    async getByHabitId(habitId: string): Promise<HabitEntry[]> {
        const values = await googleSheets.getValues(
            SPREADSHEET_ID,
            "habit_entries!A:F"
        );

        const entries = values.slice(1).map((row) => ({
            id: row[0],
            habitId: row[1],
            date: row[2],
            completed: row[3] === "TRUE",
            notes: row[4],
            createdAt: row[5],
        }));

        return entries.filter((entry) => entry.habitId === habitId);
    },

    async create(
        entry: Omit<HabitEntry, "id" | "createdAt">
    ): Promise<HabitEntry> {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        const newEntry: HabitEntry = {
            ...entry,
            id,
            createdAt: now,
        };

        await googleSheets.appendValues(SPREADSHEET_ID, "habit_entries!A:F", [
            [
                newEntry.id,
                newEntry.habitId,
                newEntry.date,
                newEntry.completed.toString(),
                newEntry.notes || "",
                newEntry.createdAt,
            ],
        ]);

        return newEntry;
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

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const habits = await habitsApi.getAll(session.user.id);
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
        const { title, description, frequency, target, color, icon } = body;

        const habit = await habitsApi.create({
            title,
            description,
            frequency,
            target,
            color,
            icon,
            userId: session.user.id,
        });

        return NextResponse.json({ data: habit });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create habit" },
            { status: 500 }
        );
    }
}
```

## Custom Hooks with SWR

### useHabits Hook

```typescript
// hooks/useHabits.ts
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Habit } from "@/lib/types";

export const useHabits = () => {
    const { data: session } = useSession();

    const { data, error, isLoading, mutate } = useSWR(
        session?.user?.id ? "/api/habits" : null,
        (url: string) => fetch(url).then((res) => res.json())
    );

    const createHabit = async (
        habitData: Omit<Habit, "id" | "createdAt" | "updatedAt">
    ) => {
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

    const updateHabit = async (id: string, updates: Partial<Habit>) => {
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

    const deleteHabit = async (id: string) => {
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
```

### useHabitEntries Hook

```typescript
// hooks/useHabitEntries.ts
import useSWR from "swr";
import { HabitEntry } from "@/lib/types";

export const useHabitEntries = (habitId: string) => {
    const { data, error, isLoading, mutate } = useSWR(
        habitId ? `/api/habits/${habitId}/entries` : null,
        (url: string) => fetch(url).then((res) => res.json())
    );

    const toggleEntry = async (date: string, completed: boolean) => {
        try {
            const response = await fetch(`/api/habits/${habitId}/entries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date, completed }),
            });

            if (!response.ok) {
                throw new Error("Failed to update entry");
            }

            const { data: updatedEntry } = await response.json();

            // Optimistic update
            mutate(
                (currentData) => ({
                    ...currentData,
                    data: currentData?.data?.map((entry: HabitEntry) =>
                        entry.date === date ? { ...entry, completed } : entry
                    ),
                }),
                false
            );

            return updatedEntry;
        } catch (err) {
            throw err;
        }
    };

    const addEntry = async (entry: Omit<HabitEntry, "id" | "createdAt">) => {
        try {
            const response = await fetch(`/api/habits/${habitId}/entries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(entry),
            });

            if (!response.ok) {
                throw new Error("Failed to add entry");
            }

            const { data: newEntry } = await response.json();

            // Optimistic update
            mutate(
                (currentData) => ({
                    ...currentData,
                    data: [...(currentData?.data || []), newEntry],
                }),
                false
            );

            return newEntry;
        } catch (err) {
            throw err;
        }
    };

    return {
        entries: data?.data || [],
        isLoading,
        error: error?.message,
        toggleEntry,
        addEntry,
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
