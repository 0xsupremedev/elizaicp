import { Telegraf, Context } from 'telegraf';
import { Principal } from '@dfinity/principal';
import { db } from '../services/postgres';
import { getTokenFactoryActor, toOptional } from '../services/icp/canisterClient';
import { generateTokenMetadata } from '../services/openaiService';
import { seedToHex, hashSeed } from '../services/icp/randomness';

interface SessionData {
    step: 'name' | 'symbol' | 'description' | 'confirm';
    name?: string;
    symbol?: string;
    description?: string;
    draftId?: string;
}

const sessions = new Map<number, SessionData>();

export function registerCreateTokenCommand(bot: Telegraf) {
    bot.command('create_token', async (ctx: Context) => {
        const telegramId = BigInt(ctx.from!.id);

        // Find or create user
        const user = await db.findOrCreateUser(telegramId, ctx.from!.username);

        // Check if user has linked ICP principal
        if (!user.icPrincipal) {
            return ctx.reply(
                '[NOTICE] You need to link your ICP identity first.\n\nUse /link_identity to connect your wallet.'
            );
        }

        // Initialize session
        sessions.set(ctx.from!.id, { step: 'name' });

        await ctx.reply(
            'Let\'s create a meme token on ICP.\n\n' +
            'Step 1/3: What\'s the token name?\n' +
            '(Example: "Doge to the Moon")'
        );
    });

    // Handle text messages for token creation flow
    bot.on('text', async (ctx: Context) => {
        const userId = ctx.from!.id;
        const session = sessions.get(userId);

        if (!session) return; // Not in token creation flow

        const text = ctx.message!.text as string;

        switch (session.step) {
            case 'name':
                session.name = text;
                session.step = 'symbol';
                sessions.set(userId, session);

                await ctx.reply(
                    `[OK] Token Name: ${text}\n\n` +
                    'Step 2/3: What\'s the token symbol? (2-6 characters)\n' +
                    '(Example: "DOGE")'
                );
                break;

            case 'symbol':
                const symbol = text.toUpperCase();
                if (symbol.length < 2 || symbol.length > 6) {
                    return ctx.reply('[ERROR] Symbol must be 2-6 characters. Try again:');
                }

                session.symbol = symbol;
                session.step = 'description';
                sessions.set(userId, session);

                await ctx.reply(
                    `[OK] Symbol: ${symbol}\n\n` +
                    'Step 3/3: Describe your token (max 200 characters)\n' +
                    '(Example: "The ultimate dog coin for moon missions")'
                );
                break;

            case 'description':
                if (text.length > 200) {
                    return ctx.reply('[ERROR] Description too long. Keep it under 200 characters:');
                }

                session.description = text;
                session.step = 'confirm';
                sessions.set(userId, session);

                // Show preview and generate AI metadata
                await ctx.reply('[AI] Generating AI-powered metadata... This may take a moment.');

                try {
                    const telId = BigInt(ctx.from!.id);
                    const user = await db.findOrCreateUser(telId, ctx.from!.username);

                    // AI enhancement
                    const metadata = await generateTokenMetadata(
                        session.name!,
                        session.symbol!,
                        text
                    );

                    // Create draft in database
                    const draft = await db.createTokenRequest({
                        name: session.name!,
                        symbol: session.symbol!,
                        description: metadata.description,
                        requestorId: user.id,
                    });

                    session.draftId = draft.id;
                    sessions.set(userId, session);

                    // Send preview
                    await ctx.replyWithPhoto(
                        { url: metadata.logoUrl },
                        {
                            caption:
                                `**Token Preview**\n\n` +
                                `**Name:** ${session.name}\n` +
                                `**Symbol:** ${session.symbol}\n` +
                                `**Description:** ${metadata.description}\n\n` +
                                `_AI-enhanced description and logo_\n\n` +
                                `Ready to mint? Use /confirm to deploy on ICP.`,
                            parse_mode: 'Markdown',
                        }
                    );

                    // Log metadata in DB
                    await db.logEvent('TOKEN_CREATED', {
                        tokenRequestId: draft.id,
                        logoUrl: metadata.logoUrl,
                        logoPrompt: metadata.logoPrompt,
                    }, draft.id);

                } catch (error) {
                    console.error('Token metadata generation failed:', error);
                    await ctx.reply(
                        '[ERROR] Failed to generate metadata. Please try again with /create_token'
                    );
                    sessions.delete(userId);
                }
                break;
        }
    });

    bot.command('confirm', async (ctx: Context) => {
        const userId = ctx.from!.id;
        const session = sessions.get(userId);

        if (!session || session.step !== 'confirm' || !session.draftId) {
            return ctx.reply('[ERROR] No pending token to confirm. Use /create_token to start.');
        }

        await ctx.reply('[PENDING] Deploying token to ICP blockchain...');

        try {
            const telId = BigInt(ctx.from!.id);
            const user = await db.findOrCreateUser(telId, ctx.from!.username);
            const draft = await db.getTokenRequest(session.draftId);

            if (!draft || !user.icPrincipal) {
                throw new Error('Invalid draft or missing principal');
            }

            // Call canister
            const actor = getTokenFactoryActor();
            const response = await actor.create_meme_token({
                name: draft.name,
                symbol: draft.symbol,
                description: draft.description,
                logo: draft.logoCid || '',
                requester: Principal.fromText(user.icPrincipal),
                twitter: toOptional(draft.twitter),
                website: toOptional(draft.website),
                telegram: toOptional(draft.telegram),
            });

            // Store on-chain data
            const seedHex = seedToHex(response.seed);
            const seedHash = hashSeed(response.seed);

            await db.updateTokenRequest(draft.id, {
                status: 'PENDING_ONCHAIN',
                canisterTx: response.requestId,
                seedOnchain: seedHex,
            });

            await db.logEvent('TOKEN_SUBMITTED', {
                requestId: response.requestId,
                seedHash,
            }, draft.id);

            await ctx.reply(
                `[SUCCESS] Token deployed successfully!\n\n` +
                `Request ID: \`${response.requestId}\`\n` +
                `Seed Hash: \`${seedHash.slice(0, 16)}...\`\n\n` +
                `Finalizing on-chain... Check status with:\n` +
                `/status ${response.requestId}`,
                { parse_mode: 'Markdown' }
            );

            // Clean up session
            sessions.delete(userId);

        } catch (error) {
            console.error('Token deployment failed:', error);
            await ctx.reply(
                `[ERROR] Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `Try again with /create_token`
            );
            sessions.delete(userId);
        }
    });

    bot.command('cancel', async (ctx: Context) => {
        const userId = ctx.from!.id;
        if (sessions.has(userId)) {
            sessions.delete(userId);
            await ctx.reply('[CANCELLED] Token creation cancelled.');
        } else {
            await ctx.reply('No active token creation session.');
        }
    });
}
