import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'ElizaICP - AI-Powered Meme Tokens on Internet Computer',
    description: 'Create AI-generated meme tokens with provable on-chain randomness using ICP and ElizaOS',
    keywords: ['ICP', 'Internet Computer', 'ElizaOS', 'AI', 'Meme Token', 'Blockchain', 'Randomness'],
    openGraph: {
        title: 'ElizaICP - AI Meme Token Creator',
        description: 'Provable on-chain randomness meets AI-powered token creation',
        type: 'website',
        images: ['/og.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ElizaICP',
        description: 'AI-Powered Meme Tokens on Internet Computer',
        images: ['/og.png'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
