# Limitations

## Known Constraints

### 1. Telegram Only (Currently)

**Limitation:** Bot only works on Telegram.

**Future:** Discord, web UI, API access.

---

### 2. Off-Chain AI Calls

**Limitation:** AI calls (GPT-4, DALL-E) go through centralized OpenAI.

**Why:** ICP HTTPS outcalls not yet integrated.

**Future:** Use ICP HTTPS outcalls for direct canister to OpenAI.

---

### 3. Logo Storage

**Limitation:** Logos stored as URLs (DALL-E temporary links).

**Future:** Upload to IPFS, store CID on-chain.

---

### 4. Cycle Costs

**Limitation:** Each `raw_rand` call costs cycles.

**Estimate:** ~0.002 cycles per call.

**Mitigation:** Rate limiting prevents excessive calls.

---

### 5. Timer Volatility

**Limitation:** Timers don't persist across upgrades by default.

**Mitigation:** Re-register timers in `postupgrade`.

**Future:** Serialize timer state to stable storage.

---

### 6. Single Canister

**Limitation:** All tokens in one canister.

**Future:** Multi-canister architecture for scaling.

---

### 7. Rate Limits

| Action | Limit |
|--------|-------|
| Token creation | 3/hour |
| AI generation | 10/hour |
| Status checks | 30/minute |

**Why:** Cost protection (OpenAI, cycles).

---

### 8. No Token Trading

**Limitation:** Tokens are created but not tradeable.

**Future:** Integrate with DEXs (ICPSwap, etc.).

---

### 9. Testnet Deployment

**Limitation:** Currently deployed with test cycles.

**Why:** Hackathon cost management.

**Production:** Single flag change (`--network ic`) and adding cycles.

---

## Technical Limitations

### Canister Size
- Max 4GB stable memory
- Estimated: 10M+ tokens before limit

### Consensus Delay
- `raw_rand` takes ~2 seconds
- Acceptable for token creation flow

### Query vs Update
- Queries are free but return stale data
- Updates cost cycles but are consistent

---

## Honest Assessment

| Aspect | Score | Notes |
|--------|-------|-------|
| Core functionality | 9/10 | Works as designed |
| Scalability | 6/10 | Single canister limit |
| Decentralization | 7/10 | AI still centralized |
| User experience | 8/10 | Telegram-only |
| Production readiness | 7/10 | Some hardening needed |

---

## What This Is NOT

- Not a fully decentralized AI system
- Not a token trading platform
- Not a DAO governance system
- Not production-audited code

---

## What This IS

- A proof-of-concept for ICP + AI integration
- A demonstration of provable randomness
- A functional Telegram bot
- An open-source starting point
