export interface Token {
    id: string
    name: string
    symbol: string
    description: string
    status: 'draft' | 'pending' | 'minted' | 'failed'
    seedHash: string
    createdAt: string
    mintedAt?: string
    canisterId: string
    logoUrl?: string
}

export interface VerificationResult {
    found: boolean
    requestId: string
    seedHash: string
    name?: string
    symbol?: string
    status?: string
    createdAt?: string
    canisterId?: string
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export interface HealthStatus {
    status: 'ok' | 'error'
    timestamp: string
    service: string
}
