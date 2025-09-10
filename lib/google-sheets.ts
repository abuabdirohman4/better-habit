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
                    error: (error: Error) => {
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
                        // Log warnings but don't fail on field count mismatches
                        if (results.errors.length > 0) {
                            console.warn(
                                "CSV parsing warnings:",
                                results.errors.map((e) => e.message).join(", ")
                            );
                        }

                        // Filter out rows with too few fields
                        const validData = results.data.filter((row: any) => {
                            const fieldCount = Object.keys(row).length;
                            return fieldCount >= 5; // Minimum required fields
                        });

                        resolve(validData);
                    },
                    error: (error: Error) => {
                        console.error("CSV parsing error:", error);
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
