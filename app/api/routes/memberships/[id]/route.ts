import { NextResponse } from "next/server";
import MembershipService from "../../../services/membershipServices";
import consoleManager from "../../../utils/consoleManager";

// Get a single package by ID (GET)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const memberships = await MembershipService.getMembershipById(id);

        if (!memberships) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Membership not found",
            }, { status: 404 });
        }

        consoleManager.log("Fetched membership:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "Membership fetched successfully",
            data: memberships,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });    
    } catch (error: any) {
        consoleManager.error("Error in GET /api/memberships/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Update a membership by ID (PUT)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.json(); // Get form data
        if (!id) throw new Error("Membership ID is required");

        let updateData: any = {};
        const userId = formData.userId;
        const plan_ref = formData.plan_ref;
        const usedDays = formData.usedDays;
        const usedNights = formData.usedNights;
        const totalDays = formData.totalDays;
        const totalNights = formData.totalNights;

        if (userId) updateData.userId = userId;
        if (plan_ref) updateData.plan_ref = plan_ref;
        if (usedDays) updateData.usedDays = usedDays;
        if (usedNights) updateData.usedNights = usedNights;
        if (totalDays) updateData.totalDays = totalDays;
        if (totalNights) updateData.totalNights = totalNights;

        // Update membership in database
        const updatedMembership = await MembershipService.updateMembership(id, updateData);
        consoleManager.log("Membership updated successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "Membership updated successfully",
            data: updatedMembership,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/memberships/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Delete a membership by ID (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) throw new Error("Membership ID is required");

        // Delete membership from DB
        await MembershipService.deleteMembership(id);
        consoleManager.log("Membership deleted successfully:", id);

        return NextResponse.json({
            statusCode: 200,
            message: "Membership deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/memberships/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
