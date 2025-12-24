import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { disconnectDB } from './services/postgres';
import { registerCreateTokenCommand } from './commands/createToken';
import { registerStatusCommand } from './commands/tokenStatus';
import { registerLinkIdentityCommand } from './commands/linkIdentity';

// Validate environment
const requiredEnv = [
    'TELEGRAM_BOT_TOKEN',
    'INTERNET_COMPUTER_PRIVATE_KEY',
    'TOKEN_FACTORY_CANISTER_ID',
    'OPENAI_API_KEY',
    'POSTGRES_URL',
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.error(`[ERROR] Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Register command handlers
registerLinkIdentityCommand(bot);
registerCreateTokenCommand(bot);
registerStatusCommand(bot);

// Start command
bot.command('start', async (ctx) => {
    await ctx.reply(
        '**Welcome to ICP Meme Token Creator**\n\n' +
        'Create AI-powered meme tokens on the Internet Computer with provable on-chain randomness.\n\n' +
        '**Commands:**\n' +
        '/link_identity - Connect your ICP wallet\n' +
        '/create_token - Create a new token\n' +
        '/status <id> - Check token status\n' +
        '/my_tokens - View your tokens\n' +
        '/my_identity - View linked Principal\n\n' +
        'Powered by ElizaOS & ICP',
        { parse_mode: 'Markdown' }
    );
});

// Help command
bot.command('help', async (ctx) => {
    await ctx.reply(
        '**ICP Token Creator Help**\n\n' +
        '**Getting Started:**\n' +
        '1. Link your ICP identity with /link_identity\n' +
        '2. Create a token with /create_token\n' +
        '3. Follow the interactive prompts\n' +
        '4. Confirm to deploy on ICP\n\n' +
        '**Features:**\n' +
        '- AI-enhanced descriptions\n' +
        '- DALL-E generated logos\n' +
        '- Provable on-chain randomness\n' +
        '- Deployed to Internet Computer\n\n' +
        'Questions? Check the docs or /start',
        { parse_mode: 'Markdown' }
    );
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('[ERROR] An error occurred. Please try again.');
});

// Graceful shutdown
process.once('SIGINT', async () => {
    console.log('SIGINT received. Shutting down...');
    await bot.stop('SIGINT');
    await disconnectDB();
    process.exit(0);
});

process.once('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down...');
    await bot.stop('SIGTERM');
    await disconnectDB();
    process.exit(0);
});

// Start bot
async function main() {
    console.log('[BOT] Starting ICP ElizaOS Plugin Bot...');

    // Launch bot
    await bot.launch();

    console.log('[OK] Bot is running!');
    console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Network: ${process.env.DFX_NETWORK || 'local'}`);
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
