# Demo Guide

## Quick Demo (5 Minutes)

### Step 1: Open Web Demo
1. Navigate to https://eliza-icp.vercel.app
2. Explore the landing page
3. Click **"View Demo"** to see live tokens

### Step 2: Verify Randomness
1. Click **"Verify"** in the navigation
2. Enter request ID: `abc123-0`
3. See the on-chain seed verified

### Step 3: Try Telegram Bot
1. Open https://t.me/eliza_icp_bot
2. Send `/start`
3. Send `/create_token`
4. Follow the prompts

---

## Full Demo Walkthrough

### 1. Create a Token

**Command:** `/create_token`

**Flow:**
```
Bot: Let's create a meme token on ICP!
     Step 1/3: What's the token name?

You: Moon Cat

Bot: Token Name: Moon Cat
     Step 2/3: What's the symbol?

You: MCAT

Bot: Symbol: MCAT
     Step 3/3: Describe your token

You: The lunar feline that promises cosmic gains

Bot: Generating AI-powered metadata...

     [Shows AI-generated logo]
     
     Token Preview
     Name: Moon Cat
     Symbol: MCAT
     Description: [Enhanced by GPT-4]
     
     Ready to mint? Use /confirm
```

### 2. Confirm Deployment

**Command:** `/confirm`

**Result:**
```
Bot: Deploying token to ICP blockchain...

     Token deployed successfully!
     
     Request ID: a1b2c3d4-5
     Seed Hash: d4f5e6a7...
     
     Check status with: /status a1b2c3d4-5
```

### 3. Check Status

**Command:** `/status a1b2c3d4-5`

**Output:**
```
Token Status

Name: Moon Cat
Symbol: MCAT
Status: Minted
Request ID: a1b2c3d4-5
Created: Dec 25, 2025, 10:30 AM
Minted: Dec 25, 2025, 10:30 AM

Randomness Seed: d4f5e6a7b8c9d0e1...
```

### 4. Verify On Web

1. Go to `/verify` page
2. Enter `a1b2c3d4-5`
3. See full verification result:
   - Token name/symbol
   - Full 64-character seed hash
   - Creation timestamp
   - Canister link

---

## Available Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/help` | Command list |
| `/create_token` | Start token creation |
| `/confirm` | Confirm and deploy |
| `/cancel` | Cancel current creation |
| `/status <id>` | Check token status |
| `/my_tokens` | List your tokens |
| `/link_identity` | Link ICP principal |
| `/my_identity` | View linked principal |

---

## Verification Checklist

- [ ] Web demo loads
- [ ] Token table shows data
- [ ] Verify page accepts input
- [ ] Telegram bot responds
- [ ] Token creation completes
- [ ] Seed hash is displayed
- [ ] Canister dashboard accessible
