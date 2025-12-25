<div align="center">
  
# 🚀 ElizaICP

### AI-Powered Meme Tokens with Provable On-Chain Randomness

[![Built on ICP](https://img.shields.io/badge/Built%20on-Internet%20Computer-6366F1?style=for-the-badge&logo=dfinity&logoColor=white)](https://internetcomputer.org)
[![ElizaOS Plugin](https://img.shields.io/badge/ElizaOS-Plugin-00D4AA?style=for-the-badge)](https://elizaos.github.io/eliza/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Testnet-Live-blue?style=flat-square" alt="Testnet">
</p>

*Create AI-powered meme tokens on the Internet Computer with GPT-4 enhanced descriptions, DALL-E generated logos, and verifiable on-chain randomness.*

</div>

---

## ⚡ Tech Stack

<table>
  <tr>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/typescript/3178C6" width="40" height="40" alt="TypeScript" /><br>
      <sub><b>TypeScript</b></sub>
    </td>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/react/61DAFB" width="40" height="40" alt="React" /><br>
      <sub><b>React</b></sub>
    </td>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/nextdotjs/000000" width="40" height="40" alt="Next.js" /><br>
      <sub><b>Next.js</b></sub>
    </td>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="40" height="40" alt="Tailwind" /><br>
      <sub><b>Tailwind</b></sub>
    </td>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/postgresql/4169E1" width="40" height="40" alt="PostgreSQL" /><br>
      <sub><b>PostgreSQL</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/prisma/2D3748" width="40" height="40" alt="Prisma" /><br>
      <sub><b>Prisma</b></sub>
    </td>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/openai/412991" width="40" height="40" alt="OpenAI" /><br>
      <sub><b>OpenAI</b></sub>
    </td>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/telegram/26A5E4" width="40" height="40" alt="Telegram" /><br>
      <sub><b>Telegram</b></sub>
    </td>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/docker/2496ED" width="40" height="40" alt="Docker" /><br>
      <sub><b>Docker</b></sub>
    </td>
    <td align="center" width="100">
      <img src="https://cdn.simpleicons.org/githubactions/2088FF" width="40" height="40" alt="GitHub Actions" /><br>
      <sub><b>CI/CD</b></sub>
    </td>
  </tr>
</table>

### 🔗 Blockchain

| Technology | Purpose |
|:----------:|:--------|
| <img src="https://cdn.simpleicons.org/dfinity/6366F1" width="20" height="20" /> **Internet Computer** | Smart contract platform with threshold cryptography |
| 📜 **Motoko** | Native ICP smart contract language |
| 🎲 **raw_rand** | Cryptographically secure on-chain randomness |

---

## Architecture

```mermaid
flowchart TB
    subgraph User["User Layer"]
        TG["Telegram Bot"]
        WEB["Web App - Next.js"]
    end

    subgraph Plugin["ElizaOS Plugin - Node.js/TypeScript"]
        direction LR
        subgraph Commands["Commands"]
            C1["/create_token"]
            C2["/link_identity"]
            C3["/status"]
            C4["/verify"]
        end
        subgraph Services["Services"]
            S1["OpenAI - GPT-4, DALL-E"]
            S2["PostgreSQL + Prisma"]
            S3["ICP Agent"]
            S4["Rate Limiter"]
        end
    end

    subgraph ICP["Internet Computer"]
        subgraph Canister["TokenFactory Canister - Motoko"]
            R["raw_rand"]
            ST["Stable Storage"]
            TM["Timers"]
        end
    end

    subgraph WebFeatures["Web Demo Features"]
        W1["Token Explorer"]
        W2["Verify Randomness"]
        W3["Wallet Linking"]
    end

    TG --> Plugin
    WEB --> Plugin
    Plugin --> Canister
    Canister --> WebFeatures
    
    style User fill:#1a1a2e,stroke:#6366f1,color:#fff
    style Plugin fill:#16213e,stroke:#00d4aa,color:#fff
    style ICP fill:#0f3460,stroke:#e94560,color:#fff
    style WebFeatures fill:#1a1a2e,stroke:#6366f1,color:#fff
```

### Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant T as Telegram Bot
    participant P as Plugin
    participant AI as OpenAI
    participant C as Canister
    participant DB as PostgreSQL

    U->>T: /create_token
    T->>P: Handle command
    P->>AI: Generate description & logo
    AI-->>P: Enhanced metadata
    P->>C: create_meme_token()
    C->>C: raw_rand()
    C-->>P: token_id + seed
    P->>DB: Store token request
    P-->>T: Success message
    T-->>U: Token created!
```

---

## ✨ Features

<table>
  <tr>
    <td>
      <h3>🎲 Provable Randomness</h3>
      <ul>
        <li>ICP's <code>raw_rand</code> generates 32 cryptographic bytes</li>
        <li>Threshold BLS signatures from 2/3 subnet consensus</li>
        <li>Stored immutably on-chain</li>
        <li>Independently verifiable</li>
      </ul>
    </td>
    <td>
      <h3>🤖 AI Integration</h3>
      <ul>
        <li>GPT-4 enhanced token descriptions</li>
        <li>DALL-E 3 generated logos</li>
        <li>Smart content generation</li>
        <li>Rate-limited to prevent abuse</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🔐 Production Hardening</h3>
      <ul>
        <li>Stable storage for upgrade safety</li>
        <li>Admin access control</li>
        <li>Structured rate limiting</li>
        <li>Comprehensive security docs</li>
      </ul>
    </td>
    <td>
      <h3>🔗 Wallet Linking</h3>
      <ul>
        <li>Internet Identity integration</li>
        <li>On-chain proof of ownership</li>
        <li>Cryptographically verified</li>
        <li>No private keys shared</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18+, pnpm, DFX (ICP SDK), PostgreSQL
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"  # Install DFX
npm install -g pnpm
```

### Installation

```bash
# Clone repository
git clone https://github.com/0xSupremeDev/ElizaICP.git
cd eliza-icp

# Install dependencies
cd packages/plugin-icp && pnpm install
cd ../../apps/web && pnpm install
```

### Configuration

```bash
cp packages/plugin-icp/.env.example packages/plugin-icp/.env
cp apps/web/.env.example apps/web/.env.local
# Edit .env files with your API keys
```

### Run Locally

```bash
# Terminal 1: Start ICP replica
dfx start --background

# Terminal 2: Deploy canister
cd packages/plugin-icp/canisters/token_factory && dfx deploy

# Terminal 3: Run bot
cd packages/plugin-icp && pnpm dev

# Terminal 4: Run web app
cd apps/web && pnpm dev
```

---

## 📁 Project Structure

```
eliza-icp/
├── 📦 packages/plugin-icp/      # ElizaOS Plugin
│   ├── src/
│   │   ├── commands/            # Telegram command handlers
│   │   ├── services/            # OpenAI, ICP, PostgreSQL
│   │   └── middleware/          # Rate limiting
│   ├── canisters/               # Motoko smart contracts
│   └── prisma/                  # Database schema
│
├── 🌐 apps/web/                 # Next.js Demo UI
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   └── lib/                     # Utilities
│
└── 📚 documentation/            # Technical docs
```

---

## 🔧 Environment Variables

### Plugin (`packages/plugin-icp/.env`)

| Variable | Description |
|:---------|:------------|
| `TELEGRAM_BOT_TOKEN` | From [@BotFather](https://t.me/botfather) |
| `OPENAI_API_KEY` | OpenAI API key |
| `POSTGRES_URL` | PostgreSQL connection string |
| `INTERNET_COMPUTER_PRIVATE_KEY` | DFX identity key |
| `TOKEN_FACTORY_CANISTER_ID` | Deployed canister ID |

### Web App (`apps/web/.env.local`)

| Variable | Description |
|:---------|:------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_CANISTER_ID` | Canister ID |
| `NEXT_PUBLIC_TELEGRAM_URL` | Bot link |

---

## 📖 Documentation

| Document | Description |
|:---------|:------------|
| [🧭 Judge Guide](./documentation/judge-guide.md) | Quick evaluation guide |
| [🏗️ Architecture](./documentation/architecture.md) | Technical design |
| [🎮 Demo Guide](./documentation/demo.md) | Step-by-step walkthrough |
| [🎲 On-Chain Randomness](./documentation/onchain-randomness.md) | `raw_rand` explained |
| [🚀 Deployment](./documentation/deployment.md) | Full deployment guide |
| [🔐 Security](./packages/plugin-icp/SECURITY.md) | Security policy |

---

## 🚀 Deployment

<details>
<summary><b>🌐 ICP Mainnet</b></summary>

```bash
dfx deploy --network ic
```
</details>

<details>
<summary><b>▲ Vercel (Web)</b></summary>

Connect repository, set environment variables, deploy.
</details>

<details>
<summary><b>🐳 Docker (Bot)</b></summary>

```bash
docker build -t eliza-icp-bot .
docker run eliza-icp-bot
```
</details>

---

## 🔒 Security

- ✅ On-chain randomness cannot be manipulated
- ✅ Stable storage preserves state across upgrades
- ✅ Rate limiting prevents abuse
- ✅ Input validation on all endpoints

See [SECURITY.md](./packages/plugin-icp/SECURITY.md) for full policy.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using Internet Computer and ElizaOS**

[![ICP](https://img.shields.io/badge/ICP-Docs-6366F1?style=flat-square&logo=dfinity)](https://internetcomputer.org/docs)
[![ElizaOS](https://img.shields.io/badge/ElizaOS-Docs-00D4AA?style=flat-square)](https://elizaos.github.io/eliza/)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/0xSupremeDev/ElizaICP)

</div>
