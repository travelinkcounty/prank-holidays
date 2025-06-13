import { NextResponse } from "next/server";
import { UploadMultipleImages } from "../../controller/imageController";
import HotelService from "../../services/hotelServices";
import consoleManager from "../../utils/consoleManager";
import { v4 as uuidv4 } from 'uuid';


// Get all packages (GET)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const featured = searchParams.get("featured");

        if (featured == "true") {
            // Return only featured hotels
            const featuredHotels = await HotelService.getFeaturedHotels();
            consoleManager.log("Fetched featured hotels:", featuredHotels.length);

            return NextResponse.json({
                statusCode: 200,
                message: "Featured hotels fetched successfully",
                data: featuredHotels,
                errorCode: "NO",
                errorMessage: "",
            }, { status: 200 });
        } else {
            // Return all hotels
            const hotels = await HotelService.getAllHotels();
            consoleManager.log("Fetched all hotels:", hotels.length);

            return NextResponse.json({
                statusCode: 200,
                message: "Hotels fetched successfully",
                data: hotels,
                errorCode: "NO",
                errorMessage: "",
            }, { status: 200 });
        }
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/hotels:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new package (POST)
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const location = formData.get("location");
        const address = formData.get("address");
        const featured = formData.get("featured") === "true";
        const uid = uuidv4();
        const files = formData.getAll("image").slice(0, 5);

        if (!name || !files || files.length === 0) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Name, and at least one image are required",
            }, { status: 400 });
        }
        if (files.length > 5) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "TOO_MANY_IMAGES",
                errorMessage: "Maximum 5 images allowed.",
            }, { status: 400 });
        }

        // Upload images to Firebase Storage
        const imageUrls = await UploadMultipleImages(files);
        consoleManager.log("✅ Hotel images uploaded:", imageUrls);

        // Save hotel data in Firestore
        const newHotel = await HotelService.addHotel({
            uid,
            name,
            description,
            location,
            address,
            image: imageUrls, // Store as array
            featured,
        });

        consoleManager.log("✅ Hotel created successfully:", newHotel);

        return NextResponse.json({
            statusCode: 201,
            message: "Hotel added successfully",
            data: newHotel,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/hotels:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
