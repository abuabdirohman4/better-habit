import { NextRequest, NextResponse } from "next/server";
import { HabitLog, CreateHabitLogData } from "@/lib/types";
import { googleSheets } from "@/lib/google-sheets";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const HABIT_LOGS_SHEET = "HabitLogs";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!SPREADSHEET_ID) {
            // Return mock data for development
            const mockLogs: HabitLog[] = [
                {
                    id: 1,
                    habitId: parseInt(params.id),
                    date: "2024-01-15",
                    completedValue: 5,
                    completedAt: "2024-01-15T07:30:00Z",
                },
                {
                    id: 2,
                    habitId: parseInt(params.id),
                    date: "2024-01-14",
                    completedValue: 3,
                    completedAt: "2024-01-14T08:15:00Z",
                },
            ];
            return NextResponse.json({ data: mockLogs });
        }

        // Get habit logs from Google Sheets
        let logsData: any[] = [];
        try {
            logsData = await googleSheets.getCSVWithAuth(
                SPREADSHEET_ID,
                HABIT_LOGS_SHEET
            );
        } catch (error) {
            console.log("HabitLogs sheet not found, using mock data");
            // Return mock data if sheet doesn't exist
            const mockLogs: HabitLog[] = [
                {
                    id: 1,
                    habitId: parseInt(params.id),
                    date: "2024-01-15",
                    completedValue: 5,
                    completedAt: "2024-01-15T07:30:00Z",
                },
                {
                    id: 2,
                    habitId: parseInt(params.id),
                    date: "2024-01-14",
                    completedValue: 3,
                    completedAt: "2024-01-14T08:15:00Z",
                },
            ];
            return NextResponse.json({ data: mockLogs });
        }

        // Filter logs for specific habit
        const habitLogs: HabitLog[] = logsData
            .filter((row: any) => parseInt(row.habitId) === parseInt(params.id))
            .map((row: any, index: number) => ({
                id: parseInt(row.id) || index + 1,
                habitId: parseInt(row.habitId),
                date: row.date || "",
                completedValue: row.completedValue
                    ? parseInt(row.completedValue)
                    : undefined,
                completedAt: row.completedAt || new Date().toISOString(),
            }));

        return NextResponse.json({ data: habitLogs });
    } catch (error) {
        console.error("Error fetching habit logs:", error);
        // Return mock data as fallback
        const mockLogs: HabitLog[] = [
            {
                id: 1,
                habitId: parseInt(params.id),
                date: "2024-01-15",
                completedValue: 5,
                completedAt: "2024-01-15T07:30:00Z",
            },
        ];
        return NextResponse.json({ data: mockLogs });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!SPREADSHEET_ID) {
            const logData: CreateHabitLogData = await request.json();

            // Validate required fields
            if (!logData.habitId || !logData.date) {
                return NextResponse.json(
                    { error: "Missing required fields" },
                    { status: 400 }
                );
            }

            // Create mock response
            const newLog: HabitLog = {
                id: Date.now(),
                habitId: logData.habitId,
                date: logData.date,
                completedValue: logData.completedValue,
                completedAt: new Date().toISOString(),
            };

            return NextResponse.json({ data: newLog }, { status: 201 });
        }

        const logData: CreateHabitLogData = await request.json();

        // Validate required fields
        if (!logData.habitId || !logData.date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate new ID
        const newId = Date.now();

        // Prepare data for Google Sheets
        const newLogRow = [
            newId.toString(),
            logData.habitId.toString(),
            logData.date,
            logData.completedValue?.toString() || "",
            new Date().toISOString(),
        ];

        // Append to Google Sheets
        try {
            await googleSheets.appendValues(
                SPREADSHEET_ID,
                `${HABIT_LOGS_SHEET}!A:E`,
                [newLogRow]
            );
        } catch (error) {
            console.log(
                "HabitLogs sheet not found, creating log in memory only"
            );
            // If sheet doesn't exist, just return the log without saving
        }

        // Create response object
        const newLog: HabitLog = {
            id: newId,
            habitId: logData.habitId,
            date: logData.date,
            completedValue: logData.completedValue,
            completedAt: new Date().toISOString(),
        };

        return NextResponse.json({ data: newLog }, { status: 201 });
    } catch (error) {
        console.error("Error creating habit log:", error);
        return NextResponse.json(
            { error: "Failed to create habit log" },
            { status: 500 }
        );
    }
}
