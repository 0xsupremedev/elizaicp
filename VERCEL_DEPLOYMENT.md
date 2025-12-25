# 🚀 Vercel Deployment Checklist

**100% Online - No Local Dependencies**

---

## Prerequisites

- [x] GitHub repository created
- [x] Vercel account (free tier works)
- [ ] Canister deployed via GitHub Actions

---

## Step 1: Get Canister ID

After GitHub Actions deployment completes:

1. Go to **Actions** tab in your repo
2. Click on latest "Deploy ICP Canister" workflow run
3. Copy the **Canister ID** from the summary
4. Copy the **Dashboard URL** for verification

**Example:**
```
Canister ID: bd3sg-teaaa-aaaaa-qaaba-cai
Dashboard: https://dashboard.internetcomputer.org/canister/bd3sg-teaaa-aaaaa-qaaba-cai
```

---

## Step 2: Configure Vercel Environment Variables

### Required Variables

Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_CANISTER_ID` | `<from-github-actions>` | Production, Preview, Development |
| `NEXT_PUBLIC_IC_HOST` | `https://ic0.app` | Production, Preview, Development |
| `NEXT_PUBLIC_DFX_NETWORK` | `ic` | Production, Preview, Development |
| `NEXT_PUBLIC_TELEGRAM_URL` | `https://t.me/your_bot` | Production, Preview, Development |
| `NEXT_PUBLIC_GITHUB_URL` | `https://github.com/0xsupremedev/microapi-hub` | Production, Preview, Development |

### Optional (for Internet Identity)

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_INTERNET_IDENTITY_URL` | `https://identity.ic0.app` | Production, Preview, Development |

---

## Step 3: Import to Vercel

### Option A: Vercel Dashboard

1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Framework Preset: **Next.js**
4. Root Directory: `eliza/apps/web`
5. Build Command: `npm run build` (auto-detected)
6. Output Directory: `.next` (auto-detected)
7. Install Command: `npm install`

### Option B: Vercel CLI

```bash
npm i -g vercel
cd eliza/apps/web
vercel --prod
```

---

## Step 4: Verify Deployment

After deployment completes:

### ✅ Basic Checks

- [ ] Site loads at `https://your-project.vercel.app`
- [ ] Landing page displays
- [ ] No console errors related to env vars
- [ ] Footer shows GitHub link
- [ ] Header shows "Connect Wallet" button

### ✅ ICP Integration Checks

- [ ] Click "Connect Wallet" → Internet Identity popup opens
- [ ] After auth, Principal displays in header
- [ ] Navigate to `/demo` → shows UI (may be empty if no tokens)
- [ ] Navigate to `/verify` → form loads
- [ ] Navigate to `/docs` → documentation displays

### ✅ Canister Connection

Open browser DevTools → Console, check for:

```javascript
// Should see agent initialization
agent initialized for canister: bd3sg-teaaa-aaaaa-qaaba-cai

// Should NOT see errors like:
❌ "canister not found"
❌ "fetch failed"
❌ "CORS error"
```

---

## Step 5: Test Live Canister Queries

### Demo Page Test

1. Go to `/demo`
2. Open DevTools → Network tab
3. Should see requests to:
   - `https://ic0.app/api/v2/canister/<CANISTER_ID>/query`
4. Response should be valid (even if empty array)

### Verify Page Test

1. Go to `/verify`
2. Enter any test token ID (create one via canister call if needed)
3. Should query canister and return result

---

## Step 6: Remove Mock Data (Critical)

Ensure these files **do NOT have fallback mock data**:

### Check `lib/icp.ts`

```typescript
// ❌ BAD - has fallback mock
if (!canisterId) {
  return MOCK_TOKENS;
}

// ✅ GOOD - fails if no canister
if (!canisterId) {
  throw new Error("Canister ID not configured");
}
```

### Check `app/demo/page.tsx`

```typescript
// ❌ BAD - shows fake data
const tokens = await getTokens() || SAMPLE_TOKENS;

// ✅ GOOD - shows real data or empty
const tokens = await getTokens();
```

---

## Step 7: Update README with Live Links

Add to your project README:

```markdown
## 🌐 Live Demo

- **Web App:** https://elizaicp.vercel.app
- **Canister:** https://dashboard.internetcomputer.org/canister/bd3sg-teaaa-aaaaa-qaaba-cai
- **Network:** Internet Computer Mainnet
- **No Mock Data** - All state is on-chain ✅
```

---

## Step 8: Create Deployment Badge

Add to README:

```markdown
[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xsupremedev/microapi-hub)
[![ICP Canister](https://img.shields.io/badge/ICP-Canister%20Deployed-blue)](https://dashboard.internetcomputer.org/canister/bd3sg-teaaa-aaaaa-qaaba-cai)
```

---

## 🧪 Final Validation Checklist

Before calling it "done":

- [ ] Vercel URL accessible publicly
- [ ] Internet Identity works on production
- [ ] Canister ID visible in Network requests
- [ ] ICP Dashboard shows deployed canister
- [ ] Dashboard shows same data as UI
- [ ] No mock/fake data in UI
- [ ] Logs show real canister calls
- [ ] README updated with links
- [ ] Environment variables set correctly
- [ ] Build succeeds without warnings

---

## 🎯 Judge Test Flow

A judge should be able to:

1. Open Vercel URL
2. Connect wallet (Internet Identity)
3. Navigate pages
4. See canister calls in DevTools
5. Open ICP Dashboard link
6. Verify data matches

**If all work → 100% online verified ✅**

---

## 🔧 Troubleshooting

### Issue: "Canister not found"

**Fix:**
- Verify `NEXT_PUBLIC_CANISTER_ID` is set in Vercel
- Check it matches GitHub Actions output
- Ensure no typos in canister ID

### Issue: "Internet Identity popup blocked"

**Fix:**
- Allow popups for `identity.ic0.app`
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_IC_HOST` is `https://ic0.app`

### Issue: "Failed to fetch from canister"

**Fix:**
- Check canister is deployed: `dfx canister status <ID> --network ic`
- Verify canister has cycles
- Check Network tab for actual error response

---

## 📊 Success Metrics

After deployment, you should see:

- ✅ Vercel build successful
- ✅ 0 mock data references
- ✅ ICP Dashboard shows canister
- ✅ Web UI queries canister
- ✅ Internet Identity connects
- ✅ Randomness is verifiable

**Status:** 🟢 **Production Ready**

---

## 🎬 Next Steps

1. Deploy canister via GitHub Actions
2. Copy canister ID
3. Set Vercel env vars
4. Deploy to Vercel
5. Test production URL
6. Update README
7. Create demo video

**Estimated Time:** 30-45 minutes
