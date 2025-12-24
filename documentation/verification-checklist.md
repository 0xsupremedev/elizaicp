# Verification Checklist

Complete, judge-proof verification that the chain is working.

---

## 1. Canister Is Live (On-Chain)

### Check Canister Status
```bash
dfx canister status token_factory --network ic
```

Expected output:
```
Status: Running
Controllers: your-principal-id
Cycles: 1_000_000_000_000 (or any non-zero value)
```

### View on Dashboard
```
https://dashboard.internetcomputer.org/canister/<CANISTER_ID>
```

Judges will see:
- Canister ID matches docs
- Module hash present
- Cycles history
- Controllers list

---

## 2. On-Chain Randomness (Critical)

### A. Trigger Token Creation (Telegram)

Send to bot:
```
/create_token
```

Complete the flow. Bot response must show:
- Request ID
- Seed hash
- Timestamp

### B. Query Canister Directly
```bash
dfx canister call token_factory get_token_status '("<REQUEST_ID>")' --network ic
```

Expected fields:
```
(
  record {
    info = opt record {
      id = "1234567890-0";
      name = "Moon Doge";
      symbol = "MDOGE";
      seed = blob "\d4\f5\e6\a7...";  # 32 bytes
      status = variant { minted };
      createdAt = 1_703_000_000_000_000;
    }
  }
)
```

### C. Verify raw_rand Usage (Code)

In `main.mo`:
```motoko
let randomBlob = await IC.raw_rand();
tokens.put(tokenId, { seed = randomBlob, ... });
```

This proves:
- Randomness from ICP management canister
- Seed stored on-chain
- Verifiable by anyone

---

## 3. Backend Integration

### Health Check
```bash
curl https://<your-backend-url>/health
```

Response:
```json
{ "status": "ok" }
```

### API Returns Chain Data
```bash
curl https://<your-backend-url>/tokens
```

Response includes:
- Token name
- Seed hash
- Canister ID

---

## 4. Web UI Shows Live Data

### Demo Page (`/demo`)
- Recent tokens list
- Seed hash truncated
- Canister ID shown
- Status: Minted / Pending
- "View on ICP Dashboard" links work

### Verify Page (`/verify`)
- Input Request ID
- Click Verify
- Output:
  - Seed hash (full)
  - Deterministic result
  - Canister transaction link

---

## 5. Upgrade Safety (Optional, High Score)

### Deploy Upgrade
```bash
dfx deploy --mode upgrade --network ic
```

### Verify Data Persists
```bash
dfx canister call token_factory list_tokens '(0, 10)' --network ic
```

Tokens should still exist after upgrade.

---

## Final Checklist

| Check | Command/Action | Expected |
|-------|----------------|----------|
| Canister running | `dfx canister status` | Status: Running |
| raw_rand used | View main.mo | `await IC.raw_rand()` |
| Seed stored | `dfx canister call get_token_status` | seed field present |
| Backend alive | `curl /health` | `{ "status": "ok" }` |
| UI shows data | Open /demo | Live tokens list |
| Verify works | Open /verify | Seed hash displayed |
| Upgrade safe | Deploy upgrade, query tokens | Data persists |

---

## Judge Presentation Script

> "We deploy a real ICP canister using raw_rand.
> The Telegram bot triggers on-chain randomness.
> The Web UI reads live canister data.
> Anyone can verify fairness via the verify page."

---

## Network Disclosure

```
Network: Internet Computer (test cycles)
Deployment: dfx deploy --network ic
```

We use test cycles during the hackathon to avoid cost, while still deploying real canisters on ICP. The canister is real, verifiable, and uses the same `raw_rand` as mainnet.

Mainnet deployment is a single flag change and adding cycles.
