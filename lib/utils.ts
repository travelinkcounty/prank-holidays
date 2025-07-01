import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique user ID with the format TLC(MM)(count)
 * @param lastId The last TLC user ID in the database (e.g., TLC0605)
 * @returns {string} The generated unique user ID
 */
export function generateTLCUserId(lastId?: string): string {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 01-12
  let count = 1;

  if (lastId && lastId.startsWith('TLC')) {
    const lastMonth = lastId.substring(3, 5);
    const lastCount = parseInt(lastId.substring(5), 10);
    if (lastMonth === month && !isNaN(lastCount)) {
      count = lastCount + 1;
    }
  }

  const countStr = count.toString().padStart(2, '0');
  return `TLC${month}${countStr}`;
}
