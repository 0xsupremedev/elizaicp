'use client'

import Link from 'next/link'
import Button from './Button'
import { FiMessageCircle, FiMenu, FiX, FiGithub, FiMoon, FiSun } from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('theme')
        if (stored === 'light') {
            setDarkMode(false)
            document.documentElement.classList.add('light')
        }
    }, [])

    const toggleTheme = () => {
        setDarkMode(!darkMode)
        if (darkMode) {
            document.documentElement.classList.add('light')
            localStorage.setItem('theme', 'light')
        } else {
            document.documentElement.classList.remove('light')
            localStorage.setItem('theme', 'dark')
        }
    }

    return (
        <header className="sticky top-0 z-50 bg-main/80 backdrop-blur-md border-b border-white/5">
            <div className="container py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-white">ElizaICP</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/demo" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                            Demo
                        </Link>
                        <Link href="/verify" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                            Verify
                        </Link>
                        <a
                            href={process.env.NEXT_PUBLIC_GITHUB_URL || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <FiGithub className="w-5 h-5" />
                        </a>
                        <button
                            onClick={toggleTheme}
                            className="text-gray-400 hover:text-white transition-colors p-2"
                        >
                            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </button>
                        <Button
                            href={process.env.NEXT_PUBLIC_TELEGRAM_URL || '#'}
                            external
                            variant="primary"
                            size="sm"
                        >
                            <FiMessageCircle className="w-4 h-4" />
                            <span>Telegram</span>
                        </Button>
                    </nav>

                    <button
                        className="md:hidden p-2 text-gray-400"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {menuOpen && (
                    <nav className="md:hidden pt-4 pb-2 space-y-3">
                        <Link
                            href="/demo"
                            className="block py-2 text-gray-400 hover:text-white text-sm"
                            onClick={() => setMenuOpen(false)}
                        >
                            Demo
                        </Link>
                        <Link
                            href="/verify"
                            className="block py-2 text-gray-400 hover:text-white text-sm"
                            onClick={() => setMenuOpen(false)}
                        >
                            Verify
                        </Link>
                        <Button
                            href={process.env.NEXT_PUBLIC_TELEGRAM_URL || '#'}
                            external
                            variant="primary"
                            className="w-full mt-2"
                        >
                            <FiMessageCircle className="w-4 h-4" />
                            <span>Open Telegram Bot</span>
                        </Button>
                    </nav>
                )}
            </div>
        </header>
    )
}
