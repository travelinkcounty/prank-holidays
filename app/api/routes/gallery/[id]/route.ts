import { NextResponse } from "next/server";
import GalleryService from "../../../services/galleryServices";
import consoleManager from "../../../utils/consoleManager";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const gallery = await GalleryService.getGalleryById(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Gallery fetched successfully",
            data: gallery,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/gallery/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { title, image } = await req.json();

    try {
        const updatedGallery = await GalleryService.updateGallery(id, { title, image });
        return NextResponse.json({
            statusCode: 200,
            message: "Gallery updated successfully",
            data: updatedGallery,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in PUT /api/gallery/[id]:", error);
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
        await GalleryService.deleteGallery(id);
        return NextResponse.json({
            statusCode: 200,
            message: "Gallery deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in DELETE /api/gallery/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}   