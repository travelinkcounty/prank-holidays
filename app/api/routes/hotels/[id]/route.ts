import { NextResponse } from "next/server";
import HotelService from "../../../services/hotelServices";
import consoleManager from "../../../utils/consoleManager";
import { UploadMultipleImages } from "../../../controller/imageController";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const hotel = await HotelService.getHotelById(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Hotel fetched successfully",
            data: hotel,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/hotels/[id]:", error);
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
    const description = formData.get("description");
    const location = formData.get("location");
    const address = formData.get("address");
    const featured = formData.get("featured") === "true";

    // Get existing image URLs to keep
    const existingImages = formData.getAll("existingImages").filter(Boolean);
    // Get new images to upload
    const newImages = formData.getAll("image").slice(0, 5 - existingImages.length);
    const newImageUrls = await UploadMultipleImages(newImages);
    // Combine and limit to 5
    const imageArray = [...existingImages, ...newImageUrls].slice(0, 5);

    try {
        const updatedHotel = await HotelService.updateHotel(id, { name, image: imageArray, description, location, address, featured });
        return NextResponse.json({
            statusCode: 200,
            message: "Hotel updated successfully",
            data: updatedHotel,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in PUT /api/hotels/[id]:", error);
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
        await HotelService.deleteHotel(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Hotel deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in DELETE /api/hotels/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}   