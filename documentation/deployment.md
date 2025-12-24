# Deployment Guide

## Network Configuration

```
Network: Internet Computer (test cycles)
Command: dfx deploy --network ic
```

We use test cycles during the hackathon to avoid cost, while still deploying real canisters on ICP. The canister is real, verifiable, and uses the same `raw_rand` as mainnet.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| pnpm | 8+ | `npm install -g pnpm` |
| DFX | Latest | [IC Install Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install) |
| Docker | Latest | [docker.com](https://docker.com) |

---

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/your-username/eliza-icp.git
cd eliza-icp
```

### 2. Install Dependencies
```bash
cd packages/plugin-icp
pnpm install
pnpm generate

cd ../../apps/web
pnpm install
```

### 3. Configure Environment
```bash
cp packages/plugin-icp/.env.example packages/plugin-icp/.env
cp apps/web/.env.example apps/web/.env.local
```

### 4. Start PostgreSQL
```bash
docker run -d --name icp-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=icp_plugin \
  -p 5432:5432 \
  postgres:15-alpine
```

### 5. Start ICP Local Replica
```bash
dfx start --background --clean
```

### 6. Deploy Canister (Local)
```bash
cd packages/plugin-icp/canisters/token_factory
dfx deploy
```

### 7. Run Bot
```bash
cd ../..
pnpm migrate
pnpm build
pnpm start
```

### 8. Run Web App
```bash
cd ../../apps/web
pnpm dev
```

---

## ICP Testnet Deployment

### 1. Create Identity
```bash
dfx identity new prod-deployer
dfx identity use prod-deployer
```

### 2. Check Principal
```bash
dfx identity get-principal
```

### 3. Deploy Canister to ICP
```bash
cd packages/plugin-icp/canisters/token_factory
dfx deploy --network ic
```

### 4. Save Canister ID
```bash
export TOKEN_FACTORY_CANISTER_ID=$(dfx canister id token_factory --network ic)
echo $TOKEN_FACTORY_CANISTER_ID
```

### 5. Verify Deployment
```bash
dfx canister status token_factory --network ic
```

Expected output:
- Status: Running
- Controllers: your principal
- Cycles balance: non-zero

### 6. View on Dashboard
```
https://dashboard.internetcomputer.org/canister/<CANISTER_ID>
```

---

## Vercel Deployment (Web)

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Select `apps/web` as root directory

### 2. Configure Environment
```
NEXT_PUBLIC_API_URL=https://your-bot.railway.app
NEXT_PUBLIC_CANISTER_ID=your-canister-id
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/your_bot
```

### 3. Deploy
Click "Deploy" - automatic on every push to main.

---

## Backend Deployment (Bot)

### Option A: Railway
```bash
npm install -g @railway/cli
railway login
cd packages/plugin-icp
railway up
```

### Option B: Docker
```bash
docker build -t eliza-icp-bot .
docker push your-registry/eliza-icp-bot
```

---

## Environment Variables

### Plugin (.env)
```env
TELEGRAM_BOT_TOKEN=         # From @BotFather
OPENAI_API_KEY=             # From OpenAI
POSTGRES_URL=               # PostgreSQL connection
INTERNET_COMPUTER_PRIVATE_KEY=  # DFX identity
TOKEN_FACTORY_CANISTER_ID=  # After deploy
DFX_NETWORK=ic              # ic or local
ICP_HOST=https://ic0.app    # IC endpoint
```

### Web App (.env.local)
```env
NEXT_PUBLIC_API_URL=        # Bot backend URL
NEXT_PUBLIC_CANISTER_ID=    # Same as above
NEXT_PUBLIC_TELEGRAM_URL=   # Bot link
NEXT_PUBLIC_GITHUB_URL=     # Repo link
```

---

## Verification Commands

### Check Canister Status
```bash
dfx canister status token_factory --network ic
```

### Query Token
```bash
dfx canister call token_factory get_token_status '("REQUEST_ID")' --network ic
```

### List Tokens
```bash
dfx canister call token_factory list_tokens '(0, 10)' --network ic
```

### Test Upgrade Safety
```bash
dfx deploy --mode upgrade --network ic
dfx canister call token_factory list_tokens '(0, 10)' --network ic
# Tokens should still exist
```

---

## Troubleshooting

### Canister Not Found
```bash
dfx canister id token_factory --network ic
```

### Cycles Depleted
Request more cycles from ICP faucet or add cycles manually.

### Bot Not Responding
Check logs:
```bash
pnpm start 2>&1 | tee bot.log
```
