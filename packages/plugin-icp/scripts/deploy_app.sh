#!/usr/bin/env bash
set -e

echo "🐳 Deploying Plugin Container..."

# Configuration
IMAGE_TAG=${1:-latest}
REGISTRY=${DOCKER_REGISTRY:-ghcr.io}
ORG=${GITHUB_REPOSITORY_OWNER:-asdnsk}

IMAGE_NAME="$REGISTRY/$ORG/plugin-icp:$IMAGE_TAG"

echo "   Image: $IMAGE_NAME"

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t "$IMAGE_NAME" .

# Push to registry
echo "📤 Pushing to registry..."
docker push "$IMAGE_NAME"

echo ""
echo "✅ Container deployed!"
echo ""
echo "   Image: $IMAGE_NAME"
echo ""
echo "🚀 Deploy to your platform:"
echo "   Railway: Use this image in your service"
echo "   Fly.io: flyctl deploy --image $IMAGE_NAME"
echo "   Cloud Run: gcloud run deploy icp-plugin --image $IMAGE_NAME"
echo ""
