import { NextResponse } from "next/server";
import AuthService from "../../services/authServices";
import consoleManager from "../../utils/consoleManager";
import { db } from "../../config/firebase";
import { UploadImage } from "../../controller/imageController";

// LOGIN
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;
        

        // Validate input
        if (!email || !password) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "INVALID_INPUT",
                errorMessage: "Email and password are required.",
            }, { status: 400 });
        }

        // Authenticate user
        await AuthService.loginUser(email, password);
        consoleManager.log("✅ User logged in");

        // Create response
        const response = NextResponse.json({
            statusCode: 201,
            message: "User logged in successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

        response.headers.append("Set-Cookie", `isAuth=true; Path=/; Secure; SameSite=Strict; Max-Age=86400`);

        return response;
    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/auth/login:", error.message);

        let statusCode = 401;
        let errorMessage = "Invalid email or password.";
        if (error.message.includes("User not found")) {
            errorMessage = "User not found. Please check your email.";
        } else if (error.message.includes("Incorrect password")) {
            errorMessage = "Incorrect password. Please try again.";
        }

        return NextResponse.json({
            statusCode,
            errorCode: "AUTH_FAILED",
            errorMessage,
        }, { status: statusCode });
    }
}

// REGISTER
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { email, password, ...extraData } = body;

        if (!email || !password) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "INVALID_INPUT",
                errorMessage: "Email and password are required.",
            }, { status: 400 });
        }

        // Register user
        const user = await AuthService.registerUser(email, password, extraData);
        consoleManager.log("✅ User registered:", user.uid);

        // Create response
        const response = NextResponse.json({
            statusCode: 201,
            message: "User registered successfully",
            data: user,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

        response.headers.append("Set-Cookie", `isAuth=true; Path=/; Secure; SameSite=Strict; Max-Age=86400`);

        return response;
    } catch (error: any) {
        consoleManager.error("❌ Error in PUT /api/auth/register:", error.message);
        return NextResponse.json({
            statusCode: 400,
            errorCode: "REGISTER_FAILED",
            errorMessage: error.message || "Registration failed.",
        }, { status: 400 });
    }
}

// DELETE (self-delete)
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { uid } = body;
        if (!uid) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "INVALID_INPUT",
                errorMessage: "User ID is required.",
            }, { status: 400 });
        }
        await AuthService.deleteUserByUid(uid);
        return NextResponse.json({
            statusCode: 200,
            message: "User deleted successfully",
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in DELETE /api/auth:", error.message);
        return NextResponse.json({
            statusCode: 400,
            errorCode: "DELETE_FAILED",
            errorMessage: error.message || "Delete failed.",
        }, { status: 400 });
    }
}

// PATCH (update user)
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { uid, password, email, phoneNumber, ...updateData } = body;
        if (!uid) {
            return NextResponse.json({ statusCode: 400, errorMessage: "User ID is required." }, { status: 400 });
        }
        // Only update Auth if Auth fields are present
        if (password || email || phoneNumber) {
            await AuthService.updateUser(uid, { ...(password && { password }), ...(email && { email }), ...(phoneNumber && { phoneNumber }) });
        }
        // Always update Firestore (profile fields)
        await AuthService.updateUserInFirestore(uid, updateData);
        return NextResponse.json({ statusCode: 200, message: "User updated successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ statusCode: 500, errorMessage: error.message }, { status: 500 });
    }
}

// GET (fetch users)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const all = searchParams.get("all");
        const uid = searchParams.get("uid");
        const email = searchParams.get("email");

        if (all) {
            // Fetch all users from Firestore
            const snapshot = await db.collection("users").get();
            const users = snapshot.docs.map((doc: any) => ({ uid: doc.id, ...doc.data() }));
            return NextResponse.json({
                statusCode: 200,
                data: users,
                errorCode: "NO",
                errorMessage: "",
            }, { status: 200 });
        } else if (uid) {
            // Fetch single user by uid
            const doc = await db.collection("users").doc(uid).get();
            if (!doc.exists) {
                return NextResponse.json({
                    statusCode: 404,
                    errorCode: "NOT_FOUND",
                    errorMessage: "User not found",
                }, { status: 404 });
            }
            return NextResponse.json({
                statusCode: 200,
                data: { uid: doc.id, ...doc.data() },
                errorCode: "NO",
                errorMessage: "",
            }, { status: 200 });
        } else if (email) {
            // Fetch single user by email
            const snapshot = await db.collection("users").where("email", "==", email).get();
            if (snapshot.empty) {
                return NextResponse.json({
                    statusCode: 404,
                    errorCode: "NOT_FOUND",
                    errorMessage: "User not found",
                }, { status: 404 });
            }
            const doc = snapshot.docs[0];
            return NextResponse.json({
                statusCode: 200,
                data: { uid: doc.id, ...doc.data() },
                errorCode: "NO",
                errorMessage: "",
            }, { status: 200 });
        } else {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Missing query parameter",
            }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
