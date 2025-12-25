'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck, FiZap, FiMessageCircle, FiArrowRight } from 'react-icons/fi'

interface FluidCTAProps {
    buttonText?: string
    onTelegramClick?: () => void
}

export default function FluidCTA({
    buttonText = 'Start Creating',
    onTelegramClick
}: FluidCTAProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const handleExpand = () => {
        setIsExpanded(true)
    }

    const handleClose = () => {
        setIsExpanded(false)
    }

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isExpanded])

    return (
        <>
            <AnimatePresence initial={false}>
                {!isExpanded && (
                    <motion.div className="inline-block relative">
                        <motion.div
                            style={{
                                borderRadius: '100px',
                            }}
                            layout
                            layoutId="cta-card"
                            className="absolute inset-0 bg-gradient-to-r from-accent to-purple-600 items-center justify-center transform-gpu will-change-transform"
                        ></motion.div>
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout={false}
                            onClick={handleExpand}
                            className="h-14 px-8 py-3 text-lg font-medium text-white tracking-[-0.01em] relative flex items-center gap-2"
                        >
                            <FiZap className="w-5 h-5" />
                            {buttonText}
                            <FiArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
                        <motion.div
                            layoutId="cta-card"
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            style={{
                                borderRadius: '24px',
                            }}
                            layout
                            className="relative flex h-full w-full max-w-5xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#7c3aed] transform-gpu will-change-transform shadow-2xl"
                        >
                            {/* Animated background pattern */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 overflow-hidden pointer-events-none"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,0,0,0.2)_0%,_transparent_50%)]" />
                                {/* Animated circles */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.1, 0.2, 0.1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                                />
                                <motion.div
                                    animate={{
                                        scale: [1.2, 1, 1.2],
                                        opacity: [0.1, 0.15, 0.1]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="relative z-10 flex flex-col lg:flex-row h-full w-full overflow-y-auto"
                            >
                                {/* Left Side - Info */}
                                <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
                                            Create AI-Powered
                                            <br />
                                            <span className="text-white/80">Meme Tokens</span>
                                        </h2>

                                        <p className="text-lg text-white/70 mb-8 max-w-md">
                                            Launch your token with GPT-4 enhanced descriptions, DALL-E generated logos, and verifiable on-chain randomness.
                                        </p>
                                    </motion.div>

                                    <div className="space-y-4">
                                        {[
                                            { text: 'AI-generated descriptions & logos', delay: 0.25 },
                                            { text: 'Cryptographically secure randomness', delay: 0.3 },
                                            { text: 'Deploy on Internet Computer', delay: 0.35 },
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: item.delay }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                                                    <FiCheck className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-white/90">{item.text}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Testimonial */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-10 pt-8 border-t border-white/20"
                                    >
                                        <p className="text-lg text-white/80 italic mb-4">
                                            "ElizaICP makes token creation effortless with its seamless AI integration."
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                                                E
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">ElizaOS Community</p>
                                                <p className="text-white/60 text-sm">ICP Ecosystem</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right Side - CTA Actions */}
                                <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 bg-black/10 backdrop-blur-sm">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.25 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-semibold text-white mb-6">
                                            Get Started Now
                                        </h3>

                                        {/* Primary CTA - Telegram */}
                                        <a
                                            href={process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/eliza_icp_bot'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-[#4f46e5] font-semibold text-lg hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            onClick={onTelegramClick}
                                        >
                                            <FiMessageCircle className="w-6 h-6" />
                                            Open Telegram Bot
                                        </a>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-white/20"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-4 bg-transparent text-white/60">or</span>
                                            </div>
                                        </div>

                                        {/* Secondary CTA - Demo */}
                                        <a
                                            href="/demo"
                                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-lg hover:bg-white/20 transition-all"
                                        >
                                            View Live Demo
                                            <FiArrowRight className="w-5 h-5" />
                                        </a>

                                        {/* Feature highlights */}
                                        <div className="grid grid-cols-2 gap-4 pt-6">
                                            <div className="text-center p-4 rounded-lg bg-white/5">
                                                <p className="text-3xl font-bold text-white">100%</p>
                                                <p className="text-sm text-white/60">On-Chain</p>
                                            </div>
                                            <div className="text-center p-4 rounded-lg bg-white/5">
                                                <p className="text-3xl font-bold text-white">AI</p>
                                                <p className="text-sm text-white/60">Powered</p>
                                            </div>
                                        </div>

                                        <p className="text-center text-white/50 text-sm pt-4">
                                            No signup required. Start creating in seconds.
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Close Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={handleClose}
                                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-colors rounded-full backdrop-blur-sm"
                                aria-label="Close"
                            >
                                <FiX className="h-5 w-5" />
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
