// Type definitions for TokenFactory canister

module {
  // Token creation arguments matching README spec
  public type CreateMemeTokenArg = {
    name: Text;
    symbol: Text;
    description: Text;
    logo: Text;  // IPFS URL or data URL
    requester: Principal;
    twitter: ?Text;
    website: ?Text;
    telegram: ?Text;
  };

  // Token status response
  public type TokenStatus = {
    #draft;
    #pending;
    #minted;
    #failed;
  };

  // Token info stored on-chain
  public type TokenInfo = {
    id: Text;
    name: Text;
    symbol: Text;
    description: Text;
    logo: Text;
    seed: Blob;  // raw_rand output (32 bytes)
    requester: Principal;
    status: TokenStatus;
    createdAt: Int;  // nanoseconds since epoch
    mintedAt: ?Int;
    twitter: ?Text;
    website: ?Text;
    telegram: ?Text;
  };

  // Response from create operation
  public type CreateResponse = {
    requestId: Text;
    seed: Blob;  // For transparency/verification
  };

  // Query response
  public type QueryResponse = {
    info: ?TokenInfo;
  };

  // Wallet linking proof (NEW)
  public type LinkProof = {
    telegram_id: Text;
    principal: Principal;
    timestamp: Int;
  };
}
