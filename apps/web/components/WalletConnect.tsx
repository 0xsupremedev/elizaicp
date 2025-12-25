'use client'

import { useState, useEffect } from 'react'
import { FiUser, FiLogIn, FiLogOut } from 'react-icons/fi'
import { login, logout, isAuthenticated, getPrincipal } from '@/lib/icp'
import { Principal } from '@dfinity/principal'

export default function WalletConnect() {
    const [isConnected, setIsConnected] = useState(false)
    const [principal, setPrincipal] = useState<Principal | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check authentication on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        setIsLoading(true)
        try {
            const authenticated = await isAuthenticated()
            setIsConnected(authenticated)

            if (authenticated) {
                const p = await getPrincipal()
                setPrincipal(p)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            const success = await login()
            if (success) {
                await checkAuth()
            }
        } catch (error) {
            console.error('Login failed:', error)
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await logout()
            setIsConnected(false)
            setPrincipal(null)
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatPrincipal = (p: Principal): string => {
        const str = p.toString()
        if (str.length <= 12) return str
        return `${str.slice(0, 6)}...${str.slice(-4)}`
    }

    if (isLoading) {
        return (
            <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-card border border-white/10 rounded-lg text-gray-500 text-sm"
            >
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
            </button>
        )
    }

    if (isConnected && principal) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-card border border-accent/30 rounded-lg text-sm">
                    <FiUser className="w-4 h-4 text-accent" />
                    <span className="text-white font-mono">{formatPrincipal(principal)}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/30 transition-colors text-sm"
                >
                    <FiLogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover transition-colors rounded-lg text-white text-sm font-medium"
        >
            <FiLogIn className="w-4 h-4" />
            <span>Connect Wallet</span>
        </button>
    )
}
