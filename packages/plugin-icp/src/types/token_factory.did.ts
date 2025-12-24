// Candid IDL Factory for TokenFactory canister
// In production, generate this using: dfx generate token_factory

export const idlFactory = ({ IDL }: any) => {
    // Wallet linking types
    const LinkProof = IDL.Record({
        telegram_id: IDL.Text,
        principal: IDL.Principal,
        timestamp: IDL.Int,
    });

    // Token types
    const CreateMemeTokenArg = IDL.Record({
        name: IDL.Text,
        symbol: IDL.Text,
        description: IDL.Text,
        logo: IDL.Text,
        requester: IDL.Principal,
        twitter: IDL.Opt(IDL.Text),
        website: IDL.Opt(IDL.Text),
        telegram: IDL.Opt(IDL.Text),
    });

    const CreateResponse = IDL.Record({
        requestId: IDL.Text,
        seed: IDL.Vec(IDL.Nat8),
    });

    const TokenStatus = IDL.Variant({
        draft: IDL.Null,
        pending: IDL.Null,
        minted: IDL.Null,
        failed: IDL.Null,
    });

    const TokenInfo = IDL.Record({
        id: IDL.Text,
        name: IDL.Text,
        symbol: IDL.Text,
        description: IDL.Text,
        logo: IDL.Text,
        seed: IDL.Vec(IDL.Nat8),
        requester: IDL.Principal,
        status: TokenStatus,
        createdAt: IDL.Int,
        mintedAt: IDL.Opt(IDL.Int),
        twitter: IDL.Opt(IDL.Text),
        website: IDL.Opt(IDL.Text),
        telegram: IDL.Opt(IDL.Text),
    });

    const QueryResponse = IDL.Record({
        info: IDL.Opt(TokenInfo),
    });

    return IDL.Service({
        // Wallet linking methods
        prove_link: IDL.Func([IDL.Text], [IDL.Bool], []),
        get_link_proof: IDL.Func([IDL.Text], [IDL.Opt(LinkProof)], ['query']),
        list_link_proofs: IDL.Func([IDL.Nat], [IDL.Vec(LinkProof)], ['query']),
        unlink_wallet: IDL.Func([IDL.Text], [IDL.Bool], []),

        // Token factory methods
        create_meme_token: IDL.Func([CreateMemeTokenArg], [CreateResponse], []),
        finalize_mint: IDL.Func([IDL.Text], [IDL.Bool], []),
        get_token_status: IDL.Func([IDL.Text], [QueryResponse], ['query']),
        list_tokens: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(TokenInfo)], ['query']),
    });
};
