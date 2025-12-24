import { Telegraf, Context, Markup } from 'telegraf';
import { Principal } from '@dfinity/principal';
import { db } from '../services/postgres';
import { getTokenFactoryActor, fromOptional } from '../services/icp/canisterClient';

const WEB_URL = process.env.WEB_URL || 'https://eliza-icp.vercel.app';

export function registerLinkIdentityCommand(bot: Telegraf) {
    // /link_identity - Primary command to start linking flow
    bot.command('link_identity', async (ctx: Context) => {
        const telegramId = ctx.from!.id.toString();
        const linkUrl = `${WEB_URL}/link?tg=${telegramId}`;

        await ctx.reply(
            '**Link Your ICP Identity**\n\n' +
            'To create tokens, you need to connect your Internet Identity wallet.\n\n' +
            '**How it works:**\n' +
            '1. Click the button below\n' +
            '2. Authenticate with Internet Identity\n' +
            '3. Your wallet creates an on-chain proof\n' +
            '4. Return here for confirmation\n\n' +
            'No private keys are shared. Proof is stored on-chain.',
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('Connect Internet Identity', linkUrl)],
                    [Markup.button.callback('Check Link Status', 'check_link')],
                    [Markup.button.callback('How It Works', 'how_link_works')],
                ])
            }
        );
    });

    // Callback: Check link status
    bot.action('check_link', async (ctx) => {
        const telegramId = ctx.from!.id.toString();

        try {
            const actor = getTokenFactoryActor();
            const proof = await actor.get_link_proof(telegramId);
            const proofData = fromOptional(proof as [] | [{ telegram_id: string; principal: any; timestamp: bigint }]);

            if (proofData) {
                const principalText = proofData.principal.toText();
                const shortenedPrincipal = principalText.length > 20
                    ? `${principalText.slice(0, 10)}...${principalText.slice(-10)}`
                    : principalText;

                await ctx.answerCbQuery();
                await ctx.editMessageText(
                    '[SUCCESS] **Wallet Linked**\n\n' +
                    `Telegram ID: \`${telegramId}\`\n` +
                    `Principal: \`${shortenedPrincipal}\`\n\n` +
                    'You can now create tokens with /create_token',
                    {
                        parse_mode: 'Markdown',
                        ...Markup.inlineKeyboard([
                            [Markup.button.callback('Create Token', 'start_create')],
                            [Markup.button.callback('Unlink Wallet', 'unlink_wallet')],
                        ])
                    }
                );
            } else {
                await ctx.answerCbQuery('No wallet linked yet');
                await ctx.reply(
                    '[NOT LINKED] No wallet linked to this Telegram account.\n\n' +
                    'Use /link_identity to connect your wallet.'
                );
            }
        } catch (error) {
            console.error('Failed to check link status:', error);
            await ctx.answerCbQuery('Error checking status');
        }
    });

    // Callback: How it works
    bot.action('how_link_works', async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply(
            '**How Wallet Linking Works**\n\n' +
            '1. You click the link to open the web page\n' +
            '2. You authenticate with Internet Identity (ICP native auth)\n' +
            '3. Your browser calls the canister with your principal\n' +
            '4. The canister records `msg.caller` as cryptographic proof\n' +
            '5. Anyone can verify the link on-chain\n\n' +
            '**Why this is secure:**\n' +
            '- No private keys are shared\n' +
            '- Proof is stored in ICP canister (immutable)\n' +
            '- Uses ICP threshold signatures\n' +
            '- Backend cannot forge your identity',
            { parse_mode: 'Markdown' }
        );
    });

    // Callback: Unlink wallet
    bot.action('unlink_wallet', async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply(
            '[NOTICE] To unlink your wallet, you must:\n\n' +
            '1. Connect with Internet Identity on the web\n' +
            '2. Call the unlink function from your wallet\n\n' +
            'This ensures only you can unlink your own wallet.'
        );
    });

    // /set_principal - Fallback for advanced users with CLI
    bot.command('set_principal', async (ctx: Context) => {
        const text = (ctx.message as any)?.text || '';
        const args = text.split(' ');

        if (args.length < 2) {
            return ctx.reply(
                '[USAGE] `/set_principal <principal-id>`\n\n' +
                'This is for advanced users. We recommend using:\n' +
                '/link_identity for secure wallet connection.',
                { parse_mode: 'Markdown' }
            );
        }

        const principalText = args[1];

        try {
            // Validate principal format
            Principal.fromText(principalText);

            // Note: This only stores in DB, not on-chain proof
            const telegramId = BigInt(ctx.from!.id);
            await db.linkPrincipal(telegramId, principalText);

            await ctx.reply(
                `[NOTICE] Principal saved to database.\n\n` +
                `Principal: \`${principalText.slice(0, 20)}...\`\n\n` +
                'For full on-chain proof, use /link_identity instead.',
                { parse_mode: 'Markdown' }
            );

        } catch (error) {
            await ctx.reply(
                `[ERROR] Invalid Principal ID format.\n\n` +
                `Please check your Principal and try again.`
            );
        }
    });

    // /my_identity - Show linked identity
    bot.command('my_identity', async (ctx: Context) => {
        const telegramId = ctx.from!.id.toString();

        try {
            // First check on-chain proof
            const actor = getTokenFactoryActor();
            const proof = await actor.get_link_proof(telegramId);
            const proofData = fromOptional(proof as [] | [{ telegram_id: string; principal: any; timestamp: bigint }]);

            if (proofData) {
                const principalText = proofData.principal.toText();
                const timestamp = new Date(Number(proofData.timestamp) / 1_000_000);

                await ctx.reply(
                    '**Your ICP Identity**\n\n' +
                    `Principal: \`${principalText}\`\n\n` +
                    `Linked: ${timestamp.toISOString()}\n` +
                    `Proof: On-chain (canister verified)`,
                    { parse_mode: 'Markdown' }
                );
                return;
            }

            // Fallback to DB
            const telId = BigInt(ctx.from!.id);
            const user = await db.findOrCreateUser(telId, ctx.from!.username);

            if (user.icPrincipal) {
                await ctx.reply(
                    '**Your ICP Identity**\n\n' +
                    `Principal: \`${user.icPrincipal}\`\n\n` +
                    `Proof: Database only\n` +
                    'For on-chain proof, use /link_identity',
                    { parse_mode: 'Markdown' }
                );
            } else {
                await ctx.reply(
                    '[NOT LINKED] No identity linked.\n\n' +
                    'Use /link_identity to connect your wallet.'
                );
            }

        } catch (error) {
            console.error('Failed to fetch identity:', error);
            await ctx.reply('[ERROR] Failed to load identity info.');
        }
    });

    // /verify_link - Verify any user's link (for judges)
    bot.command('verify_link', async (ctx: Context) => {
        const text = (ctx.message as any)?.text || '';
        const args = text.split(' ');

        if (args.length < 2) {
            return ctx.reply(
                '[USAGE] `/verify_link <telegram_id>`\n\n' +
                'Verify any Telegram ID\'s wallet link on-chain.',
                { parse_mode: 'Markdown' }
            );
        }

        const telegramId = args[1];

        try {
            const actor = getTokenFactoryActor();
            const proof = await actor.get_link_proof(telegramId);
            const proofData = fromOptional(proof as [] | [{ telegram_id: string; principal: any; timestamp: bigint }]);

            if (proofData) {
                const principalText = proofData.principal.toText();
                const timestamp = new Date(Number(proofData.timestamp) / 1_000_000);

                await ctx.reply(
                    '[VERIFIED] **On-Chain Proof Found**\n\n' +
                    `Telegram ID: \`${telegramId}\`\n` +
                    `Principal: \`${principalText}\`\n` +
                    `Timestamp: ${timestamp.toISOString()}\n\n` +
                    'This proof is stored on-chain and publicly queryable.',
                    { parse_mode: 'Markdown' }
                );
            } else {
                await ctx.reply(
                    `[NOT FOUND] No on-chain proof for Telegram ID \`${telegramId}\``,
                    { parse_mode: 'Markdown' }
                );
            }
        } catch (error) {
            console.error('Failed to verify link:', error);
            await ctx.reply('[ERROR] Failed to verify link.');
        }
    });
}
