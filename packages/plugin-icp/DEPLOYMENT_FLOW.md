# 🚀 Deployment Flow - What Happens After Push

> **For Judges:** This document explains exactly what happens when code is pushed to GitHub.

---

## Quick Summary (For Presentations)

> "After pushing to GitHub, CI validates the code, Vercel automatically deploys the demo UI, and ICP canisters are deployed via controlled releases with upgrade-safe state and provable on-chain randomness."

---

## Step-by-Step: From Push to Production

### 1️⃣ GitHub Push → CI Pipeline Triggers

**Trigger:** Any push to `main` or Pull Request

**Workflows executed:**
```
.github/workflows/
├── ci.yml                    # Every push/PR
└── deploy_canisters.yml      # Tagged releases only
```

---

### 2️⃣ CI Workflow (ci.yml) — Quality Gate

Runs automatically on every push/PR:

| Step | Command | Purpose |
|------|---------|---------|
| Checkout | `actions/checkout@v4` | Get code |
| Install | `pnpm install` | Dependencies |
| Type Check | `pnpm build` | Compile TypeScript |
| Test | `pnpm test` | Unit tests |
| Lint | `eslint` | Code quality |

**Result:**
- ❌ CI fails → PR blocked
- ✅ CI passes → Code is trusted

**Why judges like this:** Proves production discipline.

---

### 3️⃣ Vercel Auto-Deployment (Web Demo UI)

If connected to Vercel:

**Automatic flow:**
1. Vercel detects changes
2. Runs `pnpm install && pnpm build`
3. Deploys to public URL

**You get:**
- 🌐 **Production URL:** `https://web-virid-chi.vercel.app`
- 🔄 **Preview URLs** for every PR

**Judge benefit:** "Open this URL to see the live demo."

---

### 4️⃣ ICP Canister Deployment (Controlled)

⚠️ **Important:** Canisters are NOT auto-deployed (intentional).

**Option A: Manual (Recommended for Hackathons)**
```bash
dfx deploy --network ic
```
- You control cycles
- Avoid accidental upgrades
- Demo upgrade safety live

**Option B: Tagged Releases**
```bash
git tag v0.1.0
git push origin v0.1.0
# → deploy_canisters.yml runs automatically
```
- Uses `DFX_PRIVATE_KEY` from GitHub Secrets
- Outputs: Canister ID, Network, Commit hash

---

### 5️⃣ Telegram Bot Deployment

**Docker/VPS/Cloud:**
- GitHub push triggers image rebuild
- Container restarts automatically
- Bot reconnects with same token/DB/canister

**Manual:**
```bash
pnpm start
# Bot reconnects instantly
```

---

### 6️⃣ Database (PostgreSQL) — Zero Downtime

Prisma migrations ensure:
- ✅ Schema changes are versioned
- ✅ Old data preserved
- ✅ Canister IDs remain valid
- ✅ Production-safe upgrades

---

## 🎯 What Judges See

### 1. GitHub Repo
- Clean commits
- CI checks passing ✅
- Proper documentation

### 2. Vercel URL
- Live UI
- Real ICP data
- Randomness verification

### 3. Telegram Bot
- `/create_token` works
- AI generation visible
- Status verifiable

### 4. ICP Dashboard
- Canister running
- Cycles visible
- Stable memory confirmed

**Key point:** Judges can verify without trusting you.

---

## ✅ What Happens (Correctly)

| Action | Status |
|--------|--------|
| CI validates code | ✅ Automatic |
| Vercel deploys UI | ✅ Automatic |
| Canister deploys on release | ✅ Controlled |
| Database migrations | ✅ Safe |
| Bot reconnects | ✅ Automatic |

## ❌ What Does NOT Happen (Correctly)

| Risk | Protection |
|------|------------|
| Secrets pushed | ❌ Never (`.gitignore`) |
| Private keys committed | ❌ Never (GitHub Secrets) |
| Canisters redeployed accidentally | ❌ Never (manual/tagged) |
| Randomness off-chain | ❌ Never (`raw_rand` only) |

**This shows maturity.**

---

## 🏆 Final Outcome

After pushing to GitHub, you have:

✅ Public demo URL  
✅ Live Telegram bot  
✅ Running ICP canister  
✅ Verified randomness  
✅ CI/CD proof  
✅ Audit-ready documentation  

---

## Presentation Script

**For demos:**

> "Let me show you the full production pipeline. When I push code:
> 
> 1. GitHub Actions runs CI - you can see the green checkmarks
> 2. Vercel automatically deployed the web UI - here's the live URL
> 3. The Telegram bot is running - try `/create_token`
> 4. The canister is on ICP mainnet - here's the dashboard
> 5. All randomness uses `raw_rand` - verifiable on-chain
> 
> You can verify everything yourself without trusting me."

---

## Quick Commands

```bash
# Local development
pnpm dev

# Run tests
pnpm test

# Build
pnpm build

# Deploy canister (manual)
dfx deploy --network ic

# Create release
git tag v0.1.0 && git push origin v0.1.0
```

---

*Last updated: December 25, 2025*
