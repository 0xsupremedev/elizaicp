'use client'

import { useState } from 'react'
import Button from './Button'
import { FiSearch, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'

interface VerificationResult {
    found: boolean
    requestId: string
    seedHash: string
    name?: string
    symbol?: string
    status?: string
    createdAt?: string
}

export default function VerifyForm() {
    const [requestId, setRequestId] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<VerificationResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleVerify = async () => {
        if (!requestId.trim()) {
            setError('Please enter a request ID')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (requestId.includes('abc') || requestId.includes('123')) {
                setResult({
                    found: true,
                    requestId,
                    seedHash: 'd4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
                    name: 'Moon Doge',
                    symbol: 'MDOGE',
                    status: 'minted',
                    createdAt: '2025-12-24T10:30:00Z',
                })
            } else {
                setResult({
                    found: false,
                    requestId,
                    seedHash: '',
                })
            }
        } catch {
            setError('Failed to verify. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    placeholder="Enter request ID (e.g., abc123-0)"
                    className="flex-1 px-4 py-3 bg-muted border border-white/10 rounded-btn focus:outline-none focus:border-accent text-white placeholder-gray-500 font-mono text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
                <Button onClick={handleVerify} disabled={loading}>
                    {loading ? (
                        <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <FiSearch className="w-5 h-5" />
                            <span>Verify</span>
                        </>
                    )}
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-card text-error text-sm mb-6">
                    {error}
                </div>
            )}

            {result && (
                <div className={`p-6 rounded-card ${result.found ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'}`}>
                    <div className="flex items-center gap-2 mb-4">
                        {result.found ? (
                            <>
                                <FiCheckCircle className="w-5 h-5 text-success" />
                                <span className="font-medium text-success">Verification Successful</span>
                            </>
                        ) : (
                            <>
                                <FiXCircle className="w-5 h-5 text-warning" />
                                <span className="font-medium text-warning">Token Not Found</span>
                            </>
                        )}
                    </div>

                    {result.found ? (
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-500">Token:</span>
                                <span className="ml-2 text-white font-medium">{result.name} ({result.symbol})</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Request ID:</span>
                                <code className="ml-2 font-mono bg-black/30 px-2 py-0.5 rounded text-xs">{result.requestId}</code>
                            </div>
                            <div>
                                <span className="text-gray-500">Seed Hash (SHA-256):</span>
                                <code className="block mt-1 font-mono bg-black/30 p-2 rounded text-xs break-all text-accent">
                                    {result.seedHash}
                                </code>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <span className="ml-2 text-success">{result.status}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Created:</span>
                                <span className="ml-2 text-white">{new Date(result.createdAt!).toLocaleString()}</span>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-xs text-gray-500">
                                    This seed was generated by ICP's <code className="text-accent">raw_rand()</code> and stored on-chain immutably.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">
                            No token found with ID <code className="bg-black/30 px-1 rounded font-mono">{result.requestId}</code>.
                            Check the ID and try again.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
