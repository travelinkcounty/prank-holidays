import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class MembershipService {
    static memberships: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initMemberships() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for memberships...");
        const membershipsCollection = db.collection("memberships");

        membershipsCollection.onSnapshot((snapshot: any) => {
            this.memberships = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Memberships updated, count:", this.memberships.length);
        });

        this.isInitialized = true;
    }

    // Get all memberships (Uses cache unless forceRefresh is true)
    static async getAllMemberships(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing memberships from Firestore...");
            const snapshot = await db.collection("memberships").orderBy("createdOn", "desc").get();
            this.memberships = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached memberships. No Firestore read.");
        }
        return this.memberships;
    }

    static async getMembershipByUserId(userId: string) {
        try {   
            const snapshot = await db.collection("memberships").where("userId", "==", userId).get();
            return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            consoleManager.error("❌ Error fetching membership by user ID:", error);
            throw new Error("Failed to fetch membership by user ID");
        }
    }       

    // Add a new membership with createdOn timestamp
    static async addMembership(membershipData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newMembershipRef = await db.collection("memberships").add({
                ...membershipData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New membership added with ID:", newMembershipRef.id);

            // Force refresh the cache after adding a new membership
            await this.getAllMemberships(true);

            return { id: newMembershipRef.id, ...membershipData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding membership:", error);
            throw new Error("Failed to add membership");
        }
    }

    // Get membership by ID (fetches from cache first)
    static async getMembershipById(membershipId: string) {
        try {
            // Check if membership exists in cache
            const cachedMembership = this.memberships.find((m: any) => m.id === membershipId);
            if (cachedMembership) {
                consoleManager.log("✅ Membership fetched from cache:", membershipId);
                return cachedMembership;
            }

            // Fetch from Firestore if not in cache
            const membershipRef = db.collection("memberships").doc(membershipId);
            const doc = await membershipRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Membership not found:", membershipId);
                return null;
            }

            consoleManager.log("✅ Membership fetched from Firestore:", membershipId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching membership by ID:", error);
            throw new Error("Failed to fetch membership");
        }
    }

    // Update membership with updatedOn timestamp
    static async updateMembership(membershipId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const membershipRef = db.collection("memberships").doc(membershipId);
            await membershipRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Membership updated:", membershipId);

            // Force refresh the cache after updating a membership
            await this.getAllMemberships(true);

            return { id: membershipId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating membership:", error);
            throw new Error("Failed to update membership");
        }
    }

    // Delete membership
    static async deleteMembership(membershipId: string) {
        try {
            await db.collection("memberships").doc(membershipId).delete();
            consoleManager.log("✅ Membership deleted:", membershipId);

            // Force refresh the cache after deleting a membership
            await this.getAllMemberships(true);

            return { success: true, message: "Membership deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting membership:", error);
            throw new Error("Failed to delete membership");
        }
    }
}

export default MembershipService;
