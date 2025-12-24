import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Timer "mo:base/Timer";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";

import IC "ic:aaaaa-aa";  // Management canister
import Types "types";

actor TokenFactory {
  
  // ========== STABLE STORAGE ==========
  
  stable var tokenEntries : [(Text, Types.TokenInfo)] = [];
  stable var linkProofEntries : [(Text, Types.LinkProof)] = [];
  stable var nextTokenId : Nat32 = 0;

  // ========== STATE ==========
  
  var tokens = HashMap.HashMap<Text, Types.TokenInfo>(10, Text.equal, Text.hash);
  var linkProofs = HashMap.HashMap<Text, Types.LinkProof>(10, Text.equal, Text.hash);

  // ========== UPGRADE HOOKS ==========
  
  system func preupgrade() {
    tokenEntries := Iter.toArray(tokens.entries());
    linkProofEntries := Iter.toArray(linkProofs.entries());
  };

  system func postupgrade() {
    tokens := HashMap.fromIter<Text, Types.TokenInfo>(
      tokenEntries.vals(), 
      tokenEntries.size(), 
      Text.equal, 
      Text.hash
    );
    linkProofs := HashMap.fromIter<Text, Types.LinkProof>(
      linkProofEntries.vals(),
      linkProofEntries.size(),
      Text.equal,
      Text.hash
    );
    tokenEntries := [];
    linkProofEntries := [];
  };

  // ========== WALLET LINKING ==========

  // Core function: User calls this from their wallet to prove ownership
  // msg.caller is cryptographically verified by ICP
  public shared(msg) func prove_link(telegram_id : Text) : async Bool {
    let caller = msg.caller;
    
    // Validation
    if (telegram_id.size() == 0) {
      return false;
    };
    
    // Prevent anonymous principal
    if (Principal.isAnonymous(caller)) {
      return false;
    };
    
    let proof : Types.LinkProof = {
      telegram_id = telegram_id;
      principal = caller;
      timestamp = Time.now();
    };
    
    linkProofs.put(telegram_id, proof);
    Debug.print("Wallet linked: " # telegram_id # " -> " # Principal.toText(caller));
    return true;
  };

  // Query: Anyone can verify a link proof
  public query func get_link_proof(telegram_id : Text) : async ?Types.LinkProof {
    return linkProofs.get(telegram_id);
  };

  // List all link proofs (for admin/debugging)
  public query func list_link_proofs(limit : Nat) : async [Types.LinkProof] {
    let results = Buffer.Buffer<Types.LinkProof>(limit);
    for ((_, proof) in linkProofs.entries()) {
      if (results.size() < limit) {
        results.add(proof);
      };
    };
    return Buffer.toArray(results);
  };

  // Unlink a wallet (only the linked principal can unlink)
  public shared(msg) func unlink_wallet(telegram_id : Text) : async Bool {
    let caller = msg.caller;
    
    switch (linkProofs.get(telegram_id)) {
      case null { false };
      case (?proof) {
        if (proof.principal == caller) {
          linkProofs.delete(telegram_id);
          Debug.print("Wallet unlinked: " # telegram_id);
          true
        } else {
          false  // Only linked principal can unlink
        };
      };
    };
  };

  // ========== TOKEN FACTORY ==========

  // Generate unique ID from seed and counter
  private func generateTokenId(seed: Blob) : Text {
    let id = nextTokenId;
    nextTokenId += 1;
    
    let seedBytes = Blob.toArray(seed);
    let prefix = if (seedBytes.size() >= 8) {
      Nat32.fromIntWrap(
        (Nat32.fromNat(Nat8.toNat(seedBytes[0])) << 24) |
        (Nat32.fromNat(Nat8.toNat(seedBytes[1])) << 16) |
        (Nat32.fromNat(Nat8.toNat(seedBytes[2])) << 8) |
        (Nat32.fromNat(Nat8.toNat(seedBytes[3])))
      );
    } else { 0 };
    
    Nat32.toText(prefix) # "-" # Nat32.toText(id);
  };

  // Create meme token with on-chain randomness
  public shared(msg) func create_meme_token(arg: Types.CreateMemeTokenArg) : async Types.CreateResponse {
    // CRITICAL: Call management canister for provable randomness
    let randomBlob = await IC.raw_rand();
    
    let tokenId = generateTokenId(randomBlob);
    
    let tokenInfo : Types.TokenInfo = {
      id = tokenId;
      name = arg.name;
      symbol = arg.symbol;
      description = arg.description;
      logo = arg.logo;
      seed = randomBlob;
      requester = arg.requester;
      status = #pending;
      createdAt = Time.now();
      mintedAt = null;
      twitter = arg.twitter;
      website = arg.website;
      telegram = arg.telegram;
    };
    
    tokens.put(tokenId, tokenInfo);
    Debug.print("Token created: " # tokenId);
    
    {
      requestId = tokenId;
      seed = randomBlob;
    }
  };

  // Finalize token minting
  public shared(msg) func finalize_mint(requestId: Text) : async Bool {
    switch (tokens.get(requestId)) {
      case null { false };
      case (?info) {
        let updated : Types.TokenInfo = {
          id = info.id;
          name = info.name;
          symbol = info.symbol;
          description = info.description;
          logo = info.logo;
          seed = info.seed;
          requester = info.requester;
          status = #minted;
          createdAt = info.createdAt;
          mintedAt = ?Time.now();
          twitter = info.twitter;
          website = info.website;
          telegram = info.telegram;
        };
        tokens.put(requestId, updated);
        Debug.print("Token minted: " # requestId);
        true
      };
    };
  };

  // Query token status
  public query func get_token_status(requestId: Text) : async Types.QueryResponse {
    {
      info = tokens.get(requestId);
    }
  };

  // List all tokens (paginated)
  public query func list_tokens(offset: Nat, limit: Nat) : async [Types.TokenInfo] {
    let allTokens = Iter.toArray(tokens.vals());
    let end = Nat.min(offset + limit, allTokens.size());
    
    if (offset >= allTokens.size()) {
      []
    } else {
      Array.subArray(allTokens, offset, end - offset)
    };
  };

  // ========== SYSTEM ==========

  private func scheduleCleanup() : async () {
    Debug.print("Cleanup task executed at " # Int.toText(Time.now()));
  };

  ignore Timer.recurringTimer<system>(#seconds 3600, scheduleCleanup);
}
