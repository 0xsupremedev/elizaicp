'use client'

import { useState, useMemo } from 'react'
import { FiBook, FiCode, FiDatabase, FiShield, FiZap, FiCpu, FiMessageCircle, FiGlobe, FiTerminal, FiGitBranch, FiLayers, FiKey, FiClock, FiSearch, FiX } from 'react-icons/fi'
import { SiTypescript, SiReact, SiNextdotjs, SiPostgresql, SiPrisma, SiOpenai, SiTelegram, SiDocker } from 'react-icons/si'
import ExternalLink from '@/components/ExternalLink'

type Section = 'overview' | 'architecture' | 'randomness' | 'telegram' | 'canister' | 'deployment' | 'api'

// Searchable content index
const searchIndex = [
    { section: 'overview', keywords: ['elizaicp', 'what is', 'production', 'plugin', 'ai-powered', 'meme token', 'internet computer', 'icp', 'gpt-4', 'dall-e', 'openai', 'tech stack', 'typescript', 'react', 'next.js', 'postgresql', 'prisma', 'telegram', 'docker', 'features', 'randomness', 'bls signatures'], title: 'What is ElizaICP?', description: 'Overview of the ElizaICP plugin, tech stack, and key features' },
    { section: 'architecture', keywords: ['architecture', 'system', 'user layer', 'plugin', 'node.js', 'canister', 'data flow', 'three-tier', 'commands', 'services', 'middleware', 'rate limiter'], title: 'System Architecture', description: 'Three-tier architecture: User Interface, Backend Plugin, Smart Contract' },
    { section: 'randomness', keywords: ['raw_rand', 'randomness', 'on-chain', 'cryptographic', 'vrf', 'verifiable random function', 'bls', 'threshold', 'subnet', 'consensus', 'unpredictable', 'unbiasable', 'verifiable', 'motoko', 'security'], title: 'On-Chain Randomness', description: 'How ICP raw_rand provides cryptographically secure randomness' },
    { section: 'telegram', keywords: ['telegram', 'bot', 'telegraf', 'commands', '/start', '/link_identity', '/create_token', '/status', '/my_tokens', '/my_identity', '/verify_link', '/help', 'token creation', 'workflow', 'flow'], title: 'Telegram Bot', description: 'Bot commands, token creation flow, and user interface' },
    { section: 'canister', keywords: ['canister', 'smart contract', 'motoko', 'stable storage', 'timers', 'wallet linking', 'candid', 'interface', 'token factory', 'upgrade', 'persistence'], title: 'Smart Contract (Canister)', description: 'TokenFactory canister features and Candid interface' },
    { section: 'deployment', keywords: ['deployment', 'deploy', 'dfx', 'docker', 'vercel', 'prerequisites', 'environment variables', 'telegram_bot_token', 'openai_api_key', 'postgres_url', 'internet_computer_private_key', 'canister_id', 'production'], title: 'Deployment Guide', description: 'How to deploy the bot, web app, and ICP canister' },
    { section: 'api', keywords: ['api', 'reference', 'create_meme_token', 'get_token_status', 'prove_link', 'get_link_proof', 'list_tokens', 'finalize_mint', 'unlink_wallet', 'query', 'update', 'candid'], title: 'API Reference', description: 'TokenFactory canister methods and their usage' },
]

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState<Section>('overview')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const sections = [
        { id: 'overview', label: 'Overview', icon: FiBook },
        { id: 'architecture', label: 'Architecture', icon: FiLayers },
        { id: 'randomness', label: 'On-Chain Randomness', icon: FiZap },
        { id: 'telegram', label: 'Telegram Bot', icon: FiMessageCircle },
        { id: 'canister', label: 'Smart Contract', icon: FiCode },
        { id: 'deployment', label: 'Deployment', icon: FiGlobe },
        { id: 'api', label: 'API Reference', icon: FiTerminal },
    ]

    // Search results
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return []
        const query = searchQuery.toLowerCase()
        return searchIndex.filter(item =>
            item.keywords.some(kw => kw.includes(query)) ||
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        )
    }, [searchQuery])

    const handleSearchSelect = (section: Section) => {
        setActiveSection(section)
        setSearchQuery('')
        setIsSearchFocused(false)
    }

    return (
        <div className="min-h-screen">
            <div className="container py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiBook className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-h1 text-white mb-4">Documentation</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                        Complete technical documentation for ElizaICP - AI-powered meme tokens with provable on-chain randomness on the Internet Computer.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search documentation... (e.g., raw_rand, telegram, deploy)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                className="w-full pl-12 pr-10 py-3 bg-card border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {isSearchFocused && searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                {searchResults.length > 0 ? (
                                    <div className="max-h-80 overflow-y-auto">
                                        {searchResults.map((result) => {
                                            const sectionData = sections.find(s => s.id === result.section)
                                            const Icon = sectionData?.icon || FiBook
                                            return (
                                                <button
                                                    key={result.section}
                                                    onClick={() => handleSearchSelect(result.section as Section)}
                                                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted text-left transition-colors border-b border-white/5 last:border-0"
                                                >
                                                    <Icon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{result.title}</p>
                                                        <p className="text-gray-500 text-xs">{result.description}</p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="px-4 py-6 text-center text-gray-500">
                                        <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No results found for "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-1">
                        <nav className="sticky top-24 space-y-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id as Section)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm transition-all ${activeSection === section.id
                                        ? 'bg-accent text-white'
                                        : 'text-gray-400 hover:bg-card hover:text-white'
                                        }`}
                                >
                                    <section.icon className="w-4 h-4" />
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-3">
                        <div className="card">
                            {activeSection === 'overview' && <OverviewSection />}
                            {activeSection === 'architecture' && <ArchitectureSection />}
                            {activeSection === 'randomness' && <RandomnessSection />}
                            {activeSection === 'telegram' && <TelegramSection />}
                            {activeSection === 'canister' && <CanisterSection />}
                            {activeSection === 'deployment' && <DeploymentSection />}
                            {activeSection === 'api' && <ApiSection />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

function OverviewSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-h2 text-white mb-4">What is ElizaICP?</h2>
                <p className="text-gray-400 mb-4">
                    ElizaICP is a production-grade ElizaOS plugin that enables AI-powered meme token creation on the Internet Computer Protocol (ICP). It combines the power of OpenAI's GPT-4 and DALL-E with ICP's cryptographically secure on-chain randomness.
                </p>
                <div className="p-4 bg-muted rounded-lg border border-accent/20">
                    <p className="text-accent text-sm">
                        <strong>Key Innovation:</strong> Unlike traditional random number generators, ICP's <code className="bg-card px-1 rounded">raw_rand</code> uses threshold BLS signatures from 2/3 subnet consensus, making it impossible to predict or manipulate.
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Tech Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: SiTypescript, label: 'TypeScript', color: '#3178C6' },
                        { icon: SiReact, label: 'React', color: '#61DAFB' },
                        { icon: SiNextdotjs, label: 'Next.js', color: '#fff' },
                        { icon: SiPostgresql, label: 'PostgreSQL', color: '#4169E1' },
                        { icon: SiPrisma, label: 'Prisma', color: '#2D3748' },
                        { icon: SiOpenai, label: 'OpenAI', color: '#412991' },
                        { icon: SiTelegram, label: 'Telegram', color: '#26A5E4' },
                        { icon: SiDocker, label: 'Docker', color: '#2496ED' },
                    ].map((tech) => (
                        <div key={tech.label} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <tech.icon className="w-5 h-5" style={{ color: tech.color }} />
                            <span className="text-sm text-gray-300">{tech.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <FiZap className="w-6 h-6 text-accent mb-2" />
                        <h4 className="font-medium text-white mb-1">Provable Randomness</h4>
                        <p className="text-sm text-gray-400">32 cryptographic bytes from ICP's threshold BLS signatures</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiCpu className="w-6 h-6 text-accent mb-2" />
                        <h4 className="font-medium text-white mb-1">AI Integration</h4>
                        <p className="text-sm text-gray-400">GPT-4 descriptions and DALL-E 3 logo generation</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiShield className="w-6 h-6 text-accent mb-2" />
                        <h4 className="font-medium text-white mb-1">Secure Storage</h4>
                        <p className="text-sm text-gray-400">Stable storage preserves state across canister upgrades</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiMessageCircle className="w-6 h-6 text-accent mb-2" />
                        <h4 className="font-medium text-white mb-1">Telegram Bot</h4>
                        <p className="text-sm text-gray-400">User-friendly interface for token creation</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ArchitectureSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-h2 text-white mb-4">System Architecture</h2>
                <p className="text-gray-400 mb-6">
                    ElizaICP follows a three-tier architecture: User Interface (Telegram/Web), Backend Plugin (Node.js), and Smart Contract (Motoko on ICP).
                </p>
            </div>

            <div className="p-6 bg-muted rounded-lg">
                <pre className="text-xs md:text-sm text-gray-300 overflow-x-auto">
                    {`┌─────────────────────────────────────────────────────────────┐
│                    USER LAYER                               │
│  ┌─────────────────┐    ┌─────────────────────────────┐    │
│  │  Telegram Bot   │    │   Web App (Next.js)         │    │
│  └────────┬────────┘    └───────────────┬─────────────┘    │
└───────────┼─────────────────────────────┼──────────────────┘
            │                             │
            ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│               ELIZAOS PLUGIN (Node.js/TypeScript)           │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   Commands    │  │   Services    │  │  Middleware   │   │
│  │  /create_token│  │   OpenAI      │  │  Rate Limiter │   │
│  │  /link_identity│ │   PostgreSQL  │  │               │   │
│  │  /status      │  │   ICP Agent   │  │               │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            INTERNET COMPUTER (ICP)                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         TokenFactory Canister (Motoko)                 │ │
│  │  • raw_rand() - Cryptographic randomness               │ │
│  │  • Stable Storage - Upgrade-safe persistence           │ │
│  │  • Timers - Scheduled tasks                            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘`}
                </pre>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Data Flow</h3>
                <ol className="space-y-4">
                    <li className="flex gap-4">
                        <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                        <div>
                            <h4 className="font-medium text-white">User Request</h4>
                            <p className="text-sm text-gray-400">User sends /create_token via Telegram</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                        <div>
                            <h4 className="font-medium text-white">AI Enhancement</h4>
                            <p className="text-sm text-gray-400">Plugin calls OpenAI for description and logo generation</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                        <div>
                            <h4 className="font-medium text-white">On-Chain Creation</h4>
                            <p className="text-sm text-gray-400">Canister generates raw_rand() seed and stores token</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
                        <div>
                            <h4 className="font-medium text-white">Confirmation</h4>
                            <p className="text-sm text-gray-400">User receives token ID and verifiable seed hash</p>
                        </div>
                    </li>
                </ol>
            </div>
        </div>
    )
}

function RandomnessSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-h2 text-white mb-4">On-Chain Randomness</h2>
                <p className="text-gray-400 mb-4">
                    ICP's <code className="bg-card px-2 py-1 rounded text-accent">raw_rand</code> provides cryptographically secure randomness that cannot be predicted or manipulated by any single party.
                </p>
            </div>

            <div className="p-4 bg-muted rounded-lg border-l-4 border-accent">
                <h3 className="font-medium text-white mb-2">How It Works</h3>
                <p className="text-sm text-gray-400">
                    During each consensus round, the ICP subnet uses a Verifiable Random Function (VRF) based on threshold BLS signatures. This produces 32 bytes of randomness that requires 2/3 of subnet nodes to agree, making manipulation cryptographically infeasible.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Motoko Implementation</h3>
                <div className="bg-[#1e1e1e] rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                        <code className="text-gray-300">
                            {`import IC "ic:aaaaa-aa";  // Management canister

actor TokenFactory {
    // Call raw_rand for provable randomness
    public shared(msg) func create_meme_token(arg: CreateArgs) : async Response {
        // CRITICAL: Get 32 bytes of cryptographic randomness
        let randomBlob = await IC.raw_rand();
        
        let tokenInfo : TokenInfo = {
            id = generateTokenId(randomBlob);
            seed = randomBlob;  // Store on-chain for verification
            // ... other fields
        };
        
        tokens.put(tokenId, tokenInfo);
        { requestId = tokenId; seed = randomBlob }
    };
}`}
                        </code>
                    </pre>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Security Properties</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <FiShield className="w-6 h-6 text-green-500 mb-2" />
                        <h4 className="font-medium text-white mb-1">Unpredictable</h4>
                        <p className="text-sm text-gray-400">No one can predict the next random value</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiKey className="w-6 h-6 text-green-500 mb-2" />
                        <h4 className="font-medium text-white mb-1">Unbiasable</h4>
                        <p className="text-sm text-gray-400">No single party can influence the output</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiDatabase className="w-6 h-6 text-green-500 mb-2" />
                        <h4 className="font-medium text-white mb-1">Verifiable</h4>
                        <p className="text-sm text-gray-400">Seeds are stored on-chain for audit</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiClock className="w-6 h-6 text-green-500 mb-2" />
                        <h4 className="font-medium text-white mb-1">Fresh</h4>
                        <p className="text-sm text-gray-400">New randomness generated each round</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TelegramSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-h2 text-white mb-4">Telegram Bot</h2>
                <p className="text-gray-400 mb-4">
                    The Telegram bot provides a user-friendly interface for interacting with ElizaICP. Built with Telegraf.js, it handles the complete token creation workflow.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Available Commands</h3>
                <div className="space-y-3">
                    {[
                        { cmd: '/start', desc: 'Welcome message and command overview' },
                        { cmd: '/link_identity', desc: 'Connect your ICP wallet via Internet Identity' },
                        { cmd: '/create_token', desc: 'Start the token creation flow' },
                        { cmd: '/status <id>', desc: 'Check the status of a token request' },
                        { cmd: '/my_tokens', desc: 'View all your created tokens' },
                        { cmd: '/my_identity', desc: 'View your linked ICP principal' },
                        { cmd: '/verify_link <tg_id>', desc: 'Verify any user\'s wallet link on-chain' },
                        { cmd: '/help', desc: 'Show help and documentation' },
                    ].map((item) => (
                        <div key={item.cmd} className="flex items-start gap-4 p-3 bg-muted rounded-lg">
                            <code className="bg-card px-2 py-1 rounded text-accent text-sm whitespace-nowrap">{item.cmd}</code>
                            <span className="text-sm text-gray-400">{item.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Token Creation Flow</h3>
                <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                        {`User: /create_token
Bot:  📝 Step 1/3: What's the token name?

User: Moon Doge
Bot:  ✅ Token Name: Moon Doge
      📝 Step 2/3: What's the symbol? (2-6 chars)

User: MDOGE
Bot:  ✅ Symbol: MDOGE
      📝 Step 3/3: Describe your token

User: The ultimate lunar canine
Bot:  🤖 Generating AI-powered metadata...
      [Shows AI-generated logo and description]
      Ready to mint? Use /confirm

User: /confirm
Bot:  ⏳ Deploying to ICP...
      ✅ Token deployed!
      🆔 Request ID: abc-123
      🎲 Seed Hash: d4f5e6...`}
                    </pre>
                </div>
            </div>
        </div>
    )
}

function CanisterSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-h2 text-white mb-4">Smart Contract (Canister)</h2>
                <p className="text-gray-400 mb-4">
                    The TokenFactory canister is written in Motoko and deployed on the Internet Computer. It handles token creation, wallet linking, and provides query methods for verification.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <FiDatabase className="w-6 h-6 text-accent mb-2" />
                        <h4 className="font-medium text-white mb-1">Stable Storage</h4>
                        <p className="text-sm text-gray-400">Token data persists across canister upgrades using stable variables</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiZap className="w-6 h-6 text-accent mb-2" />
                        <h4 className="font-medium text-white mb-1">raw_rand Integration</h4>
                        <p className="text-sm text-gray-400">Calls management canister for cryptographic randomness</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiClock className="w-6 h-6 text-accent mb-2" />
                        <h4 className="font-medium text-white mb-1">Timers</h4>
                        <p className="text-sm text-gray-400">Automated cleanup and scheduled tasks</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <FiKey className="w-6 h-6 text-accent mb-2" />
                        <h4 className="font-medium text-white mb-1">Wallet Linking</h4>
                        <p className="text-sm text-gray-400">Cryptographic proof of Telegram-Principal binding</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Candid Interface</h3>
                <div className="bg-[#1e1e1e] rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                        <code className="text-gray-300">
                            {`service : {
    // Token Factory Methods
    create_meme_token: (CreateMemeTokenArg) -> (CreateResponse);
    finalize_mint: (text) -> (bool);
    get_token_status: (text) -> (QueryResponse) query;
    list_tokens: (nat, nat) -> (vec TokenInfo) query;
    
    // Wallet Linking Methods
    prove_link: (text) -> (bool);
    get_link_proof: (text) -> (opt LinkProof) query;
    list_link_proofs: (nat) -> (vec LinkProof) query;
    unlink_wallet: (text) -> (bool);
}`}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    )
}

function DeploymentSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-h2 text-white mb-4">Deployment Guide</h2>
                <p className="text-gray-400 mb-4">
                    ElizaICP consists of three deployable components: the Telegram bot, the web app, and the ICP canister.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Prerequisites</h3>
                <div className="bg-[#1e1e1e] rounded-lg p-4">
                    <pre className="text-sm text-gray-300">
                        {`# Install DFX (ICP SDK)
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Install pnpm
npm install -g pnpm

# Start PostgreSQL
docker run -d --name icp-postgres \\
  -e POSTGRES_PASSWORD=password \\
  -e POSTGRES_DB=icp_plugin \\
  -p 5432:5432 postgres:15-alpine`}
                    </pre>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Environment Variables</h3>
                <div className="space-y-2">
                    {[
                        { name: 'TELEGRAM_BOT_TOKEN', desc: 'From @BotFather' },
                        { name: 'OPENAI_API_KEY', desc: 'OpenAI API key' },
                        { name: 'POSTGRES_URL', desc: 'PostgreSQL connection string' },
                        { name: 'INTERNET_COMPUTER_PRIVATE_KEY', desc: 'DFX identity key (hex)' },
                        { name: 'TOKEN_FACTORY_CANISTER_ID', desc: 'Deployed canister ID' },
                    ].map((env) => (
                        <div key={env.name} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                            <code className="bg-card px-2 py-1 rounded text-accent text-xs">{env.name}</code>
                            <span className="text-sm text-gray-400">{env.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Deploy Commands</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium text-white mb-2">Canister (ICP)</h4>
                        <code className="text-sm text-accent">dfx deploy --network ic</code>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium text-white mb-2">Bot (Docker)</h4>
                        <code className="text-sm text-accent">docker build -t eliza-icp-bot . && docker run eliza-icp-bot</code>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium text-white mb-2">Web (Vercel)</h4>
                        <code className="text-sm text-accent">vercel --prod</code>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ApiSection() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-h2 text-white mb-4">API Reference</h2>
                <p className="text-gray-400 mb-4">
                    The TokenFactory canister exposes the following methods via Candid interface.
                </p>
            </div>

            <div className="space-y-6">
                {[
                    {
                        name: 'create_meme_token',
                        type: 'Update',
                        args: 'CreateMemeTokenArg',
                        returns: 'CreateResponse',
                        desc: 'Creates a new meme token with AI-generated metadata and on-chain randomness.',
                    },
                    {
                        name: 'get_token_status',
                        type: 'Query',
                        args: 'text (request_id)',
                        returns: 'QueryResponse',
                        desc: 'Returns the current status and details of a token request.',
                    },
                    {
                        name: 'prove_link',
                        type: 'Update',
                        args: 'text (telegram_id)',
                        returns: 'bool',
                        desc: 'Creates an on-chain proof linking Telegram ID to caller\'s principal.',
                    },
                    {
                        name: 'get_link_proof',
                        type: 'Query',
                        args: 'text (telegram_id)',
                        returns: 'opt LinkProof',
                        desc: 'Returns the wallet link proof for a Telegram ID, if it exists.',
                    },
                    {
                        name: 'list_tokens',
                        type: 'Query',
                        args: 'nat (offset), nat (limit)',
                        returns: 'vec TokenInfo',
                        desc: 'Returns a paginated list of all tokens.',
                    },
                ].map((method) => (
                    <div key={method.name} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <code className="text-accent font-medium">{method.name}</code>
                            <span className={`text-xs px-2 py-0.5 rounded ${method.type === 'Query' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                {method.type}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{method.desc}</p>
                        <div className="text-xs text-gray-500">
                            <span className="text-gray-400">Args:</span> {method.args} → <span className="text-gray-400">Returns:</span> {method.returns}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-gray-300">
                    <strong className="text-accent">GitHub Repository:</strong>{' '}
                    <ExternalLink href="https://github.com/0xsupremedev/elizaicp" label="github.com/0xsupremedev/elizaicp" className="text-accent hover:underline" />
                </p>
            </div>
        </div>
    )
}
