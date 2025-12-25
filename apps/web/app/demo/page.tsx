'use client'

import { useState } from 'react'
import TokenTable from '@/components/TokenTable'
import Button from '@/components/Button'
import { FiRefreshCw, FiExternalLink, FiActivity, FiAlertCircle } from 'react-icons/fi'
import { useTokens } from '@/hooks/useCanister'
import { getTokenStatus, seedToHex } from '@/lib/icp'

export default function DemoPage() {
    const [refreshKey, setRefreshKey] = useState(0)
    const { tokens, loading, error } = useTokens(0, 20)

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
        window.location.reload()
    }

    // Calculate stats from real tokens
    const stats = {
        total: tokens.length,
        minted: tokens.filter(t => getTokenStatus(t.status) === 'minted').length,
        pending: tokens.filter(t => getTokenStatus(t.status) === 'pending').length,
        draft: tokens.filter(t => getTokenStatus(t.status) === 'draft').length,
    }

    // Convert ICP tokens to UI format
    const uiTokens = tokens.map(t => ({
        id: t.id,
        name: t.name,
        symbol: t.symbol,
        status: getTokenStatus(t.status) as 'minted' | 'pending' | 'draft' | 'failed',
        seedHash: seedToHex(t.seed),
        createdAt: new Date(Number(t.createdAt) / 1000000).toISOString(), // Convert nanoseconds to ms
        canisterId: process.env.NEXT_PUBLIC_CANISTER_ID || '',
    }))

    return (
        <div className="section">
            <div className="container">
                <div className="text-center mb-12">
                    <h1 className="text-h2 text-white mb-4">Live Demo</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Real tokens created on the Internet Computer with provable on-chain randomness.
                        All seed hashes are independently verifiable.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="card text-center">
                        <div className="text-2xl font-semibold text-accent mb-1">
                            {loading ? '...' : stats.total}
                        </div>
                        <div className="text-xs text-gray-500">Tokens Created</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-semibold text-success mb-1">
                            {loading ? '...' : stats.minted}
                        </div>
                        <div className="text-xs text-gray-500">Minted</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-semibold text-warning mb-1">
                            {loading ? '...' : stats.pending}
                        </div>
                        <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div className="card text-center">
                        <div className="flex items-center justify-center gap-2">
                            <FiActivity className="w-4 h-4 text-success animate-pulse" />
                            <span className="text-sm text-success">Live</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">From ICP</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                        <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>{loading ? 'Loading...' : 'Refresh Data'}</span>
                    </Button>
                    <Button
                        variant="outline"
                        href={`https://dashboard.internetcomputer.org/canister/${process.env.NEXT_PUBLIC_CANISTER_ID || ''}`}
                        external
                    >
                        <FiExternalLink className="w-4 h-4" />
                        <span>View Canister Dashboard</span>
                    </Button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                        <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-400 font-medium">Error loading tokens</p>
                            <p className="text-red-400/80 text-sm">{error}</p>
                            <p className="text-gray-500 text-xs mt-2">
                                Make sure NEXT_PUBLIC_CANISTER_ID is set in your .env file
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && !error && (
                    <div className="card p-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Loading tokens from canister...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && tokens.length === 0 && (
                    <div className="card p-12 text-center">
                        <p className="text-gray-400 mb-4">No tokens found</p>
                        <p className="text-gray-500 text-sm">
                            Create your first token via Telegram bot!
                        </p>
                        <Button
                            href={process.env.NEXT_PUBLIC_TELEGRAM_URL || '#'}
                            external
                            variant="primary"
                            className="mt-4"
                        >
                            Open Telegram Bot
                        </Button>
                    </div>
                )}

                {/* Token Table - Only show if we have data */}
                {!loading && !error && tokens.length > 0 && (
                    <div className="card p-0 overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                            <h2 className="font-medium text-white">Recent Tokens</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Showing {tokens.length} token{tokens.length !== 1 ? 's' : ''} from the canister
                            </p>
                        </div>
                        <TokenTable tokens={uiTokens} />
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 p-4 bg-accent/5 border border-accent/10 rounded-card">
                    <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                        <FiExternalLink className="w-4 h-4 text-accent" />
                        How to Verify
                    </h3>
                    <p className="text-sm text-gray-400">
                        Click on any seed hash to verify it on the ICP dashboard. The 32-byte seed is generated
                        by <code className="text-accent">raw_rand()</code> and stored immutably on-chain.
                        You can independently verify that the randomness was not manipulated.
                    </p>
                </div>
            </div>
        </div>
    )
}
