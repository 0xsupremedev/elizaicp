# @elizaos/plugin-icp

> ElizaOS plugin for Internet Computer Protocol with on-chain randomness and AI-powered meme token creation

[![CI](https://github.com/asDNSk/plugin-icp/workflows/CI/badge.svg)](https://github.com/asDNSk/plugin-icp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **AI-Powered Token Creation** - Generate meme tokens with GPT-4 enhanced descriptions and DALL·E logos
- 🎲 **Provable Randomness** - Uses ICP's `raw_rand` management canister for cryptographically secure fairness
- ⏰ **Automated Scheduling** - Leverage ICP timers for scheduled tasks and claim windows
- 🔗 **Telegram Interface** - User-friendly bot for token creation and management
- 💾 **Persistent State** - PostgreSQL database for off-chain metadata and audit logs
- 🌐 **Full Stack Decentralized** - Canisters run 100% on-chain with ElizaOS orchestration

## Architecture

```
┌─────────────┐
│ Telegram    │
│ User        │
└──────┬──────┘
       │ Commands
       ▼
┌─────────────────────┐      ┌──────────────┐
│ ElizaOS Plugin      │─────▶│ OpenAI API   │
│ (Node.js/TypeScript)│      │ (GPT-4/DALL·E)│
└──────┬──────┬───────┘      └──────────────┘
       │      │
       │      ▼
       │  ┌──────────┐
       │  │PostgreSQL│
       │  └──────────┘
       │
       ▼
┌──────────────────────────┐
│ ICP Blockchain           │
│  ┌────────────────────┐  │
│  │ TokenFactory       │  │
│  │ Canister (Motoko)  │  │
│  └────────┬───────────┘  │
│           │              │
│           ▼              │
│  ┌────────────────────┐  │
│  │ Management Canister│  │
│  │ (raw_rand)         │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- DFX SDK (for canister deployment)
- PostgreSQL 15+
- Telegram Bot Token
- OpenAI API Key

### Installation

1. **Clone and install dependencies:**

```bash
cd eliza/packages/plugin-icp
pnpm install
```

2. **Set up environment:**

```bash
cp .env.example .env
# Edit .env with your credentials
```

Required variables:
```env
INTERNET_COMPUTER_PRIVATE_KEY=<your-ed25519-key>
TOKEN_FACTORY_CANISTER_ID=<set-after-deploy>
OPENAI_API_KEY=sk-...
TELEGRAM_BOT_TOKEN=123456789:ABC...
POSTGRES_URL=postgresql://...
```

3. **Run database migrations:**

```bash
pnpm generate
pnpm migrate
```

4. **Deploy canisters (local development):**

```bash
./scripts/dev.sh
```

Or for production:

```bash
./scripts/deploy_canisters.sh ic deployer
```

5. **Start the bot:**

```bash
pnpm build
pnpm start
```

## Usage

### Telegram Commands

- `/start` - Welcome message and command list
- `/link_identity` - Connect your ICP Principal
- `/create_token` - Start token creation flow
- `/status <id>` - Check token status
- `/my_tokens` - List your tokens
- `/my_identity` - View linked Principal

### Token Creation Flow

1. User runs `/create_token`
2. Bot prompts for name, symbol, description
3. AI enhances description and generates logo
4. User confirms preview
5. Plugin calls `TokenFactory.create_meme_token()`
6. Canister calls `raw_rand()` for provable seed
7. Token is minted on-chain

## On-Chain Randomness

The plugin uses ICP's `raw_rand` from the management canister to provide cryptographically secure randomness for:

- **Fair token allocation** (lotteries, airdrops)
- **Deterministic asset generation** (reproducible from seed)
- **Nonce generation** for signatures

Example (Motoko):

```motoko
import IC "ic:aaaaa-aa";

public shared func create_token() : async CreateResponse {
  let seed = await IC.raw_rand(); // 32 secure bytes
  // Use seed for provable fairness
}
```

The 32-byte seed is stored on-chain and can be verified by third parties.

## Timers

ICP's timer system enables automated tasks:

```motoko
import Timer "mo:base/Timer";

// Recurring task every hour
ignore Timer.recurringTimer<system>(#seconds 3600, cleanupOldDrafts);
```

Use cases:
- Close claim windows
- Scheduled mints
- Periodic cleanup

## Deployment

### Local Development

```bash
./scripts/dev.sh
```

### Production (IC Mainnet)

1. **Export deployer identity:**

```bash
dfx identity export deployer > deployer.pem
```

2. **Deploy canisters:**

```bash
./scripts/deploy_canisters.sh ic deployer
```

3. **Build and deploy plugin:**

```bash
docker build -t plugin-icp .
docker push your-registry/plugin-icp
```

4. **Deploy to hosting platform:**

Railway / Fly.io / Cloud Run with environment variables set.

### CI/CD

GitHub Actions workflows provided:

- `.github/workflows/ci.yml` - Test and build
- `.github/workflows/deploy_canisters.yml` - Deploy to IC

Required secrets:
- `DFX_IDENTITY_PEM` - Deployer identity
- `GITHUB_TOKEN` - For Docker registry (auto-provided)

## Security

- ✅ Never commit `.env` or PEM files
- ✅ Use `raw_rand` for all fairness-critical operations
- ✅ Store randomness seeds on-chain for verification
- ✅ Implement pre/post upgrade hooks for timer persistence
- ✅ Monitor canister cycles and set up auto-top-ups

## Testing

```bash
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests (requires local replica)
```

## Documentation

- [ICP Randomness](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/advanced-features/randomness)
- [ICP Timers](https://internetcomputer.org/docs/current/developer-docs/backend/periodic-tasks)
- [ElizaOS Docs](https://elizaos.github.io/eliza/)
- [Motoko Guide](https://internetcomputer.org/docs/current/motoko/main/getting-started/motoko-introduction)

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Support

- GitHub Issues: [asDNSk/plugin-icp](https://github.com/asDNSk/plugin-icp/issues)
- Twitter: [@asDNSk](https://twitter.com/asDNSk)
- ICP Forum: [forum.dfinity.org](https://forum.dfinity.org)
