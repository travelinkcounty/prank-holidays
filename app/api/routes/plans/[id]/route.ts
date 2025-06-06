import { NextResponse } from "next/server";
import PlanService from "../../../services/planServices";
import consoleManager from "../../../utils/consoleManager";
import { ReplaceImage } from "../../../controller/imageController";


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const plan = await PlanService.getPlanById(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Plan fetched successfully",
            data: plan,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/plans/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const price = formData.get("price");
        const nights = formData.get("nights");
        const days = formData.get("days");
        const image = formData.get("image");
        const location = formData.get("location");

        const plan = await PlanService.getPlanById(id);
        const oldImageUrl = plan.image;
        
        let imageUrl = oldImageUrl;
        if (image && typeof image !== "string") {
            imageUrl = await ReplaceImage(image, oldImageUrl);
        }
        const updatedPlan = await PlanService.updatePlan(id, { name, description, price, image: imageUrl, location, days, nights });
        
        return NextResponse.json({
            statusCode: 200,
            message: "Plan updated successfully",
            data: updatedPlan,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/plans/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const deletedPlan = await PlanService.deletePlan(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Plan deleted successfully",
            data: deletedPlan,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/plans/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}       