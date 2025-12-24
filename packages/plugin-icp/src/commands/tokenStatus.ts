import { Telegraf, Context } from 'telegraf';
import { getTokenFactoryActor, fromOptional } from '../services/icp/canisterClient';
import { db } from '../services/postgres';

export function registerStatusCommand(bot: Telegraf) {
    bot.command('status', async (ctx: Context) => {
        const args = ctx.message!.text!.split(' ');

        if (args.length < 2) {
            return ctx.reply(
                '[USAGE] /status <request_id>\n\n' +
                'Example: `/status 1a2b3c4d-5678`',
                { parse_mode: 'Markdown' }
            );
        }

        const requestId = args[1];

        try {
            // Query canister
            const actor = getTokenFactoryActor();
            const response = await actor.get_token_status(requestId);

            const info = fromOptional(response.info);

            if (!info) {
                return ctx.reply(`[NOT FOUND] Token request \`${requestId}\` not found.`, {
                    parse_mode: 'Markdown',
                });
            }

            // Map status
            let statusLabel = '[PENDING]';
            let statusText = 'Pending';

            if ('minted' in info.status) {
                statusLabel = '[MINTED]';
                statusText = 'Minted';
            } else if ('failed' in info.status) {
                statusLabel = '[FAILED]';
                statusText = 'Failed';
            } else if ('draft' in info.status) {
                statusLabel = '[DRAFT]';
                statusText = 'Draft';
            }

            const mintedAt = fromOptional(info.mintedAt);

            await ctx.reply(
                `${statusLabel} **Token Status**\n\n` +
                `**Name:** ${info.name}\n` +
                `**Symbol:** ${info.symbol}\n` +
                `**Status:** ${statusText}\n` +
                `**Request ID:** \`${info.id}\`\n` +
                `**Created:** ${new Date(Number(info.createdAt) / 1000000).toLocaleString()}\n` +
                (mintedAt ? `**Minted:** ${new Date(Number(mintedAt) / 1000000).toLocaleString()}\n` : '') +
                `\n**Randomness Seed:** \`${Buffer.from(info.seed).toString('hex').slice(0, 16)}...\``,
                { parse_mode: 'Markdown' }
            );

        } catch (error) {
            console.error('Status check failed:', error);
            await ctx.reply(
                `[ERROR] Failed to get status: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    });

    bot.command('my_tokens', async (ctx: Context) => {
        try {
            const telegramId = BigInt(ctx.from!.id);
            const user = await db.findOrCreateUser(telegramId, ctx.from!.username);

            const tokens = await db.getUserTokens(user.id);

            if (tokens.length === 0) {
                return ctx.reply(
                    '[EMPTY] You haven\'t created any tokens yet.\n\n' +
                    'Use /create_token to get started!'
                );
            }

            let message = `**Your Tokens** (${tokens.length})\n\n`;

            for (const token of tokens.slice(0, 10)) {
                const statusLabel =
                    token.status === 'MINTED' ? '[MINTED]' :
                        token.status === 'FAILED' ? '[FAILED]' :
                            token.status === 'PENDING_ONCHAIN' ? '[PENDING]' : '[DRAFT]';

                message += `${statusLabel} **${token.name}** (${token.symbol})\n`;
                message += `   ID: \`${token.canisterTx || 'pending'}\`\n`;
                message += `   Status: ${token.status}\n\n`;
            }

            if (tokens.length > 10) {
                message += `\n_Showing latest 10 of ${tokens.length} tokens_`;
            }

            await ctx.reply(message, { parse_mode: 'Markdown' });

        } catch (error) {
            console.error('Failed to fetch user tokens:', error);
            await ctx.reply('[ERROR] Failed to load your tokens.');
        }
    });
}
