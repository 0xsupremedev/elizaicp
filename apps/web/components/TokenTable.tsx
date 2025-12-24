import StatusBadge from './StatusBadge'
import ExternalLink from './ExternalLink'
import { formatDate, shortHash } from '@/lib/utils'

interface Token {
    id: string
    name: string
    symbol: string
    status: 'pending' | 'minted' | 'failed' | 'draft'
    seedHash: string
    createdAt: string
    canisterId: string
}

interface TokenTableProps {
    tokens: Token[]
}

export default function TokenTable({ tokens }: TokenTableProps) {
    if (tokens.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 text-sm">
                No tokens created yet. Use the Telegram bot to create one.
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-xs text-gray-500 border-b border-white/5">
                        <th className="px-4 py-3 font-medium">Token</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Seed Hash</th>
                        <th className="px-4 py-3 font-medium">Created</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token) => (
                        <tr key={token.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="px-4 py-4">
                                <div>
                                    <span className="font-medium text-white">{token.name}</span>
                                    <span className="text-gray-500 ml-2 text-sm">({token.symbol})</span>
                                </div>
                                <div className="text-xs text-gray-600 font-mono mt-0.5">{token.id}</div>
                            </td>
                            <td className="px-4 py-4">
                                <StatusBadge status={token.status} />
                            </td>
                            <td className="px-4 py-4">
                                <code className="text-xs text-accent font-mono">
                                    {shortHash(token.seedHash)}
                                </code>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-400">
                                {formatDate(token.createdAt)}
                            </td>
                            <td className="px-4 py-4">
                                <ExternalLink
                                    href={`https://dashboard.internetcomputer.org/canister/${token.canisterId}`}
                                    label="View"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
