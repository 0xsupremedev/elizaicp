# Security

## Threat Model

### What CANNOT Be Manipulated

| Property | Protection |
|----------|------------|
| **Randomness** | `raw_rand` from ICP consensus (2/3 threshold) |
| **Token state** | Stored in canister stable memory |
| **Seed history** | Immutable once stored |

### What IS Protected

| Threat | Mitigation |
|--------|------------|
| Bot spam | Rate limiting (3 tokens/hour) |
| API abuse | Per-user limits, IP blocking |
| Cycle drain | Canister access controls |
| Key theft | Secret management (see SECURITY.md) |

---

## Key Management

### Identity Separation

| Identity | Purpose | Storage |
|----------|---------|---------|
| `admin-cold` | Upgrades, admin ops | Hardware wallet |
| `bot-runtime` | Daily operations | Secret store |
| `deployer-ci` | CI/CD only | GitHub Secrets |

### Never Do This
```env
# ❌ WRONG - Never in .env for production
INTERNET_COMPUTER_PRIVATE_KEY=abc123...
```

### Do This Instead
```yaml
# ✅ CORRECT - GitHub Actions secret
env:
  DFX_IDENTITY_PEM: ${{ secrets.DFX_IDENTITY_PEM }}
```

---

## Access Control

### Canister Level
```motoko
stable var adminPrincipal : Principal = ...;

private func requireAdmin(caller: Principal) {
  assert(caller == adminPrincipal);
};

public shared(msg) func emergency_pause() {
  requireAdmin(msg.caller);
  // ...
};
```

### Bot Level
- Rate limiting middleware
- User input validation
- Principal format verification

---

## Abuse Prevention

### Rate Limits
```typescript
export const LIMITS = {
  CREATE_TOKEN: { max: 3, windowMs: 3600000 },   // 3/hr
  AI_GENERATION: { max: 10, windowMs: 3600000 }, // 10/hr
  STATUS_CHECK: { max: 30, windowMs: 60000 },    // 30/min
};
```

### Input Validation
- Token names: alphanumeric, max 50 chars
- Symbols: 2-6 uppercase letters
- Descriptions: max 200 chars
- Principal: valid format check

---

## Data Privacy

### What We Store
- Telegram user ID (hashed)
- ICP Principal (user-provided)
- Token metadata (public by design)

### What We DON'T Store
- Telegram messages (beyond processing)
- Private keys
- Personal information

---

## Randomness Security

### ICP's `raw_rand` Guarantees
1. **Threshold BLS** - 2/3 subnet replicas must agree
2. **No prediction** - Each call generates new bytes
3. **No bias** - Cryptographically uniform output
4. **Verifiable** - Stored on-chain immutably

### Verification
```typescript
// Anyone can verify
const { info } = await actor.get_token_status(requestId);
const seedHash = sha256(info.seed);
// Compare with published hash
```

---

## Incident Response

### If Keys Are Compromised
1. Revoke GitHub Secrets immediately
2. Rotate all API keys
3. Deploy new canister identity
4. Notify affected users

### If Bot Is Abused
1. Check rate limit logs
2. Ban offending user IDs
3. Increase rate limit strictness
4. Review for attack patterns

---

## Audit Status

| Component | Status |
|-----------|--------|
| Canister code | ⏳ Pending |
| Bot code | ⏳ Pending |
| Infrastructure | ⏳ Pending |

---

## Vulnerability Reporting

**Email:** security@yourproject.com

**Process:**
1. Report received → 48h acknowledgment
2. Assessment → 7 days
3. Fix development → varies
4. Public disclosure → 90 days after fix

See [SECURITY.md](../packages/plugin-icp/SECURITY.md) for full policy.
