# Deployment Checklist

Production-ready deployment checklist for judges and reviewers.

---

## Required Stack Status

| Component | Status | Notes |
|-----------|--------|-------|
| GitHub | Ready | Push to public repo |
| Vercel | Ready | Web app configured |
| ICP Testnet | Ready | Canister code complete |
| Internet Identity | Ready | Wallet linking implemented |
| Telegram Bot | Ready | All commands working |
| Backend API | Ready | Health endpoint exists |

---

## Pre-Deployment Checklist

### 1. GitHub Repository

- [ ] Create public repository
- [ ] Push all code
- [ ] Verify README displays correctly
- [ ] Check documentation folder visible
- [ ] Add MIT license file

### 2. ICP Canister Deployment

```bash
# Start local or use testnet
dfx start --background

# Deploy to testnet
cd packages/plugin-icp/canisters/token_factory
dfx deploy --network ic

# Save canister ID
export CANISTER_ID=$(dfx canister id token_factory --network ic)
echo "Canister ID: $CANISTER_ID"
```

Verify:
```bash
dfx canister status token_factory --network ic
```

### 3. Vercel Deployment

1. Connect GitHub repo to Vercel
2. Set root directory: `apps/web`
3. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-bot.railway.app
   NEXT_PUBLIC_CANISTER_ID=your-canister-id
   NEXT_PUBLIC_TELEGRAM_URL=https://t.me/your_bot
   NEXT_PUBLIC_GITHUB_URL=https://github.com/your-username/eliza-icp
   ```
4. Deploy

### 4. Telegram Bot Deployment

**Recommended: Railway**

```bash
cd packages/plugin-icp
railway login
railway up
```

Environment variables (set in Railway):
```
TELEGRAM_BOT_TOKEN=your-token
OPENAI_API_KEY=your-key
POSTGRES_URL=your-db-url
INTERNET_COMPUTER_PRIVATE_KEY=your-key
TOKEN_FACTORY_CANISTER_ID=your-canister-id
DFX_NETWORK=ic
ICP_HOST=https://ic0.app
WEB_URL=https://your-app.vercel.app
```

### 5. Database (PostgreSQL)

**Recommended: Railway PostgreSQL**

```bash
railway add plugin postgres
```

Then run migrations:
```bash
pnpm migrate
```

---

## Post-Deployment Verification

### Health Checks

```bash
# Web app
curl https://your-app.vercel.app/api/health

# Bot (if exposed)
curl https://your-bot.railway.app/health
```

### Canister Verification

```bash
# Check canister is running
dfx canister status token_factory --network ic

# Test prove_link
dfx canister call token_factory get_link_proof '("test123")' --network ic

# Test list_tokens
dfx canister call token_factory list_tokens '(0, 10)' --network ic
```

### Telegram Bot Test

1. Send `/start` - should respond
2. Send `/link_identity` - should show button
3. Send `/help` - should list commands

### Web UI Test

1. Open landing page
2. Navigate to /demo
3. Navigate to /verify
4. Test /link?tg=123456

---

## Judge Demo Flow (2 Minutes)

1. **Open Web** -> https://your-app.vercel.app
2. **Open Telegram** -> Send `/link_identity`
3. **Connect Wallet** -> Click button, auth via II
4. **Verify Proof** -> Bot confirms linking
5. **Create Token** -> `/create_token`
6. **Check Dashboard** -> Show canister on ICP explorer

---

## URLs to Share with Judges

| Resource | URL |
|----------|-----|
| Web Demo | https://your-app.vercel.app |
| Telegram Bot | https://t.me/your_bot |
| GitHub | https://github.com/your-username/eliza-icp |
| ICP Dashboard | https://dashboard.internetcomputer.org/canister/YOUR_ID |
| Documentation | /documentation in repo |

---

## Emergency Contacts

- **ICP Issues**: ic.community Discord
- **Vercel Issues**: vercel.com/support
- **Railway Issues**: railway.app/help
