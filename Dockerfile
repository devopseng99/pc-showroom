FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN apk add --no-cache curl
WORKDIR /app

# Copy monorepo structure
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
COPY packages/ui/package.json packages/ui/

# Install production deps only (skip devDeps + build scripts)
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install --no-frozen-lockfile

# Copy source and pre-built UI dist
COPY packages/shared/ packages/shared/
COPY packages/server/ packages/server/
COPY packages/ui/dist/ packages/ui/dist/

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "--import", "tsx", "packages/server/src/index.ts"]
