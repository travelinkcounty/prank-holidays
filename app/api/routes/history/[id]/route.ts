import { NextResponse } from "next/server";
import HistoryService from "../../../services/historyService";
import consoleManager from "../../../utils/consoleManager";

// GET a single history by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const history = await HistoryService.getHistoryById(id);
        if (!history) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "History not found",
            }, { status: 404 });
        }
        consoleManager.log("Fetched history:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "History fetched successfully",
            data: history,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/histories/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Update a history by ID (PUT)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.json(); // Get form data
        if (!id) throw new Error("History ID is required");

        let updateData: any = {};
        const userId = formData.userId;
        const package_ref = formData.package_ref;
        const status = formData.status;

        if (userId) updateData.userId = userId;
        if (package_ref) updateData.package_ref = package_ref;
        if (status) updateData.status = status;

        // Update history in database
        const updatedHistory = await HistoryService.updateHistory(id, updateData);
        consoleManager.log("History updated successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "History updated successfully",
            data: updatedHistory,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/histories/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Delete a history by ID (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) throw new Error("History ID is required");

        // Delete history from DB
        await HistoryService.deleteHistory(id);
        consoleManager.log("History deleted successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "History deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/histories/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
