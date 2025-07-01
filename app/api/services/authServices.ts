import { db, auth } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import { generateTLCUserId } from "../../../lib/utils";

class AuthService {
    static async registerUser(email: string, password: string, extraData: any = {}) {
        try {
            // Generate unique TLC ID (like UserService)
            const now = new Date();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            // Query users ordered by createdOn desc, filter by tlcId prefix
            const snapshot = await db.collection("users")
                .where("tlcId", ">=", `TLC${month}`)
                .where("tlcId", "<", `TLC${month}99`)
                .limit(1)
                .get();
            let lastTlcId = undefined;
            if (!snapshot.empty) {
                lastTlcId = snapshot.docs[0].data().tlcId;
            }
            const uniqueTLCId = generateTLCUserId(lastTlcId);

            // Create user in Firebase Auth (Admin SDK)
            const userRecord = await auth.createUser({ email, password, ...extraData });
            // Create user in Firestore users collection
            await db.collection("users").doc(userRecord.uid).set({
                email: userRecord.email,
                uid: userRecord.uid,
                ...extraData,
                tlcId: uniqueTLCId,
                createdOn: new Date().toISOString(),
            });
            consoleManager.log("✅ User registered and added to Firestore:", userRecord.uid, "TLC ID:", uniqueTLCId);
            return { uid: userRecord.uid, email: userRecord.email, tlcId: uniqueTLCId };
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

    static async getUserById(uid: string) {
        try {
            const userDoc = await db.collection("users").doc(uid).get();
            if (!userDoc.exists) return null;
            return { id: userDoc.id, ...userDoc.data() };
        } catch (error: any) {
            consoleManager.error("❌ Error fetching user by ID in AuthService:", error.message);
            throw new Error(error.message || "Failed to fetch user by ID.");
        }
    }
}

export default AuthService;
