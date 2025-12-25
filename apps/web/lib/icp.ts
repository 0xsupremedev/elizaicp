import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent'
import { AuthClient } from '@dfinity/auth-client'
import { Principal } from '@dfinity/principal'

// Copy the IDL factory from the backend
export const idlFactory = ({ IDL }: any) => {
    const LinkProof = IDL.Record({
        telegram_id: IDL.Text,
        principal: IDL.Principal,
        timestamp: IDL.Int,
    })

    const CreateMemeTokenArg = IDL.Record({
        name: IDL.Text,
        symbol: IDL.Text,
        description: IDL.Text,
        logo: IDL.Text,
        requester: IDL.Principal,
        twitter: IDL.Opt(IDL.Text),
        website: IDL.Opt(IDL.Text),
        telegram: IDL.Opt(IDL.Text),
    })

    const CreateResponse = IDL.Record({
        requestId: IDL.Text,
        seed: IDL.Vec(IDL.Nat8),
    })

    const TokenStatus = IDL.Variant({
        draft: IDL.Null,
        pending: IDL.Null,
        minted: IDL.Null,
        failed: IDL.Null,
    })

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
    })

    const QueryResponse = IDL.Record({
        info: IDL.Opt(TokenInfo),
    })

    return IDL.Service({
        prove_link: IDL.Func([IDL.Text], [IDL.Bool], []),
        get_link_proof: IDL.Func([IDL.Text], [IDL.Opt(LinkProof)], ['query']),
        list_link_proofs: IDL.Func([IDL.Nat], [IDL.Vec(LinkProof)], ['query']),
        unlink_wallet: IDL.Func([IDL.Text], [IDL.Bool], []),
        create_meme_token: IDL.Func([CreateMemeTokenArg], [CreateResponse], []),
        finalize_mint: IDL.Func([IDL.Text], [IDL.Bool], []),
        get_token_status: IDL.Func([IDL.Text], [QueryResponse], ['query']),
        list_tokens: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(TokenInfo)], ['query']),
    })
}

// TypeScript types
export interface TokenInfo {
    id: string
    name: string
    symbol: string
    description: string
    logo: string
    seed: Uint8Array
    requester: Principal
    status: { draft: null } | { pending: null } | { minted: null } | { failed: null }
    createdAt: bigint
    mintedAt: [bigint] | []
    twitter: [string] | []
    website: [string] | []
    telegram: [string] | []
}

export interface CreateMemeTokenArg {
    name: string
    symbol: string
    description: string
    logo: string
    requester: Principal
    twitter: [string] | []
    website: [string] | []
    telegram: [string] | []
}

export interface CreateResponse {
    requestId: string
    seed: Uint8Array
}

export interface LinkProof {
    telegram_id: string
    principal: Principal
    timestamp: bigint
}

export interface TokenFactoryActor {
    prove_link: (telegram_id: string) => Promise<boolean>
    get_link_proof: (telegram_id: string) => Promise<[LinkProof] | []>
    list_link_proofs: (offset: bigint) => Promise<LinkProof[]>
    unlink_wallet: (telegram_id: string) => Promise<boolean>
    create_meme_token: (arg: CreateMemeTokenArg) => Promise<CreateResponse>
    finalize_mint: (request_id: string) => Promise<boolean>
    get_token_status: (request_id: string) => Promise<{ info: [TokenInfo] | [] }>
    list_tokens: (offset: bigint, limit: bigint) => Promise<TokenInfo[]>
}

// Configuration
const CANISTER_ID = process.env.NEXT_PUBLIC_CANISTER_ID || ''
const HOST = process.env.NEXT_PUBLIC_IC_HOST || 'https://ic0.app'
const IS_LOCAL = process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic'

// Create anonymous agent for query calls
export const createAgent = async (identity?: any): Promise<HttpAgent> => {
    const agent = new HttpAgent({
        host: HOST,
        identity,
    })

    // Fetch root key for local development
    if (IS_LOCAL) {
        await agent.fetchRootKey().catch(console.error)
    }

    return agent
}

// Create actor instance
export const createActor = async (identity?: any): Promise<ActorSubclass<TokenFactoryActor>> => {
    const agent = await createAgent(identity)

    return Actor.createActor<TokenFactoryActor>(idlFactory, {
        agent,
        canisterId: CANISTER_ID,
    })
}

// Auth client singleton
let authClient: AuthClient | null = null

export const getAuthClient = async (): Promise<AuthClient> => {
    if (!authClient) {
        authClient = await AuthClient.create()
    }
    return authClient
}

// Login with Internet Identity
export const login = async (): Promise<boolean> => {
    const client = await getAuthClient()

    return new Promise((resolve) => {
        client.login({
            identityProvider: IS_LOCAL
                ? `http://localhost:4943/?canisterId=${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}`
                : 'https://identity.ic0.app',
            onSuccess: () => resolve(true),
            onError: (error) => {
                console.error('Login failed:', error)
                resolve(false)
            },
        })
    })
}

// Logout
export const logout = async (): Promise<void> => {
    const client = await getAuthClient()
    await client.logout()
}

// Get current identity
export const getIdentity = async () => {
    const client = await getAuthClient()
    return client.getIdentity()
}

// Check if authenticated
export const isAuthenticated = async (): Promise<boolean> => {
    const client = await getAuthClient()
    return await client.isAuthenticated()
}

// Get principal
export const getPrincipal = async (): Promise<Principal | null> => {
    const authenticated = await isAuthenticated()
    if (!authenticated) return null

    const identity = await getIdentity()
    return identity.getPrincipal()
}

// Utility: Convert optional to array format
export const toOptional = <T>(value: T | null | undefined): [T] | [] => {
    return value !== null && value !== undefined ? [value] : []
}

// Utility: Convert array format to optional
export const fromOptional = <T>(value: [T] | []): T | null => {
    return value.length > 0 ? value[0] : null
}

// Utility: Format token status
export const getTokenStatus = (status: TokenInfo['status']): string => {
    if ('draft' in status) return 'draft'
    if ('pending' in status) return 'pending'
    if ('minted' in status) return 'minted'
    if ('failed' in status) return 'failed'
    return 'unknown'
}

// Utility: Convert seed to hex string
export const seedToHex = (seed: Uint8Array): string => {
    return Array.from(seed)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}
