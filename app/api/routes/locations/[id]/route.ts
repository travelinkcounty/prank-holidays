import { NextResponse } from "next/server";
import LocationService from "../../../services/locationServices";
import consoleManager from "../../../utils/consoleManager";
import { ReplaceImage } from "../../../controller/imageController";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const location = await LocationService.getLocationById(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Location fetched successfully",
            data: location,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/locations/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const formData = await req.formData();
    const name = formData.get("name");
    const image = formData.get("image");
    const type = formData.get("type");

    const location = await LocationService.getLocationById(id);
    const oldImageUrl = location.image;

    const imageUrl = await ReplaceImage(image, oldImageUrl);

    try {
        const updatedLocation = await LocationService.updateLocation(id, { name, image: imageUrl, type });
        return NextResponse.json({
            statusCode: 200,
            message: "Location updated successfully",
            data: updatedLocation,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in PUT /api/locations/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        await LocationService.deleteLocation(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Location deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in DELETE /api/locations/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}   