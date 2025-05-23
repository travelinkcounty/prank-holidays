import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class PackageService {
    static packages: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initPackages() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for packages...");
        const packagesCollection = db.collection("packages");

        packagesCollection.onSnapshot((snapshot: any) => {
            this.packages = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Packages updated, count:", this.packages.length);
        });

        this.isInitialized = true;
    }

    // Get all packages (Uses cache unless forceRefresh is true)
    static async getAllPackages(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing packages from Firestore...");
            const snapshot = await db.collection("packages").orderBy("createdOn", "desc").get();
            this.packages = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached packages. No Firestore read.");
        }
        return this.packages;
    }

    // Add a new package with createdOn timestamp
    static async addPackage(packageData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newPackageRef = await db.collection("packages").add({
                ...packageData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New package added with ID:", newPackageRef.id);

            // Force refresh the cache after adding a new package
            await this.getAllPackages(true);

            return { id: newPackageRef.id, ...packageData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding package:", error);
            throw new Error("Failed to add package");
        }
    }

    // Get package by ID (fetches from cache first)
    static async getPackageById(packageId: string) {
        try {
            // Check if package exists in cache
            const cachedPackage = this.packages.find((p: any) => p.id === packageId);
            if (cachedPackage) {
                consoleManager.log("✅ Package fetched from cache:", packageId);
                return cachedPackage;
            }

            // Fetch from Firestore if not in cache
            const packageRef = db.collection("packages").doc(packageId);
            const doc = await packageRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Package not found:", packageId);
                return null;
            }

            consoleManager.log("✅ Package fetched from Firestore:", packageId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching package by ID:", error);
            throw new Error("Failed to fetch package");
        }
    }

    // Update package with updatedOn timestamp
    static async updatePackage(packageId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const packageRef = db.collection("packages").doc(packageId);
            await packageRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Package updated:", packageId);

            // Force refresh the cache after updating a package
            await this.getAllPackages(true);

            return { id: packageId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating package:", error);
            throw new Error("Failed to update package");
        }
    }

    // Delete package
    static async deletePackage(packageId: string) {
        try {
            await db.collection("packages").doc(packageId).delete();
            consoleManager.log("✅ Package deleted:", packageId);

            // Force refresh the cache after deleting a package
            await this.getAllPackages(true);

            return { success: true, message: "Package deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting package:", error);
            throw new Error("Failed to delete package");
        }
    }
}

export default PackageService;
