# System Architecture

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐        ┌──────────────┐                     │
│   │   Telegram   │        │   Web Demo   │                     │
│   │     User     │        │   (Vercel)   │                     │
│   └──────┬───────┘        └──────┬───────┘                     │
│          │                       │                              │
└──────────┼───────────────────────┼──────────────────────────────┘
           │                       │
           ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌────────────────────────────────────────────┐               │
│   │           ElizaOS Plugin Bot               │               │
│   │          (Node.js / TypeScript)            │               │
│   │                                            │               │
│   │  ┌─────────────┐  ┌─────────────────────┐ │               │
│   │  │  Commands   │  │   Services          │ │               │
│   │  │ /create_tok │  │ - OpenAI (GPT-4)    │ │               │
│   │  │ /status     │  │ - PostgreSQL        │ │               │
│   │  │ /verify     │  │ - ICP Agent         │ │               │
│   │  └─────────────┘  └─────────────────────┘ │               │
│   └────────────────────────────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
           │                       │
           ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────────────────┐                             │
│   │     TokenFactory Canister    │◄─────── ICP Subnet          │
│   │         (Motoko)             │                             │
│   │                              │                             │
│   │  ┌────────────────────────┐  │                             │
│   │  │ create_meme_token()    │  │                             │
│   │  │ - Calls raw_rand()     │  │                             │
│   │  │ - Stores seed on-chain │  │                             │
│   │  │ - Returns request ID   │  │                             │
│   │  └────────────────────────┘  │                             │
│   │                              │                             │
│   │  ┌────────────────────────┐  │                             │
│   │  │   Stable Storage       │  │                             │
│   │  │   (Upgrade-Safe)       │  │                             │
│   │  └────────────────────────┘  │                             │
│   └──────────────┬───────────────┘                             │
│                  │                                              │
│                  ▼                                              │
│   ┌──────────────────────────────┐                             │
│   │   Management Canister        │                             │
│   │   (ic:aaaaa-aa)              │                             │
│   │   - raw_rand() ────────────────► 32 random bytes          │
│   └──────────────────────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Token Creation Flow

```
1. User: /create_token
         │
         ▼
2. Bot: Prompts for name, symbol, description
         │
         ▼
3. OpenAI: Enhances description + generates logo prompt
         │
         ▼
4. DALL·E: Generates token logo
         │
         ▼
5. PostgreSQL: Saves draft token request
         │
         ▼
6. User: /confirm
         │
         ▼
7. Canister: create_meme_token()
         │
         ▼
8. Management Canister: raw_rand() → 32 bytes
         │
         ▼
9. Canister: Stores token + seed in stable storage
         │
         ▼
10. Bot: Confirms with request ID + seed hash
```

## Components

### 1. Telegram Bot (Node.js)

**Location:** `packages/plugin-icp/src/`

| Component | Purpose |
|-----------|---------|
| `index.ts` | Bot initialization, command routing |
| `commands/` | Command handlers |
| `services/` | External integrations |
| `middleware/` | Rate limiting |

### 2. ICP Canister (Motoko)

**Location:** `packages/plugin-icp/canisters/token_factory/`

| Component | Purpose |
|-----------|---------|
| `main.mo` | Core canister logic |
| `types.mo` | Candid type definitions |
| `dfx.json` | Canister configuration |

### 3. Web Demo (Next.js)

**Location:** `apps/web/`

| Component | Purpose |
|-----------|---------|
| `app/` | Pages (landing, demo, verify) |
| `components/` | React components |
| `lib/` | API and utilities |

### 4. Database (PostgreSQL)

**Schema:** `packages/plugin-icp/prisma/schema.prisma`

| Table | Purpose |
|-------|---------|
| `User` | Telegram users + ICP principals |
| `TokenRequest` | Token creation requests |
| `Event` | Audit log |
| `ScheduledJob` | Timer-based tasks |

## Security Boundaries

```
┌────────────────────────────────────────────────────┐
│  TRUSTED (On-Chain)                                │
│  - Randomness generation (raw_rand)                │
│  - Token state storage                             │
│  - Seed immutability                               │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  SEMI-TRUSTED (Backend)                            │
│  - Bot command processing                          │
│  - AI metadata generation                          │
│  - Database storage                                │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  UNTRUSTED (User Input)                            │
│  - Token names/descriptions                        │
│  - Principal IDs                                   │
│  - Request parameters                              │
└────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, Tailwind |
| Bot | Node.js, Telegraf, TypeScript |
| AI | OpenAI GPT-4, DALL·E 3 |
| Database | PostgreSQL, Prisma |
| Blockchain | ICP, Motoko |
| Deployment | Vercel, Docker, GitHub Actions |
