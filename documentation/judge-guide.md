# Judge Evaluation Guide

**Start here for quick evaluation.**

---

## Project Summary

**ElizaICP** is an AI-powered meme token creation platform that:

1. Uses **ICP's `raw_rand`** for provable on-chain randomness
2. Integrates **GPT-4 + DALL-E** for AI metadata generation
3. Provides a **Telegram bot** for user interaction
4. Stores randomness seeds **immutably on-chain**
5. Built as an **ElizaOS plugin** for extensibility

---

## Network

```
Network: Internet Computer (test cycles)
Deployment: dfx deploy --network ic
```

We use test cycles during the hackathon to avoid cost, while still deploying real canisters on ICP. The canister is real, verifiable, and uses the same `raw_rand` as mainnet.

---

## Live URLs

| Component | URL |
|-----------|-----|
| **Web Demo** | https://web-virid-chi.vercel.app |
| **Telegram Bot** | https://t.me/eliza_icp_bot |
| **GitHub** | https://github.com/your-username/eliza-icp |
| **ICP Dashboard** | https://dashboard.internetcomputer.org/canister/YOUR_CANISTER_ID |

---

## Verification Checklist (Chain Is Working)

### 1. Canister Is Live

```bash
dfx canister status token_factory --network ic
```

Expected:
- Status: Running
- Controllers: deployer principal
- Cycles balance: non-zero

Dashboard proof: Open `https://dashboard.internetcomputer.org/canister/<CANISTER_ID>`

### 2. On-Chain Randomness

Create a token via Telegram:
```
/create_token
```

Then query canister directly:
```bash
dfx canister call token_factory get_token_status '("<REQUEST_ID>")' --network ic
```

Expected fields:
- `seed : blob` (32 bytes from raw_rand)
- `createdAt` (timestamp)
- `status` (pending/minted)

### 3. Code Proof (raw_rand Usage)

In `main.mo`:
```motoko
let randomBlob = await IC.raw_rand();
tokens.put(tokenId, { seed = randomBlob, ... });
```

### 4. Web UI Shows Live Data

On `/demo`:
- Tokens list with real data
- Seed hash displayed
- Status badges updating
- "View on ICP Dashboard" links work

On `/verify`:
- Enter Request ID
- See seed hash + verification result
- Canister transaction reference

---

## What to Click (Demo Flow)

### Step 1: Open Web Demo
1. Go to the Vercel URL
2. See landing page
3. Click **"View Demo"**

### Step 2: Verify Randomness
1. Click **"Verify"** in navigation
2. Enter a request ID (e.g., `abc123-0`)
3. See the on-chain seed hash

### Step 3: Try Telegram Bot
1. Click **"Open Telegram Bot"**
2. Send `/start`
3. Send `/create_token`
4. Follow prompts
5. Send `/confirm`

### Step 4: Verify On-Chain
1. Note the request ID
2. Send `/status <request_id>`
3. Compare seed hash with canister dashboard

---

## What Makes It Win

### 1. Provable Fairness
```
raw_rand() -> 32 bytes -> stored on-chain -> verifiable
```

### 2. Full-Stack ICP Integration
- Canister backend
- `raw_rand` for randomness
- Stable storage for upgrades
- Timers for scheduled tasks

### 3. Production-Ready
- CI/CD pipelines
- Rate limiting
- Security documentation

### 4. ElizaOS Contribution
- Open-source plugin
- Telegram command handlers
- Extensible architecture

---

## Quick Code Review

### Randomness (Canister)
```motoko
let randomBlob = await IC.raw_rand();
tokens.put(tokenId, { seed = randomBlob, ... });
```

### Stable Storage
```motoko
stable var tokenEntries : [(Text, Types.TokenInfo)] = [];
system func preupgrade() { tokenEntries := Iter.toArray(tokens.entries()); };
```

### Rate Limiting
```typescript
export const LIMITS = {
  CREATE_TOKEN: { max: 3, windowMs: 3600000 },
}
```

---

## Common Questions

**Q: Is this mainnet?**

A: It's deployed to ICP using test cycles. The canister is real and verifiable.

**Q: Can randomness be verified?**

A: Yes. We use ICP's raw_rand and store the seed on-chain. Anyone can verify it.

**Q: Could this be deployed to mainnet?**

A: Yes. Single flag change and adding cycles.

---

**Thank you for evaluating ElizaICP.**
