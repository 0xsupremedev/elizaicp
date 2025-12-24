import Button from '@/components/Button'
import { FiMessageCircle, FiArrowRight, FiShield, FiZap, FiLock, FiCpu } from 'react-icons/fi'
import { SiInternetcomputer } from 'react-icons/si'

export default function HomePage() {
    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="section py-24">
                <div className="container text-center">
                    <h1 className="text-h1 text-white mb-6 max-w-4xl mx-auto">
                        AI-Powered Meme Tokens with{' '}
                        <span className="text-accent">Provable On-Chain Randomness</span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                        Create, verify, and audit AI-generated tokens on the Internet Computer
                        using verifiable randomness from ICP's threshold cryptography.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Button href={process.env.NEXT_PUBLIC_TELEGRAM_URL || '#'} external variant="primary" size="lg">
                            <FiMessageCircle className="w-5 h-5" />
                            <span>Open Telegram Bot</span>
                        </Button>
                        <Button href="/demo" variant="secondary" size="lg">
                            <span>View Live Demo</span>
                            <FiArrowRight className="w-5 h-5" />
                        </Button>
                        <Button href="/verify" variant="outline" size="lg">
                            <FiShield className="w-5 h-5" />
                            <span>Verify Randomness</span>
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex items-center justify-center gap-8 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                            <SiInternetcomputer className="w-5 h-5" />
                            <span>Built on ICP</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiLock className="w-4 h-4" />
                            <span>Verifiable</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCpu className="w-4 h-4" />
                            <span>AI-Native</span>
                        </div>
                    </div>

                    {/* Network badge */}
                    <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs text-accent">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        <span>Testnet - Real ICP Canister</span>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="section bg-card/50">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                <FiZap className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Provable Fairness</h3>
                            <p className="text-gray-400 text-sm">
                                Uses ICP <code>raw_rand</code> — threshold BLS signatures from 2/3 subnet consensus.
                                Not off-chain RNG.
                            </p>
                        </div>

                        <div className="card">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                <FiCpu className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">AI Native</h3>
                            <p className="text-gray-400 text-sm">
                                GPT-4 powered metadata generation. DALL-E 3 logo creation.
                                Autonomous agent architecture.
                            </p>
                        </div>

                        <div className="card">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                <FiLock className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Fully On-Chain</h3>
                            <p className="text-gray-400 text-sm">
                                Tokens, randomness seeds, and verification data live on ICP.
                                Immutable and auditable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section">
                <div className="container max-w-3xl">
                    <h2 className="text-h2 text-white text-center mb-12">How It Works</h2>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                                1
                            </div>
                            <div>
                                <h4 className="font-medium text-white mb-1">Start with Telegram</h4>
                                <p className="text-gray-400 text-sm">
                                    Send <code>/create_token</code> to initialize the creation flow
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                                2
                            </div>
                            <div>
                                <h4 className="font-medium text-white mb-1">AI Generates Metadata</h4>
                                <p className="text-gray-400 text-sm">
                                    GPT-4 enhances description, DALL-E creates unique logo
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                                3
                            </div>
                            <div>
                                <h4 className="font-medium text-white mb-1">On-Chain Deployment</h4>
                                <p className="text-gray-400 text-sm">
                                    Canister calls <code>raw_rand()</code> for provable 32-byte seed
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                                4
                            </div>
                            <div>
                                <h4 className="font-medium text-white mb-1">Verify Anytime</h4>
                                <p className="text-gray-400 text-sm">
                                    Check seed hash on this website or directly on-chain
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-card/30">
                <div className="container text-center max-w-2xl">
                    <h2 className="text-h3 text-white mb-4">Ready to Create?</h2>
                    <p className="text-gray-400 mb-8">
                        Start creating AI-powered meme tokens with provable fairness in minutes.
                    </p>
                    <Button href={process.env.NEXT_PUBLIC_TELEGRAM_URL || '#'} external variant="primary" size="lg">
                        <FiMessageCircle className="w-5 h-5" />
                        <span>Launch Telegram Bot</span>
                    </Button>
                </div>
            </section>
        </div>
    )
}
