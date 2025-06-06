import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";

class CountService {
  static counts: { [key: string]: number } = {
    users: 0,
    packages: 0,
    leads: 0,
    testimonials: 0,
    services: 0,
    locations: 0,
    plans: 0,
    memberships: 0,
  };
  static isInitialized = false;

  static async initCounts() {
    if (this.isInitialized) return;

    const collections = ["users", "packages", "leads", "testimonials", "services", "locations", "plans", "memberships"];

    for (let collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).get();
        this.counts[collectionName] = snapshot.size; // ✅ `snapshot.size` se count milta hai
      } catch (error: any) {
        consoleManager.error(`❌ Error getting count for ${collectionName}:`, error.message);
        this.counts[collectionName] = 0;
      }
    }

    this.isInitialized = true;
  }

  static getCounts() {
    consoleManager.log("Returning cached counts");
    return this.counts;
  }

  static async refreshCounts() {
    this.isInitialized = false;
    await this.initCounts();
    return this.counts;
  }
}

export default CountService;
