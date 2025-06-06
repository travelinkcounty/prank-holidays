import { NextResponse } from "next/server";
import HistoryService from "../../services/historyService";
import consoleManager from "../../utils/consoleManager";

// Get all histories (GET)
export async function GET(req: Request) {
    try {

        // Fetch histories based on status filter
        const histories = await HistoryService.getAllHistories();
        consoleManager.log("Fetched all histories:", histories.length);

        return NextResponse.json({
            statusCode: 200,
            message: "Histories fetched successfully",
            data: histories,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/histories:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new history (POST)
export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { userId, packageId } = formData;
        
        if (!userId || !packageId) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "All fields are required",
            }, { status: 400 });
        }

        // Save history data in Firestore
        const newHistory = await HistoryService.addHistory({
            userId,
            packageId,
            status: "active",
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
        });

        consoleManager.log("✅ History created successfully:", newHistory);

        return NextResponse.json({
            statusCode: 201,
            message: "History added successfully",
            data: newHistory,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/histories:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
