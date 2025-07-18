import { RateLimiterPrisma } from "rate-limiter-flexible";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 5;
const PRO_POINTS = 100;
const DURATION = 30 * 24 * 60 * 60; // 30 days
const GENERATION_COST = 1;

export async function getUsageTracker() {
    const { has } = await auth();
    const hasProAccess = has({ plan: "pro"});

    const usageTracker = new RateLimiterPrisma({
        storeClient: prisma,
        tableName: "Usage",
        points: hasProAccess ? PRO_POINTS : FREE_POINTS,
        duration: DURATION,
    });

    return usageTracker;
};

export async function consumeCredits() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const usageTracker = await getUsageTracker();
    const result = await usageTracker.consume(userId, GENERATION_COST);
    return result;
};

// export async function consumeCredits() {
//     const { userId } = await auth();

//     console.log("Authenticated UserId:", userId);  // Confirm auth is good

//     if (!userId) throw new Error("User not authenticated");

//     const usageTracker = await getUsageTracker();
//     console.log("UsageTracker initialized:", usageTracker);  // Confirm initialization

//     try {
//         const result = await usageTracker.consume(userId);
//         console.log("Usage consumption result:", result);  // Confirm consume works
//         return result;
//     } catch (error) {
//         console.error("Error during consume:", error);  // Critical error logging
//         throw error;
//     }
// };

export async function getUsageStatus() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const usageTracker = await getUsageTracker();
    const result = await usageTracker.get(userId);
    return result;
}