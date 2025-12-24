# Future Work

## Roadmap

### Phase 1: Current (MVP) ✅
- [x] Token creation via Telegram
- [x] AI-enhanced metadata
- [x] On-chain randomness
- [x] Web demo UI
- [x] Basic documentation

### Phase 2: Hardening (Next)
- [ ] Admin access control
- [ ] Secrets management upgrade
- [ ] Cycles monitoring
- [ ] Structured logging
- [ ] Load testing

### Phase 3: Features
- [ ] IPFS logo storage
- [ ] Token trading integration
- [ ] Multi-language support
- [ ] Analytics dashboard

### Phase 4: Expansion
- [ ] Discord bot
- [ ] Web wallet interface
- [ ] NFT support
- [ ] DAO governance

---

## Technical Roadmap

### HTTPS Outcalls (Direct AI)
```motoko
// Future: Call OpenAI directly from canister
let response = await ic.http_request({
  url = "https://api.openai.com/v1/completions";
  method = #post;
  body = ?requestBody;
});
```

**Benefit:** Fully on-chain AI calls, no backend needed.

---

### Chain Fusion
```motoko
// Future: Cross-chain token deployment
let ethTxHash = await ic.sign_with_ecdsa({
  message_hash = ...;
  derivation_path = [...];
});
```

**Benefit:** Deploy tokens on Ethereum, BSC, etc.

---

### Internet Identity
```typescript
// Future: Native ICP auth
const authClient = await AuthClient.create();
await authClient.login({
  identityProvider: "https://identity.ic0.app",
});
```

**Benefit:** No manual Principal linking.

---

### On-Chain AI Inference
```motoko
// Future: Run AI models on ICP
let result = await AICanister.infer({
  model = "llama-7b";
  prompt = "Generate token description for...";
});
```

**Benefit:** Fully decentralized AI.

---

## Feature Ideas

### Token Launchpad
- Fair launch with `raw_rand`
- Automatic liquidity provision
- Anti-rug protections

### NFT Collections
- AI-generated art series
- Deterministic trait assignment
- On-chain metadata

### Trading Bots
- Strategy execution with randomness
- Fair order execution
- Transparent decision-making

### Governance
- DAO-controlled parameters
- Token holder voting
- Transparent proposal execution

---

## Community Requests

| Request | Priority | Status |
|---------|----------|--------|
| Discord integration | High | Planned |
| Mobile app | Medium | Considering |
| API access | High | Planned |
| Bulk creation | Low | Backlog |
| Custom templates | Medium | Backlog |

---

## How to Contribute

1. **Feature requests** → Open GitHub Issue
2. **Bug reports** → Open GitHub Issue
3. **Code contributions** → Pull Request
4. **Documentation** → Pull Request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## Research Areas

- On-chain LLM inference (IC-LLM)
- Chain-key signatures for multi-chain
- Decentralized image storage (IPFS, Arweave)
- Zero-knowledge proofs for private randomness

---

## Get Involved

- **GitHub:** Star and watch for updates
- **Telegram:** Join the community
- **Twitter:** Follow for announcements
- **Forum:** Discuss on forum.dfinity.org
