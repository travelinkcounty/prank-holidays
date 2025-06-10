import { NextRequest, NextResponse } from "next/server";
import JoinService from "../../../services/joinServices";
import consoleManager from "../../../utils/consoleManager";

// Get join by ID (GET)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const join = await JoinService.getJoinById(id);

        if (!join) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Join not found",
            }, { status: 404 });
        }

        consoleManager.log("Join fetched:", join);
        return NextResponse.json({
            statusCode: 200,
            message: "Join fetched successfully",
            data: join,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

    } catch (error: unknown) {
        const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
        consoleManager.error("Error in GET /api/joins/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Update join (PUT)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const updatedData = await req.json();
        const updatedJoin = await JoinService.updateJoin(id, updatedData);

        if (!updatedJoin) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Join not found",
            }, { status: 404 });
        }

        consoleManager.log("Join updated:", updatedJoin);
        return NextResponse.json({
            statusCode: 200,
            message: "Join updated successfully",
            data: updatedJoin,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

    } catch (error: unknown) {
        const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
        consoleManager.error("Error in PUT /api/joins/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Delete join (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const isDeleted = await JoinService.deleteJoin(id);

        if (!isDeleted.success) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Join not found",
            }, { status: 404 });
        }

        consoleManager.log("Join deleted:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "Join deleted successfully",
            data: null,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

    } catch (error: unknown) {
        const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
        consoleManager.error("Error in DELETE /api/joins/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: message || "Internal Server Error",
        }, { status: 500 });
    }
}
