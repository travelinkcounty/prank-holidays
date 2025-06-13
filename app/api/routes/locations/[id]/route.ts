import { NextResponse } from "next/server";
import LocationService from "../../../services/locationServices";
import consoleManager from "../../../utils/consoleManager";
import { UploadMultipleImages } from "../../../controller/imageController";

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
    const type = formData.get("type");
    const featured = formData.get("featured") === "true";

    // Get existing image URLs to keep
    const existingImages = formData.getAll("existingImages").filter(Boolean);
    // Get new images to upload
    const newImages = formData.getAll("image").slice(0, 5 - existingImages.length);
    const newImageUrls = await UploadMultipleImages(newImages);
    // Combine and limit to 5
    const imageArray = [...existingImages, ...newImageUrls].slice(0, 5);

    try {
        const updatedLocation = await LocationService.updateLocation(id, { name, image: imageArray, type, featured });
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