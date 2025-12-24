# ElizaICP Web Demo

> Next.js frontend for the ElizaICP AI-powered meme token creator on Internet Computer.

## Features

- 🎨 **Landing Page** - Project overview and CTAs
- 📊 **Live Demo** - View real on-chain token data
- 🔍 **Verify Randomness** - Confirm `raw_rand` seed hashes
- 📱 **Responsive** - Mobile-friendly dark theme

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Create `.env.local` from template:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_CANISTER_ID` | ICP canister ID |
| `NEXT_PUBLIC_TELEGRAM_URL` | Telegram bot URL |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub repo URL |

## Deployment

### Vercel (Recommended)

1. Connect repo to Vercel
2. Set environment variables
3. Deploy automatically on push

### Manual

```bash
pnpm build
pnpm start
```

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript**
- **Lucide Icons**

## License

MIT
