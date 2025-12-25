# 🚀 ElizaICP - 100% On-Chain Setup Guide

## ✅ What We've Built

Your web app is now **100% ON-CHAIN** with **ZERO MOCK DATA**:

- ✅ Direct browser → ICP canister communication
- ✅ Internet Identity wallet authentication
- ✅ Real-time token queries from blockchain
- ✅ Live randomness seed verification
- ✅ Immutable on-chain data display

---

## 📋 Prerequisites

### Required
1. **ICP Canister Deployed** - Your TokenFactory canister must be live on IC
2. **dfx CLI** - For canister deployment
3. **Node.js & pnpm** - For web app
4. **Vercel Account** - For web deployment (free)

### Optional
- GitHub Actions for CI/CD
- Custom domain

---

## 🛠️ Setup Steps

### 1. Deploy Your Canister

```bash
cd packages/plugin-icp

# Deploy to IC mainnet
dfx deploy --network ic token_factory

# Get your canister ID
dfx canister id token_factory --network ic
```

**Save this canister ID** - you'll need it for the web app.

---

### 2. Configure Web App

Navigate to `apps/web` and create `.env.local`:

```bash
cd apps/web
cp .env.example .env.local
```

Edit `.env.local`:

```env
# CRITICAL: Your deployed canister ID
NEXT_PUBLIC_CANISTER_ID=your-canister-id-here

# IC Network (use 'ic' for mainnet)
NEXT_PUBLIC_IC_HOST=https://ic0.app
NEXT_PUBLIC_DFX_NETWORK=ic

# External URLs
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/your_bot
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org/your-repo
```

**For Local Development:**
```env
NEXT_PUBLIC_IC_HOST=http://localhost:4943
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
```

---

### 3. Test Locally

```bash
# In apps/web
pnpm install
pnpm dev
```

Visit `http://localhost:3000`

**Test the integration:**
1. Click "Connect Wallet" → Internet Identity login
2. Go to `/demo` → Should show real tokens from canister
3. Go to `/verify` → Enter a request ID from Telegram bot

---

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Add environment variables in Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_CANISTER_ID`
   - `NEXT_PUBLIC_IC_HOST`
   - `NEXT_PUBLIC_DFX_NETWORK`
   - `NEXT_PUBLIC_TELEGRAM_URL`
   - `NEXT_PUBLIC_GITHUB_URL`

3. Redeploy:
```bash
vercel --prod
```

---

## 🔍 How to Verify It's Real

### For Judges/Users:

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Authenticate via Internet Identity
   - Your Principal appears in header

2. **View Real Tokens**
   - Navigate to `/demo`
   - All tokens are fetched from canister
   - If empty → canister has no tokens (create one via Telegram!)

3. **Verify Randomness**
   - Get a Request ID from Telegram bot
   - Go to `/verify`
   - Enter the ID
   - See the **32-byte seed** from `raw_rand()`
   - Click "View on IC Dashboard" to see on-chain data

4. **Check Canister Directly**
   - Visit: `https://dashboard.internetcomputer.org/canister/<YOUR_CANISTER_ID>`
   - See all state, calls, and storage

---

## 📊 Architecture Overview

```
Browser (Next.js)
     ↓
@dfinity/agent (HTTP Agent)
     ↓
ICP Canister (Motoko)
     ↓
ICP Blockchain State
```

**No backend server. No database. 100% on-chain.**

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `lib/icp.ts` | ICP agent setup, actor factory, auth |
| `hooks/useCanister.ts` | React hooks for canister queries |
| `components/WalletConnect.tsx` | Internet Identity login |
| `app/demo/page.tsx` | Live tokens from canister |
| `app/verify/page.tsx` | On-chain randomness verification |
| `components/VerifyForm.tsx` | Query token by ID |

---

## 🧪 Testing Checklist

- [ ] Canister deployed and responding
- [ ] `.env.local` configured with canister ID
- [ ] Internet Identity login works
- [ ] Demo page loads real tokens (or empty if none)
- [ ] Verify page queries tokens by ID
- [ ] Seed hashes are displayed correctly
- [ ] IC Dashboard link opens

---

## 🔧 Troubleshooting

### "Wallet not connected" error
- Make sure you clicked "Connect Wallet"
- Internet Identity popup should appear
- If blocked, allow popups for your domain

### Demo page shows no tokens
- This is **OK** if no tokens have been created yet
- Create a token via Telegram bot
- Refresh demo page

### "Failed to fetch tokens" error
- Check `NEXT_PUBLIC_CANISTER_ID` is set
- Verify canister is live: `dfx canister status <ID> --network ic`
- Check browser console for errors

### TypeScript errors
- Ensure all dependencies are installed: `pnpm install`
- Check that `@dfinity/*` packages are installed

---

## 🎉 What Judges Will See

1. **Landing page** → Fluid CTA animation
2. **Demo page** → Real tokens from blockchain
3. **Verify page** → On-chain randomness seeds
4. **Wallet connection** → Internet Identity auth
5. **IC Dashboard link** → Direct proof of on-chain data

**Zero mocks. Zero fake data. 100% verifiable.**

---

## 🚀 Next Steps

Optional enhancements:
- [ ] Add token creation UI (directly from web)
- [ ] Add wallet balance display
- [ ] Add transaction history
- [ ] Add canister metrics dashboard
- [ ] Add GitHub Actions deployment

---

## 📞 Support

- ICP Docs: https://internetcomputer.org/docs
- dfx Reference: https://internetcomputer.org/docs/current/references/cli-reference
- Agent-js: https://agent-js.icp.xyz

---

**Remember: Your web app now talks DIRECTLY to the ICP blockchain. No intermediaries. Pure on-chain.**
