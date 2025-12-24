# ElizaOS Plugin

## Overview

ElizaICP is built as an **ElizaOS plugin**, making it:
- Modular and reusable
- Easy to extend
- Compatible with the ElizaOS ecosystem

---

## Plugin Architecture

### Structure
```
packages/plugin-icp/
├── src/
│   ├── index.ts          # Plugin entry point
│   ├── commands/         # Telegram command handlers
│   ├── services/         # External integrations
│   └── middleware/       # Rate limiting, etc.
├── canisters/            # ICP smart contracts
└── prisma/               # Database schema
```

### Entry Point
```typescript
// index.ts
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Register commands
registerLinkIdentityCommand(bot);
registerCreateTokenCommand(bot);
registerStatusCommand(bot);

// Start
await bot.launch();
```

---

## Commands Exposed

| Command | Handler | Function |
|---------|---------|----------|
| `/start` | `index.ts` | Welcome message |
| `/help` | `index.ts` | Command list |
| `/create_token` | `createToken.ts` | Start token flow |
| `/confirm` | `createToken.ts` | Deploy token |
| `/cancel` | `createToken.ts` | Cancel creation |
| `/status` | `tokenStatus.ts` | Check token status |
| `/my_tokens` | `tokenStatus.ts` | List user's tokens |
| `/link_identity` | `linkIdentity.ts` | Link ICP principal |
| `/my_identity` | `linkIdentity.ts` | View linked identity |

---

## Services Layer

### ICP Service
```typescript
// services/icp/canisterClient.ts
export function getTokenFactoryActor(): TokenFactoryActor {
  const agent = initializeAgent();
  return Actor.createActor(idlFactory, { agent, canisterId });
}
```

### OpenAI Service
```typescript
// services/openaiService.ts
export async function generateTokenMetadata(name, symbol, desc) {
  const enhanced = await enhanceTokenDescription(...);
  const logoPrompt = await generateLogoPrompt(...);
  const logoUrl = await generateLogo(logoPrompt);
  return { description: enhanced, logoUrl, logoPrompt };
}
```

### Database Service
```typescript
// services/postgres.ts
export const db = {
  findOrCreateUser: async (telegramId) => {...},
  createTokenRequest: async (data) => {...},
  logEvent: async (type, payload) => {...},
};
```

---

## Extensibility

### Adding New Commands
```typescript
// commands/newCommand.ts
export function registerNewCommand(bot: Telegraf) {
  bot.command('new_command', async (ctx) => {
    // Your logic here
  });
}

// index.ts
import { registerNewCommand } from './commands/newCommand';
registerNewCommand(bot);
```

### Adding New Services
```typescript
// services/newService.ts
export async function doSomething() {
  // Your service logic
}
```

### Adding Middleware
```typescript
// middleware/newMiddleware.ts
export function newMiddleware() {
  return async (ctx, next) => {
    // Before handler
    await next();
    // After handler
  };
}
```

---

## Integration Points

### ElizaOS Core
- Uses Telegraf for Telegram (same as ElizaOS Telegram plugin)
- Follows plugin pattern: `register*Command(bot)`
- Compatible with ElizaOS memory system (via PostgreSQL)

### Future ElizaOS Integration
```typescript
// eliza.config.ts
export default {
  plugins: [
    '@elizaos/plugin-telegram',
    '@elizaos/plugin-icp',  // This plugin
  ],
};
```

---

## Why ElizaOS?

| Feature | Benefit |
|---------|---------|
| Plugin system | Modular architecture |
| Telegram support | Native bot framework |
| Multi-LLM | Swap AI models easily |
| TypeScript | Type safety |
| Open source | Community contributions |

---

## Contributing

1. Fork the repository
2. Create feature branch
3. Add your command/service
4. Submit pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
