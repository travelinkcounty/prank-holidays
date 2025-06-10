import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class JoinService {
    static joins: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initJoins() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for joins...");
        const joinsCollection = db.collection("joins");

        joinsCollection.onSnapshot((snapshot: any) => {
            this.joins = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Joins updated, count:", this.joins.length);
        });

        this.isInitialized = true;
    }

    // Get all joins (Uses cache unless forceRefresh is true)
    static async getAllJoins(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing joins from Firestore...");
            const snapshot = await db.collection("joins").orderBy("createdOn", "desc").get();
            this.joins = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached joins. No Firestore read.");
        }
        return this.joins;
    }

    // Add a new join with createdOn timestamp
    static async addJoin(joinData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newJoinRef = await db.collection("joins").add({
                ...joinData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New join added with ID:", newJoinRef.id);

            // Force refresh the cache after adding a new join
            await this.getAllJoins(true);

            return { id: newJoinRef.id, ...joinData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding join:", error);
            throw new Error("Failed to add join");
        }
    }

    // Get join by ID (fetches from cache first)
    static async getJoinById(joinId: string) {
        try {
            // Check if join exists in cache
            const cachedJoin = this.joins.find((join: any) => join.id === joinId);
            if (cachedJoin) {
                consoleManager.log("✅ Join fetched from cache:", joinId);
                return cachedJoin;
            }

            // Fetch from Firestore if not in cache
            const joinRef = db.collection("joins").doc(joinId);
            const doc = await joinRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Join not found:", joinId);
                return null;
            }

            consoleManager.log("✅ Join fetched from Firestore:", joinId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching join by ID:", error);
            throw new Error("Failed to fetch join");
        }
    }

    // Update join with updatedOn timestamp
    static async updateJoin(joinId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const joinRef = db.collection("joins").doc(joinId);
            await joinRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Join updated:", joinId);

            // Force refresh the cache after updating a join
            await this.getAllJoins(true);

            return { id: joinId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating join:", error);
            throw new Error("Failed to update join");
        }
    }

    // Delete join
    static async deleteJoin(joinId: string) {
        try {
            await db.collection("joins").doc(joinId).delete();
            consoleManager.log("✅ Join deleted:", joinId);

            // Force refresh the cache after deleting a join
            await this.getAllJoins(true);

            return { success: true, message: "Join deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting join:", error);
            throw new Error("Failed to delete join");
        }
    }
}

export default JoinService;
