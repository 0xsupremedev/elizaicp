const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchTokens() {
    const res = await fetch(`${API_URL}/tokens`)
    if (!res.ok) throw new Error('Failed to fetch tokens')
    return res.json()
}

export async function fetchTokenStatus(requestId: string) {
    const res = await fetch(`${API_URL}/status/${requestId}`)
    if (!res.ok) throw new Error('Failed to fetch token status')
    return res.json()
}

export async function verifyRandomness(requestId: string) {
    const res = await fetch(`${API_URL}/verify/${requestId}`)
    if (!res.ok) throw new Error('Failed to verify randomness')
    return res.json()
}

export async function checkHealth() {
    const res = await fetch(`${API_URL}/health`)
    return res.json()
}
