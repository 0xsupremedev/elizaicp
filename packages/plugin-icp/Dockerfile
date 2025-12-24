# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm generate

# Build TypeScript
RUN pnpm build

# Production stage
FROM node:18-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install production deps only
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN pnpm install --prod --frozen-lockfile

# Generate Prisma client
RUN pnpm generate

# Copy built code from builder
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Run migrations and start
CMD ["/bin/sh", "-c", "pnpm migrate:deploy && node dist/index.js"]
