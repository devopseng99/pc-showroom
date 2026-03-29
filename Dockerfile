FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Install deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Copy source
COPY tsconfig.base.json ./
COPY packages/ packages/

# Build UI
RUN pnpm --filter @pc-showroom/ui build

# Production image
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN apk add --no-cache curl
WORKDIR /app

COPY --from=base /app/package.json /app/pnpm-workspace.yaml /app/tsconfig.base.json ./
COPY --from=base /app/node_modules/ node_modules/
COPY --from=base /app/packages/shared/ packages/shared/
COPY --from=base /app/packages/server/ packages/server/
COPY --from=base /app/packages/ui/dist/ packages/ui/dist/
COPY --from=base /app/packages/ui/package.json packages/ui/

# kubectl for CRD syncer
RUN curl -sLO "https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/$(uname -m | sed 's/x86_64/amd64/' | sed 's/aarch64/arm64/')/kubectl" \
    && chmod +x kubectl && mv kubectl /usr/local/bin/

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "--import", "tsx", "packages/server/src/index.ts"]
