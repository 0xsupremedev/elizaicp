import { Context } from 'telegraf';

interface RateLimit {
    count: number;
    resetAt: number;
}

const userLimits = new Map<string, RateLimit>();

export const LIMITS = {
    CREATE_TOKEN: { max: 3, windowMs: 3600000 }, // 3 per hour
    AI_GENERATION: { max: 10, windowMs: 3600000 }, // 10 per hour  
    STATUS_CHECK: { max: 30, windowMs: 60000 }, // 30 per minute
    LINK_IDENTITY: { max: 5, windowMs: 3600000 }, // 5 per hour
};

/**
 * Rate limiting middleware for Telegram bot commands
 * 
 * Prevents abuse of:
 * - OpenAI API (cost drain)
 * - ICP canister calls (cycles drain)
 * - Database queries
 * 
 * @param limitType - Type of rate limit to apply
 */
export function rateLimiter(
    limitType: keyof typeof LIMITS
) {
    return async (ctx: Context, next: () => Promise<void>) => {
        const userId = ctx.from?.id;
        if (!userId) return next();

        const key = `${userId}:${limitType}`;
        const now = Date.now();
        const limit = LIMITS[limitType];

        let userLimit = userLimits.get(key);

        // Initialize or reset if window expired
        if (!userLimit || now > userLimit.resetAt) {
            userLimit = { count: 0, resetAt: now + limit.windowMs };
            userLimits.set(key, userLimit);
        }

        // Check if limit exceeded
        if (userLimit.count >= limit.max) {
            const waitMinutes = Math.ceil((userLimit.resetAt - now) / 60000);
            await ctx.reply(
                `⏱️ **Rate Limit Exceeded**\n\n` +
                `You've reached the limit for this action.\n` +
                `Please try again in **${waitMinutes} minute(s)**.`,
                { parse_mode: 'Markdown' }
            );
            return; // Don't call next()
        }

        // Increment counter and proceed
        userLimit.count++;
        await next();
    };
}

/**
 * Cleanup old rate limit entries (run periodically)
 */
export function cleanupRateLimits() {
    const now = Date.now();
    for (const [key, limit] of userLimits.entries()) {
        if (now > limit.resetAt + 3600000) { // Keep for 1 extra hour
            userLimits.delete(key);
        }
    }
}

// Cleanup every 10 minutes
setInterval(cleanupRateLimits, 600000);
