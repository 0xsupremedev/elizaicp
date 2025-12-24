#!/usr/bin/env bash
set -e

echo "🏁 Starting local development environment..."

# Check prerequisites
command -v dfx >/dev/null 2>&1 || {
  echo "❌ dfx not installed. Install from: https://internetcomputer.org/docs/current/developer-docs/setup/install"
  exit 1
}

command -v pnpm >/dev/null 2>&1 || {
  echo "❌ pnpm not installed. Install with: npm install -g pnpm"
  exit 1
}

# Load environment
if [ ! -f .env ]; then
  echo "⚙️  Creating .env from template..."
  cp .env.example .env
  echo "❗ Please configure .env before continuing"
  exit 1
fi

# Start local ICP replica
echo "🌐 Starting local ICP replica..."
dfx start --background --clean

# Deploy canisters
echo "📦 Deploying canisters locally..."
cd canisters/token_factory
dfx deploy
CANISTER_ID=$(dfx canister id token_factory)
cd ../..

# Update .env with local canister ID
sed -i.bak "s/TOKEN_FACTORY_CANISTER_ID=.*/TOKEN_FACTORY_CANISTER_ID=$CANISTER_ID/" .env
rm -f .env.bak

echo "✅ Canister deployed: $CANISTER_ID"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🔨 Generating Prisma client..."
pnpm generate

# Run migrations
echo "🗄️  Running database migrations..."
pnpm migrate

# Start bot
echo "🤖 Starting bot..."
pnpm dev
