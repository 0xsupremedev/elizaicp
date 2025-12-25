'use client'

import { useState, useEffect } from 'react'
import { createActor, TokenInfo, getIdentity, isAuthenticated, CreateMemeTokenArg } from '@/lib/icp'
import type { ActorSubclass } from '@dfinity/agent'
import type { TokenFactoryActor } from '@/lib/icp'

// Hook to get canister actor
export function useActor() {
    const [actor, setActor] = useState<ActorSubclass<TokenFactoryActor> | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initActor = async () => {
            try {
                const authenticated = await isAuthenticated()
                const identity = authenticated ? await getIdentity() : undefined
                const actorInstance = await createActor(identity)
                setActor(actorInstance)
            } catch (error) {
                console.error('Failed to create actor:', error)
            } finally {
                setLoading(false)
            }
        }

        initActor()
    }, [])

    return { actor, loading }
}

// Hook to fetch tokens list
export function useTokens(offset: number = 0, limit: number = 10) {
    const { actor, loading: actorLoading } = useActor()
    const [tokens, setTokens] = useState<TokenInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!actor || actorLoading) return

        const fetchTokens = async () => {
            setLoading(true)
            setError(null)
            try {
                const result = await actor.list_tokens(BigInt(offset), BigInt(limit))
                setTokens(result)
            } catch (err) {
                console.error('Failed to fetch tokens:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch tokens')
            } finally {
                setLoading(false)
            }
        }

        fetchTokens()
    }, [actor, actorLoading, offset, limit])

    return { tokens, loading: loading || actorLoading, error }
}

// Hook to fetch single token by ID
export function useToken(requestId: string | null) {
    const { actor, loading: actorLoading } = useActor()
    const [token, setToken] = useState<TokenInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!actor || actorLoading || !requestId) {
            setLoading(false)
            return
        }

        const fetchToken = async () => {
            setLoading(true)
            setError(null)
            try {
                const result = await actor.get_token_status(requestId)
                if (result.info.length > 0) {
                    setToken(result.info[0])
                } else {
                    setToken(null)
                    setError('Token not found')
                }
            } catch (err) {
                console.error('Failed to fetch token:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch token')
            } finally {
                setLoading(false)
            }
        }

        fetchToken()
    }, [actor, actorLoading, requestId])

    return { token, loading: loading || actorLoading, error }
}

// Hook to create token
export function useCreateToken() {
    const { actor } = useActor()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createToken = async (arg: CreateMemeTokenArg) => {
        if (!actor) {
            setError('Wallet not connected')
            return null
        }

        setLoading(true)
        setError(null)
        try {
            const result = await actor.create_meme_token(arg)
            return result
        } catch (err) {
            console.error('Failed to create token:', err)
            setError(err instanceof Error ? err.message : 'Failed to create token')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { createToken, loading, error }
}

// Hook to get link proof
export function useLinkProof(telegramId: string | null) {
    const { actor, loading: actorLoading } = useActor()
    const [linkProof, setLinkProof] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!actor || actorLoading || !telegramId) {
            setLoading(false)
            return
        }

        const fetchLinkProof = async () => {
            setLoading(true)
            setError(null)
            try {
                const result = await actor.get_link_proof(telegramId)
                if (result.length > 0) {
                    setLinkProof(result[0])
                } else {
                    setLinkProof(null)
                }
            } catch (err) {
                console.error('Failed to fetch link proof:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch link proof')
            } finally {
                setLoading(false)
            }
        }

        fetchLinkProof()
    }, [actor, actorLoading, telegramId])

    return { linkProof, loading: loading || actorLoading, error }
}
