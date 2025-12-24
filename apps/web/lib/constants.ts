// URLs
export const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/your_bot'
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/your-username/eliza-icp'
export const ICP_DASHBOARD_BASE = 'https://dashboard.internetcomputer.org'

// ICP Configuration
export const CANISTER_ID = process.env.NEXT_PUBLIC_CANISTER_ID || ''
export const ICP_HOST = process.env.NEXT_PUBLIC_ICP_HOST || 'https://ic0.app'

// App Info
export const APP_NAME = 'ElizaICP'
export const APP_DESCRIPTION = 'AI-Powered Meme Token Creation with Provable On-Chain Randomness'

// Links
export const LINKS = {
    telegram: TELEGRAM_URL,
    github: GITHUB_URL,
    canisterDashboard: `${ICP_DASHBOARD_BASE}/canister/${CANISTER_ID}`,
    icpDocs: 'https://internetcomputer.org/docs',
    elizaosDocs: 'https://elizaos.github.io/eliza/',
}
