'use client'

import { useState } from 'react'
import Button from './Button'
import { FiSearch, FiCheckCircle, FiXCircle, FiLoader, FiExternalLink } from 'react-icons/fi'
import { useToken } from '@/hooks/useCanister'
import { getTokenStatus, seedToHex } from '@/lib/icp'

export default function VerifyForm() {
    const [requestId, setRequestId] = useState('')
    const [searchId, setSearchId] = useState<string | null>(null)
    const { token, loading, error } = useToken(searchId)

    const handleVerify = async () => {
        if (!requestId.trim()) {
            return
        }
        setSearchId(requestId.trim())
    }

    const handleReset = () => {
        setRequestId('')
        setSearchId(null)
    }

    return (
        <div>
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    placeholder="Enter request ID (from Telegram bot)"
                    className="flex-1 px-4 py-3 bg-muted border border-white/10 rounded-btn focus:outline-none focus:border-accent text-white placeholder-gray-500 font-mono text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    disabled={loading}
                />
                {searchId ? (
                    <Button onClick={handleReset} variant="outline">
                        <span>Clear</span>
                    </Button>
                ) : (
                    <Button onClick={handleVerify} disabled={loading || !requestId.trim()}>
                        {loading ? (
                            <FiLoader className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <FiSearch className="w-5 h-5" />
                                <span>Verify</span>
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="p-6 bg-muted rounded-card text-center">
                    <FiLoader className="w-6 h-6 animate-spin mx-auto mb-2 text-accent" />
                    <p className="text-gray-400 text-sm">Querying canister...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-card text-error text-sm mb-6">
                    {error}
                </div>
            )}

            {/* Not Found State */}
            {!loading && searchId && !token && !error && (
                <div className="p-6 rounded-card bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-2 mb-4">
                        <FiXCircle className="w-5 h-5 text-warning" />
                        <span className="font-medium text-warning">Token Not Found</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        No token found with ID <code className="bg-black/30 px-1 rounded font-mono">{searchId}</code>.
                        Check the ID and try again.
                    </p>
                </div>
            )}

            {/* Success State - Token Found */}
            {!loading && token && (
                <div className="p-6 rounded-card bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 mb-4">
                        <FiCheckCircle className="w-5 h-5 text-success" />
                        <span className="font-medium text-success">Verification Successful ✓</span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="text-gray-500">Token:</span>
                            <span className="ml-2 text-white font-medium">{token.name} ({token.symbol})</span>
                        </div>

                        <div>
                            <span className="text-gray-500">Description:</span>
                            <p className="mt-1 text-white/80">{token.description}</p>
                        </div>

                        <div>
                            <span className="text-gray-500">Request ID:</span>
                            <code className="ml-2 font-mono bg-black/30 px-2 py-0.5 rounded text-xs">{token.id}</code>
                        </div>

                        <div>
                            <span className="text-gray-500">Randomness Seed (32 bytes):</span>
                            <code className="block mt-1 font-mono bg-black/30 p-2 rounded text-xs break-all text-accent">
                                0x{seedToHex(token.seed)}
                            </code>
                            <p className="text-xs text-gray-500 mt-1">
                                Generated by ICP <code className="text-accent">raw_rand()</code>
                            </p>
                        </div>

                        <div>
                            <span className="text-gray-500">Status:</span>
                            <span className={`ml-2 ${getTokenStatus(token.status) === 'minted' ? 'text-success' :
                                    getTokenStatus(token.status) === 'pending' ? 'text-warning' :
                                        'text-gray-400'
                                }`}>
                                {getTokenStatus(token.status)}
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-500">Owner:</span>
                            <code className="ml-2 font-mono bg-black/30 px-2 py-0.5 rounded text-xs">
                                {token.requester.toString().slice(0, 12)}...{token.requester.toString().slice(-8)}
                            </code>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-500">Created:</span>
                                <p className="text-white text-xs mt-0.5">
                                    {new Date(Number(token.createdAt) / 1000000).toLocaleString()}
                                </p>
                            </div>
                            {token.mintedAt.length > 0 && (
                                <div>
                                    <span className="text-gray-500">Minted:</span>
                                    <p className="text-white text-xs mt-0.5">
                                        {new Date(Number(token.mintedAt[0]) / 1000000).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        {(token.website.length > 0 || token.twitter.length > 0 || token.telegram.length > 0) && (
                            <div className="pt-3 border-t border-white/10">
                                <span className="text-gray-500 text-xs">Links:</span>
                                <div className="flex gap-3 mt-2">
                                    {token.website.length > 0 && (
                                        <a
                                            href={token.website[0]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent hover:text-accent-hover text-xs flex items-center gap-1"
                                        >
                                            Website <FiExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                    {token.twitter.length > 0 && (
                                        <a
                                            href={token.twitter[0]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent hover:text-accent-hover text-xs flex items-center gap-1"
                                        >
                                            Twitter <FiExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                    {token.telegram.length > 0 && (
                                        <a
                                            href={token.telegram[0]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent hover:text-accent-hover text-xs flex items-center gap-1"
                                        >
                                            Telegram <FiExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="pt-3 border-t border-white/10">
                            <p className="text-xs text-gray-500">
                                ✓ This seed was generated by ICP's threshold BLS cryptography and stored immutably on-chain.
                            </p>
                            <a
                                href={`https://dashboard.internetcomputer.org/canister/${process.env.NEXT_PUBLIC_CANISTER_ID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 mt-2"
                            >
                                View on IC Dashboard <FiExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
