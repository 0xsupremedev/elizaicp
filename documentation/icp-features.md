# ICP Features Used

## Overview

This project leverages multiple Internet Computer capabilities to build a trustless, decentralized application.

---

## 1. On-Chain Randomness (`raw_rand`)

### What
Cryptographically secure random bytes from the management canister.

### How We Use It
```motoko
let seed = await IC.raw_rand();  // 32 bytes
```

### Why It Matters
- Provable fairness for token allocation
- Cannot be predicted or manipulated
- Stored on-chain for verification

---

## 2. Canisters as Backend

### What
Smart contracts that serve as fully on-chain backend logic.

### How We Use It
- `TokenFactory` canister handles all token operations
- No centralized server for blockchain logic
- Direct user → canister interaction possible

### Why It Matters
- Trustless execution
- No single point of failure
- Transparent, auditable code

---

## 3. Stable Storage

### What
Persistent memory that survives canister upgrades.

### How We Use It
```motoko
stable var tokenEntries : [(Text, Types.TokenInfo)] = [];

system func preupgrade() {
  tokenEntries := Iter.toArray(tokens.entries());
};

system func postupgrade() {
  tokens := HashMap.fromIter(tokenEntries.vals(), ...);
};
```

### Why It Matters
- Data survives code upgrades
- Production-safe deployment
- No data migration needed

---

## 4. Timers

### What
Scheduled execution of canister functions.

### How We Use It
```motoko
ignore Timer.recurringTimer<system>(#seconds 3600, cleanupOldDrafts);
```

### Why It Matters
- Automated maintenance tasks
- No external cron needed
- Claim window management

---

## 5. Candid Interface

### What
Type-safe interface description language for canisters.

### How We Use It
```
service : {
  create_meme_token : (CreateMemeTokenArg) -> (CreateResponse);
  get_token_status : (text) -> (QueryResponse) query;
}
```

### Why It Matters
- Cross-language interoperability
- Auto-generated TypeScript bindings
- Type-safe client libraries

---

## 6. Query vs Update Calls

### What
Read-only (free, fast) vs state-changing (costs cycles).

### How We Use It
```motoko
public query func get_token_status(...) : async QueryResponse { ... }  // Query
public shared func create_meme_token(...) : async CreateResponse { ... }  // Update
```

### Why It Matters
- Cost optimization
- Faster reads
- Efficient API design

---

## Feature Summary Table

| Feature | Used | Purpose |
|---------|------|---------|
| `raw_rand` | ✅ | Provable randomness |
| Canisters | ✅ | On-chain backend |
| Stable Storage | ✅ | Upgrade-safe state |
| Timers | ✅ | Scheduled tasks |
| Candid | ✅ | Type-safe interfaces |
| Query Calls | ✅ | Free/fast reads |
| Update Calls | ✅ | State changes |
| HTTPS Outcalls | ⚠️ | Future: direct AI calls |
| Chain Fusion | ⚠️ | Future: cross-chain |

---

## Future ICP Integrations

### HTTPS Outcalls
Call external APIs directly from canisters:
```motoko
let response = await ic.http_request({
  url = "https://api.openai.com/v1/...";
  // ...
});
```

### Chain Fusion
Bridge to Ethereum/Bitcoin for multi-chain tokens.

### Internet Identity
Native ICP authentication instead of Principal linking.
