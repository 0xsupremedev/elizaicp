import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { SiInternetcomputer } from 'react-icons/si'

export default function Footer() {
    return (
        <footer className="border-t border-white/5 py-8 px-4 bg-main">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <span className="text-lg font-semibold text-white">ElizaICP</span>
                        <p className="text-sm text-gray-500 mt-1">
                            AI-Powered Meme Tokens on Internet Computer
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href={process.env.NEXT_PUBLIC_GITHUB_URL || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <FiGithub className="w-5 h-5" />
                        </a>
                        <a
                            href="https://internetcomputer.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <SiInternetcomputer className="w-5 h-5" />
                        </a>
                        <a
                            href="https://dashboard.internetcomputer.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
                        >
                            <span>Dashboard</span>
                            <FiExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    <div className="text-center md:text-right text-sm text-gray-500">
                        <p>Built on <span className="text-accent">Internet Computer</span></p>
                        <p className="text-xs mt-1 text-gray-600">Experimental software. Open source under MIT.</p>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-gray-600">
                    2025 ElizaICP. Not financial advice.
                </div>
            </div>
        </footer>
    )
}
