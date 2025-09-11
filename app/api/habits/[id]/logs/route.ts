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
            return NextResponse.json(
                { error: "Google Sheets not configured" },
                { status: 500 }
            );
        }

        // Get habit logs from Google Sheets
        let logsData: any[] = [];
        try {
            logsData = await googleSheets.getCSVWithAuth(
                SPREADSHEET_ID,
                HABIT_LOGS_SHEET
            );
        } catch (error) {
            return NextResponse.json({ data: [] });
        }

        const habitLogs: HabitLog[] = logsData
            .filter((row: any) => {
                // Check all possible field name variations
                const habitId = row.habitId || row.habit_id || row.habitid;
                // Convert both to string for comparison since habitId might be string
                return String(habitId) === String(params.id);
            })
            .map((row: any, index: number) => ({
                id: parseInt(row.id) || index + 1,
                habitId: parseInt(row.habitId || row.habit_id || row.habitid),
                date: row.date || "",
                completedValue:
                    row.completedValue || row.completed_value
                        ? parseInt(row.completedValue || row.completed_value)
                        : undefined,
                completedAt:
                    row.completedAt ||
                    row.completed_at ||
                    new Date().toISOString(),
            }));

        return NextResponse.json({ data: habitLogs });
    } catch (error) {
        console.error("Error fetching habit logs:", error);
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
        if (!SPREADSHEET_ID) {
            return NextResponse.json(
                { error: "Google Sheets not configured" },
                { status: 500 }
            );
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
