import { db, auth } from "../config/firebase";
import consoleManager from "../utils/consoleManager";

class AuthService {
    static async registerUser(email: string, password: string, extraData: any = {}) {
        try {
            // Create user in Firebase Auth (Admin SDK)
            const userRecord = await auth.createUser({ email, password, ...extraData });
            // Create user in Firestore users collection
            await db.collection("users").doc(userRecord.uid).set({
                email: userRecord.email,
                uid: userRecord.uid,
                ...extraData,
                createdOn: new Date().toISOString(),
            });
            consoleManager.log("✅ User registered and added to Firestore:", userRecord.uid);
            return { uid: userRecord.uid, email: userRecord.email };
        } catch (error: any) {
            consoleManager.error("❌ Error registering user:", error.message);
            throw new Error(error.message || "Registration failed.");
        }
    }

    static async loginUser(email: string, password: string) {
        throw new Error("Server-side login is not supported. Use client SDK for login.");
    }

    static async deleteUserByUid(uid: string) {
        try {
            await auth.deleteUser(uid);
            await db.collection("users").doc(uid).delete();
            consoleManager.log("✅ User deleted from Auth and Firestore:", uid);
            return { success: true };
        } catch (error: any) {
            consoleManager.error("❌ Error deleting user:", error.message);
            throw new Error(error.message || "Delete failed.");
        }
    }

    static async updateUser(uid: string, updateData: any) {
        try {
            const allowedFields: any = {};
            if (updateData.email) allowedFields.email = updateData.email;
            if (updateData.password) allowedFields.password = updateData.password;
            if (updateData.name) allowedFields.name = updateData.name;
            if (updateData.phone) allowedFields.phone = updateData.phone;
            if (updateData.address) allowedFields.address = updateData.address;
            if (updateData.image) allowedFields.image = updateData.image;
            if (updateData.status) allowedFields.status = updateData.status;
            if (updateData.disabled !== undefined) allowedFields.disabled = updateData.disabled;
            if (updateData.role) allowedFields.customClaims = { role: updateData.role };

            if (Object.keys(allowedFields).length > 0) {
                await auth.updateUser(uid, allowedFields);
            }
            consoleManager.log("✅ User updated in Auth:", uid);
        } catch (error: any) {
            consoleManager.error("❌ Error updating user in Auth:", error.message);
            throw new Error("Failed to update user in Auth: " + error.message);
        }
    }

    static async updateUserInFirestore(uid: string, updateData: any) {
        try {
            await db.collection("users").doc(uid).update({
                ...updateData,
                updatedOn: new Date().toISOString(),
            });
            consoleManager.log("✅ User updated in Firestore:", uid);
        } catch (error: any) {
            consoleManager.error("❌ Error updating user in Firestore:", error.message);
            throw new Error("Failed to update user in Firestore: " + error.message);
        }
    }
}

export default AuthService;
