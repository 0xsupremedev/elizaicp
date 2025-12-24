'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/Button'
import { FiCheckCircle, FiXCircle, FiLoader, FiShield, FiLink, FiExternalLink } from 'react-icons/fi'
import { SiInternetcomputer } from 'react-icons/si'

type LinkStatus = 'idle' | 'connecting' | 'proving' | 'success' | 'error'

export default function LinkPage() {
    const searchParams = useSearchParams()
    const telegramId = searchParams.get('tg') || ''

    const [status, setStatus] = useState<LinkStatus>('idle')
    const [principal, setPrincipal] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [timestamp, setTimestamp] = useState<string | null>(null)

    const handleConnect = async () => {
        if (!telegramId) {
            setError('Missing Telegram ID. Please use the link from the Telegram bot.')
            return
        }

        setStatus('connecting')
        setError(null)

        try {
            // Dynamic import to avoid SSR issues
            const { AuthClient } = await import('@dfinity/auth-client')
            const { HttpAgent, Actor } = await import('@dfinity/agent')

            const authClient = await AuthClient.create()

            // Login with Internet Identity
            await new Promise<void>((resolve, reject) => {
                authClient.login({
                    identityProvider: 'https://identity.ic0.app',
                    onSuccess: () => resolve(),
                    onError: (err) => reject(new Error(err || 'Login failed')),
                })
            })

            const identity = authClient.getIdentity()
            const principalId = identity.getPrincipal().toText()
            setPrincipal(principalId)

            setStatus('proving')

            // Create agent and actor
            const agent = new HttpAgent({
                identity,
                host: 'https://ic0.app',
            })

            // In production, remove this - only for local development
            if (process.env.NODE_ENV === 'development') {
                await agent.fetchRootKey()
            }

            const canisterId = process.env.NEXT_PUBLIC_CANISTER_ID
            if (!canisterId) {
                throw new Error('Canister ID not configured')
            }

            // IDL factory for prove_link
            const idlFactory = ({ IDL }: { IDL: any }) => {
                return IDL.Service({
                    prove_link: IDL.Func([IDL.Text], [IDL.Bool], []),
                })
            }

            const actor = Actor.createActor(idlFactory, {
                agent,
                canisterId,
            })

            // Call prove_link on canister
            const result = await actor.prove_link(telegramId)

            if (result) {
                setStatus('success')
                setTimestamp(new Date().toISOString())
            } else {
                throw new Error('Canister rejected the link request')
            }

        } catch (err) {
            console.error('Link error:', err)
            setError(err instanceof Error ? err.message : 'An error occurred')
            setStatus('error')
        }
    }

    const shortenPrincipal = (p: string) => {
        if (p.length <= 20) return p
        return `${p.slice(0, 10)}...${p.slice(-10)}`
    }

    return (
        <div className="section min-h-[80vh] flex items-center">
            <div className="container max-w-lg">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiLink className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-h2 text-white mb-2">Link Your Wallet</h1>
                    <p className="text-gray-400">
                        Connect your Internet Identity to verify wallet ownership on-chain.
                    </p>
                </div>

                {telegramId ? (
                    <div className="card">
                        {status === 'idle' && (
                            <div className="text-center space-y-6">
                                <div className="p-4 bg-muted rounded-card">
                                    <p className="text-sm text-gray-400 mb-1">Telegram ID</p>
                                    <code className="text-lg font-mono text-accent">{telegramId}</code>
                                </div>

                                <div className="text-left space-y-3 text-sm text-gray-400">
                                    <div className="flex items-start gap-3">
                                        <FiShield className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                        <span>No private keys are shared</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FiShield className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                        <span>Proof is stored on-chain in ICP canister</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FiShield className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                        <span>Anyone can verify the link publicly</span>
                                    </div>
                                </div>

                                <Button onClick={handleConnect} variant="primary" className="w-full">
                                    <SiInternetcomputer className="w-5 h-5" />
                                    <span>Connect Internet Identity</span>
                                </Button>

                                <p className="text-xs text-gray-600">
                                    This will open the Internet Identity login dialog.
                                </p>
                            </div>
                        )}

                        {status === 'connecting' && (
                            <div className="text-center py-8">
                                <FiLoader className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                                <p className="text-gray-400">Connecting to Internet Identity...</p>
                                <p className="text-sm text-gray-600 mt-2">Please complete authentication in the popup.</p>
                            </div>
                        )}

                        {status === 'proving' && (
                            <div className="text-center py-8">
                                <FiLoader className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                                <p className="text-gray-400">Creating on-chain proof...</p>
                                <p className="text-sm text-gray-600 mt-2">Calling canister with your principal.</p>
                            </div>
                        )}

                        {status === 'success' && principal && (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                                    <FiCheckCircle className="w-8 h-8 text-success" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-2">Wallet Linked Successfully</h2>
                                    <p className="text-gray-400 text-sm">Your identity is now verified on-chain.</p>
                                </div>

                                <div className="p-4 bg-muted rounded-card text-left space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Telegram ID</p>
                                        <code className="text-sm font-mono text-white">{telegramId}</code>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Principal</p>
                                        <code className="text-sm font-mono text-accent">{shortenPrincipal(principal)}</code>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Timestamp</p>
                                        <code className="text-sm font-mono text-white">{timestamp}</code>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        href={`https://dashboard.internetcomputer.org/canister/${process.env.NEXT_PUBLIC_CANISTER_ID}`}
                                        external
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <FiExternalLink className="w-4 h-4" />
                                        <span>View Canister</span>
                                    </Button>
                                    <Button href="/" variant="primary" className="flex-1">
                                        <span>Return Home</span>
                                    </Button>
                                </div>

                                <p className="text-xs text-gray-600">
                                    You can now close this page. Return to Telegram to continue.
                                </p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                                    <FiXCircle className="w-8 h-8 text-error" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-2">Link Failed</h2>
                                    <p className="text-error text-sm">{error}</p>
                                </div>

                                <Button onClick={handleConnect} variant="primary" className="w-full">
                                    <span>Try Again</span>
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="card text-center">
                        <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiXCircle className="w-8 h-8 text-warning" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Missing Telegram ID</h2>
                        <p className="text-gray-400 text-sm mb-4">
                            Please use the link provided by the Telegram bot to link your wallet.
                        </p>
                        <Button href="/" variant="outline">
                            <span>Return Home</span>
                        </Button>
                    </div>
                )}

                {/* How it works */}
                <div className="mt-8 p-4 bg-card/30 rounded-card">
                    <h3 className="font-medium text-white mb-3">How Verification Works</h3>
                    <ol className="text-sm text-gray-400 space-y-2">
                        <li className="flex gap-2">
                            <span className="text-accent font-medium">1.</span>
                            <span>You authenticate with Internet Identity</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-accent font-medium">2.</span>
                            <span>Your browser calls the canister with your principal</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-accent font-medium">3.</span>
                            <span>Canister records msg.caller as cryptographic proof</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-accent font-medium">4.</span>
                            <span>Anyone can query the proof on-chain</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
