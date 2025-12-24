import TokenTable from '@/components/TokenTable'
import Button from '@/components/Button'
import { FiRefreshCw, FiExternalLink, FiActivity } from 'react-icons/fi'

const mockTokens = [
    {
        id: 'abc123-0',
        name: 'Moon Doge',
        symbol: 'MDOGE',
        status: 'minted' as const,
        seedHash: 'd4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9',
        createdAt: '2025-12-24T10:30:00Z',
        canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    },
    {
        id: 'def456-1',
        name: 'Rocket Cat',
        symbol: 'RCAT',
        status: 'pending' as const,
        seedHash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
        createdAt: '2025-12-24T11:00:00Z',
        canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    },
    {
        id: 'ghi789-2',
        name: 'Crypto Pepe',
        symbol: 'CPEPE',
        status: 'minted' as const,
        seedHash: 'f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6',
        createdAt: '2025-12-24T09:15:00Z',
        canisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    },
]

export default function DemoPage() {
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
                        <div className="text-2xl font-semibold text-accent mb-1">12</div>
                        <div className="text-xs text-gray-500">Tokens Created</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-semibold text-success mb-1">8</div>
                        <div className="text-xs text-gray-500">Minted</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-semibold text-warning mb-1">4</div>
                        <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div className="card text-center">
                        <div className="flex items-center justify-center gap-2">
                            <FiActivity className="w-4 h-4 text-success" />
                            <span className="text-sm text-success">Live</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">From ICP</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Button variant="outline" href="#">
                        <FiRefreshCw className="w-4 h-4" />
                        <span>Refresh Data</span>
                    </Button>
                    <Button
                        variant="outline"
                        href={`https://dashboard.internetcomputer.org/canister/${process.env.NEXT_PUBLIC_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai'}`}
                        external
                    >
                        <FiExternalLink className="w-4 h-4" />
                        <span>View Canister Dashboard</span>
                    </Button>
                </div>

                {/* Token Table */}
                <div className="card p-0 overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="font-medium text-white">Recent Tokens</h2>
                    </div>
                    <TokenTable tokens={mockTokens} />
                </div>

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
