import { HttpAgent, Actor, ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { idlFactory } from '../../types/token_factory.did';

export interface TokenFactoryActor {
    create_meme_token: (arg: CreateMemeTokenArg) => Promise<CreateResponse>;
    finalize_mint: (requestId: string) => Promise<boolean>;
    get_token_status: (requestId: string) => Promise<QueryResponse>;
    list_tokens: (offset: bigint, limit: bigint) => Promise<TokenInfo[]>;
}

export interface CreateMemeTokenArg {
    name: string;
    symbol: string;
    description: string;
    logo: string;
    requester: Principal;
    twitter: [] | [string];
    website: [] | [string];
    telegram: [] | [string];
}

export interface CreateResponse {
    requestId: string;
    seed: Uint8Array;
}

export interface TokenInfo {
    id: string;
    name: string;
    symbol: string;
    description: string;
    logo: string;
    seed: Uint8Array;
    requester: Principal;
    status: { draft: null } | { pending: null } | { minted: null } | { failed: null };
    createdAt: bigint;
    mintedAt: [] | [bigint];
    twitter: [] | [string];
    website: [] | [string];
    telegram: [] | [string];
}

export interface QueryResponse {
    info: [] | [TokenInfo];
}

let agentInstance: HttpAgent | null = null;
let actorInstance: ActorSubclass<TokenFactoryActor> | null = null;

/**
 * Initialize ICP agent with identity from private key
 */
export function initializeAgent(): HttpAgent {
    if (agentInstance) {
        return agentInstance;
    }

    const privateKey = process.env.INTERNET_COMPUTER_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('INTERNET_COMPUTER_PRIVATE_KEY not set');
    }

    // Parse hex private key (64 hex chars = 32 bytes)
    const keyBytes = Uint8Array.from(
        Buffer.from(privateKey, 'hex')
    );

    const identity = Ed25519KeyIdentity.fromSecretKey(keyBytes);

    const host = process.env.ICP_HOST || 'https://ic0.app';
    agentInstance = new HttpAgent({ identity, host });

    // Fetch root key only for local development
    if (process.env.DFX_NETWORK !== 'ic') {
        agentInstance.fetchRootKey().catch((err: Error) => {
            console.warn('Unable to fetch root key:', err);
        });
    }

    return agentInstance;
}

/**
 * Get TokenFactory canister actor
 */
export function getTokenFactoryActor(): ActorSubclass<TokenFactoryActor> {
    if (actorInstance) {
        return actorInstance;
    }

    const agent = initializeAgent();
    const canisterId = process.env.TOKEN_FACTORY_CANISTER_ID;

    if (!canisterId) {
        throw new Error('TOKEN_FACTORY_CANISTER_ID not set');
    }

    actorInstance = Actor.createActor<TokenFactoryActor>(idlFactory, {
        agent,
        canisterId,
    });

    return actorInstance;
}

/**
 * Helper to convert optional fields to ICP format
 */
export function toOptional<T>(value: T | undefined | null): [] | [T] {
    return value ? [value] : [];
}

/**
 * Helper to convert ICP optional to JS
 */
export function fromOptional<T>(opt: [] | [T]): T | undefined {
    return opt.length > 0 ? opt[0] : undefined;
}

/**
 * Reset actor (for reconnection after errors)
 */
export function resetActor(): void {
    actorInstance = null;
    agentInstance = null;
}
