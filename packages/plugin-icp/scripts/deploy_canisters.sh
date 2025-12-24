#!/usr/bin/env bash
set -e

echo "🚀 Deploying ICP Canisters..."

# Configuration
NETWORK=${1:-ic}
IDENTITY=${2:-deployer}

echo "   Network: $NETWORK"
echo "   Identity: $IDENTITY"

# Ensure identity is set
dfx identity use "$IDENTITY" || {
  echo "❌ Identity '$IDENTITY' not found"
  echo "   Create it with: dfx identity new $IDENTITY"
  exit 1
}

# Change to canister directory
cd canisters/token_factory

# Create canisters (if they don't exist)
echo "📦 Creating canisters..."
dfx canister create --all --network "$NETWORK" || true

# Build canisters
echo "🔨 Building canisters..."
dfx build --network "$NETWORK"

# Deploy canisters
echo "🌐 Deploying to $NETWORK..."
dfx deploy --network "$NETWORK"

# Get canister ID
CANISTER_ID=$(dfx canister id token_factory --network "$NETWORK")

echo ""
echo "✅ Deployment successful!"
echo ""
echo "   TokenFactory Canister ID: $CANISTER_ID"
echo ""
echo "📝 Update your .env file:"
echo "   TOKEN_FACTORY_CANISTER_ID=$CANISTER_ID"
echo ""

# Return to root
cd ../..
