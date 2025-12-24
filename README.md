<div align="center">
  <h1>ElizaICP</h1>
  <p><strong>AI-Powered Meme Tokens with Provable On-Chain Randomness</strong></p>
  
  <p>
  
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License"></a>
    <a href="https://internetcomputer.org"><img src="https://img.shields.io/badge/Built%20on-ICP-6366F1?style=flat-square" alt="Built on ICP"></a>
  </p>
</div>

---

## Overview

ElizaICP is a production-grade ElizaOS plugin that enables AI-powered meme token creation on the Internet Computer with **provable on-chain randomness**. Users interact via Telegram to create tokens with GPT-4 enhanced descriptions and DALL-E generated logos, while ICP's `raw_rand` ensures verifiable fairness.

## Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/typescript/3178C6" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/react/61DAFB" width="48" height="48" alt="React" />
      <br>React
    </td>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/nextdotjs/white" width="48" height="48" alt="Next.js" />
      <br>Next.js
    </td>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="48" height="48" alt="Tailwind" />
      <br>Tailwind
    </td>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/postgresql/4169E1" width="48" height="48" alt="PostgreSQL" />
      <br>PostgreSQL
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/prisma/2D3748" width="48" height="48" alt="Prisma" />
      <br>Prisma
    </td>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/openai/412991" width="48" height="48" alt="OpenAI" />
      <br>OpenAI
    </td>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/telegram/26A5E4" width="48" height="48" alt="Telegram" />
      <br>Telegram
    </td>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/docker/2496ED" width="48" height="48" alt="Docker" />
      <br>Docker
    </td>
    <td align="center" width="96">
      <img src="https://cdn.simpleicons.org/githubactions/2088FF" width="48" height="48" alt="GitHub Actions" />
      <br>CI/CD
    </td>
  </tr>
</table>

### Blockchain

| Technology | Purpose |
|------------|---------|
| **Internet Computer** | Smart contract platform with threshold cryptography |
| **Motoko** | Native ICP smart contract language |
| **raw_rand** | Cryptographically secure on-chain randomness |

## Architecture

```
User (Telegram)
      │
      ▼
┌─────────────────────┐
│  ElizaOS Plugin     │
│  (Node.js/TS)       │
│                     │
│  ┌───────────────┐  │
│  │ Commands      │  │
│  │ /create_token │  │
│  │ /verify       │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │ Services      │  │
│  │ - OpenAI      │  │
│  │ - PostgreSQL  │  │
│  │ - ICP Agent   │  │
│  └───────────────┘  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  TokenFactory       │
│  Canister (Motoko)  │
│                     │
│  - raw_rand()       │
│  - Stable Storage   │
│  - Timers           │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Web Demo (Next.js) │
│  - Token Explorer   │
│  - Verify UI        │
└─────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- DFX (ICP SDK)
- PostgreSQL

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/eliza-icp.git
cd eliza-icp

# Install plugin dependencies
cd packages/plugin-icp
pnpm install

# Install web app dependencies
cd ../../apps/web
pnpm install
```

### Configuration

```bash
# Plugin
cp packages/plugin-icp/.env.example packages/plugin-icp/.env

# Web app
cp apps/web/.env.example apps/web/.env.local
```

### Run Locally

```bash
# Terminal 1: Start ICP replica
dfx start --background

# Terminal 2: Deploy canister
cd packages/plugin-icp/canisters/token_factory
dfx deploy

# Terminal 3: Run bot
cd packages/plugin-icp
pnpm dev

# Terminal 4: Run web app
cd apps/web
pnpm dev
```

## Project Structure

```
eliza-icp/
├── packages/
│   └── plugin-icp/           # ElizaOS plugin
│       ├── src/              # TypeScript source
│       │   ├── commands/     # Telegram handlers
│       │   ├── services/     # External integrations
│       │   └── middleware/   # Rate limiting
│       ├── canisters/        # Motoko smart contracts
│       └── prisma/           # Database schema
│
├── apps/
│   └── web/                  # Next.js demo UI
│       ├── app/              # App Router pages
│       ├── components/       # React components
│       └── lib/              # Utilities
│
└── documentation/            # Judge-ready docs
```

## Features

### Provable Randomness

```motoko
// ICP's raw_rand generates 32 cryptographically secure bytes
let seed = await IC.raw_rand();
tokens.put(tokenId, { seed = seed, ... });
```

- Threshold BLS signatures from 2/3 subnet consensus
- Stored immutably on-chain
- Independently verifiable

### AI Integration

- GPT-4 enhanced token descriptions
- DALL-E 3 generated logos
- Rate-limited to prevent abuse

### Production Hardening

- Stable storage for upgrade safety
- Admin access control
- Structured rate limiting
- Comprehensive documentation

## Documentation

| Document | Purpose |
|----------|---------|
| [Judge Guide](./documentation/judge-guide.md) | Quick evaluation |
| [Architecture](./documentation/architecture.md) | Technical design |
| [Demo Guide](./documentation/demo.md) | Step-by-step walkthrough |
| [On-Chain Randomness](./documentation/onchain-randomness.md) | raw_rand explained |
| [Deployment](./documentation/deployment.md) | Full deployment guide |

## Deployment

### ICP Mainnet

```bash
dfx deploy --network ic
```

### Vercel (Web)

Connect repository, set environment variables, deploy.

### Docker (Bot)

```bash
docker build -t eliza-icp-bot .
docker run eliza-icp-bot
```

## Environment Variables

### Plugin

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | From @BotFather |
| `OPENAI_API_KEY` | OpenAI API key |
| `POSTGRES_URL` | Database connection |
| `INTERNET_COMPUTER_PRIVATE_KEY` | DFX identity |
| `TOKEN_FACTORY_CANISTER_ID` | Deployed canister ID |

### Web App

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_CANISTER_ID` | Canister ID |
| `NEXT_PUBLIC_TELEGRAM_URL` | Bot link |

## Security

- On-chain randomness cannot be manipulated
- Stable storage preserves state across upgrades
- Rate limiting prevents abuse
- See [SECURITY.md](./packages/plugin-icp/SECURITY.md) for full policy

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## License

MIT

---

<div align="center">
  <p>Built with Internet Computer and ElizaOS</p>
  <p>
    <a href="https://internetcomputer.org">ICP</a>
    ·
    <a href="https://elizaos.github.io/eliza/">ElizaOS</a>
    ·
    <a href="https://github.com/your-username/eliza-icp">GitHub</a>
  </p>
</div>


