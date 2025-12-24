# Security Policy

## 🔐 Private Key Management

### ❌ NEVER DO THIS IN PRODUCTION:

```env
# DO NOT store raw private keys in .env files
INTERNET_COMPUTER_PRIVATE_KEY=abc123hexstring...
```

### ✅ RECOMMENDED PRODUCTION APPROACHES:

#### Option A: GitHub Actions Secrets (for CI/CD)

```yaml
# .github/workflows/deploy.yml
env:
  DFX_IDENTITY_PEM: ${{ secrets.DFX_IDENTITY_PEM }}
```

Store the PEM file content in GitHub repository secrets.

#### Option B: Hardware Wallet / Ledger Device

```bash
# Use dfx with Ledger hardware wallet
dfx ledger account-id
# Follow prompts on Ledger device
```

Best for admin operations and canister upgrades.

#### Option C: Managed Secret Store

```bash
# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id icp/bot-private-key

# HashiCorp Vault
vault kv get secret/icp/bot-key

# Azure Key Vault
az keyvault secret show --name icp-bot-key --vault-name my-vault
```

Load secrets into environment at runtime, never commit to repository.

---

## 🔑 Identity Separation Strategy

Use different identities for different security levels:

| Identity | Purpose | Storage Method | Risk Level |
|----------|---------|----------------|------------|
| **admin-cold-wallet** | Canister upgrades, admin operations, governance | Hardware wallet / air-gapped | **Highest** |
| **bot-runtime** | Daily bot operations, token creation | Encrypted secret store | Medium |
| **deployer-ci** | CI/CD deployments only | GitHub Secrets (ephemeral) | Low |

### Setup Example:

```bash
# Create identities
dfx identity new admin-cold-wallet
dfx identity new bot-runtime  
dfx identity new deployer-ci

# Export for storage (KEEP SECURE)
dfx identity export admin-cold-wallet > admin.pem
# Store admin.pem in secure offline location

# Get principals
dfx identity use admin-cold-wallet
dfx identity get-principal  # Use this as canister admin

dfx identity use bot-runtime
dfx identity get-principal  # Use this for bot operations
```

---

## 🛡️ Canister Access Control

### Admin-Only Operations

The following canister methods require admin authentication:

- `set_admin(newAdmin: Principal)` - Transfer admin rights
- `pause_minting()` - Emergency pause
- `resume_minting()` - Resume after pause
- `update_fee(newFee: Nat)` - Change minting fee

### Verification:

```bash
# Test access control (should fail)
dfx identity use attacker
dfx canister call token_factory pause_minting --network ic
# Error: assertion failed

# Admin access (should succeed)
dfx identity use admin-cold-wallet
dfx canister call token_factory pause_minting --network ic
# Success
```

---

## 🚨 Vulnerability Reporting

If you discover a security vulnerability, please report it responsibly:

**Email:** security@yourproject.com  
**PGP Key:** [Link to public key]

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Response SLA:**
- Initial response: 48 hours
- Status update: 7 days
- Fix timeline: Depends on severity

---

## 🔍 Security Checklist (Pre-Production)

- [ ] **No private keys in `.env` or committed files**
- [ ] **Admin identity stored in hardware wallet or offline**
- [ ] **CI/CD uses GitHub Secrets or equivalent**
- [ ] **Rate limiting enabled on all bot commands**
- [ ] **Canister admin role properly configured**
- [ ] **Emergency pause function tested**
- [ ] **Cycles monitoring and alerts configured**
- [ ] **All dependencies up to date** (`pnpm audit`)
- [ ] **HTTPS only for all external APIs**
- [ ] **Database credentials rotated**

---

## 📊 Audit History

| Date | Auditor | Scope | Status |
|------|---------|-------|--------|
| TBD | - | Full smart contract audit | Pending |
| TBD | - | Bot security review | Pending |

---

## 🔒 Additional Security Measures

### Environment Variables Safety

```bash
# Check for accidentally committed secrets
git grep -i "private.*key"
git grep -i "sk-"  # OpenAI keys

# Use git-secrets
brew install git-secrets
git secrets --install
git secrets --register-aws
```

### Dependabot Configuration

Enable GitHub Dependabot for automatic security updates:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### HTTPS Enforcement

```typescript
// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production' && 
    !process.env.FORCE_HTTPS === 'false') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}
```

---

## 📝 Responsible Disclosure Policy

We follow coordinated vulnerability disclosure:

1. **Report received** → Acknowledge within 48h
2. **Assessment** → Evaluate severity (7 days)
3. **Fix development** → Implement patch
4. **Testing** → Verify fix on testnet
5. **Deployment** → Roll out to production
6. **Public disclosure** → 90 days after fix (or by agreement)

---

## ⚖️ Legal

This security policy is provided for informational purposes and does not constitute a bug bounty program. Rewards may be provided at our discretion for significant findings.

**Last Updated:** 2025-12-25
