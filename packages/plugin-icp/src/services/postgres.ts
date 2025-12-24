import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
    if (!prisma) {
        prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['error'],
        });
    }
    return prisma;
}

export async function disconnectDB(): Promise<void> {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }
}

// Helper functions for common operations
export const db = {
    // User operations
    async findOrCreateUser(telegramId: bigint, username?: string) {
        const client = getPrismaClient();
        return await client.user.upsert({
            where: { telegramId },
            update: { username, updatedAt: new Date() },
            create: { telegramId, username },
        });
    },

    async linkPrincipal(telegramId: bigint, icPrincipal: string) {
        const client = getPrismaClient();
        return await client.user.update({
            where: { telegramId },
            data: { icPrincipal },
        });
    },

    // Token request operations
    async createTokenRequest(data: {
        name: string;
        symbol: string;
        description: string;
        requestorId: string;
        logoCid?: string;
        twitter?: string;
        website?: string;
        telegram?: string;
    }) {
        const client = getPrismaClient();
        return await client.tokenRequest.create({
            data: {
                ...data,
                status: 'DRAFT',
            },
        });
    },

    async updateTokenRequest(id: string, data: Partial<{
        status: 'DRAFT' | 'PENDING_APPROVAL' | 'PENDING_ONCHAIN' | 'MINTED' | 'FAILED';
        seedOnchain: string;
        canisterTx: string;
        metadataHash: string;
        logoCid: string;
    }>) {
        const client = getPrismaClient();
        return await client.tokenRequest.update({
            where: { id },
            data,
        });
    },

    async getTokenRequest(id: string) {
        const client = getPrismaClient();
        return await client.tokenRequest.findUnique({
            where: { id },
            include: { requestor: true },
        });
    },

    async getUserTokens(userId: string) {
        const client = getPrismaClient();
        return await client.tokenRequest.findMany({
            where: { requestorId: userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    // Event logging
    async logEvent(type: string, payload: Record<string, unknown>, tokenRequestId?: string) {
        const client = getPrismaClient();
        return await client.event.create({
            data: {
                type: type as 'TOKEN_CREATED' | 'TOKEN_APPROVED' | 'TOKEN_SUBMITTED' | 'TOKEN_MINTED' | 'TOKEN_FAILED' | 'RANDOMNESS_GENERATED' | 'TIMER_SCHEDULED' | 'TIMER_EXECUTED' | 'ERROR',
                payload,
                tokenRequestId,
            },
        });
    },

    // Scheduled jobs
    async createScheduledJob(name: string, payload: Record<string, unknown>, executeAt: Date) {
        const client = getPrismaClient();
        return await client.scheduledJob.create({
            data: {
                name,
                payload,
                executeAt,
                status: 'PENDING',
            },
        });
    },

    async getPendingJobs() {
        const client = getPrismaClient();
        const now = new Date();
        return await client.scheduledJob.findMany({
            where: {
                status: 'PENDING',
                executeAt: { lte: now },
            },
            orderBy: { executeAt: 'asc' },
        });
    },

    async updateJobStatus(
        id: string,
        status: 'RUNNING' | 'COMPLETED' | 'FAILED',
        error?: string
    ) {
        const client = getPrismaClient();
        return await client.scheduledJob.update({
            where: { id },
            data: {
                status,
                lastError: error,
                completedAt: status === 'COMPLETED' || status === 'FAILED'
                    ? new Date()
                    : undefined,
            },
        });
    },
};

export default getPrismaClient;
