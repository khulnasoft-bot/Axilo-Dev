# AXILO CLI Dockerfile
# Multi-stage build for smaller production image

# Build stage
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8.6.0

# Set working directory
WORKDIR /app

# Copy workspace configuration and root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/cli/package.json ./packages/cli/
COPY packages/a2a-server/package.json ./packages/a2a-server/
COPY packages/vscode-ide-companion/package.json ./packages/vscode-ide-companion/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/cli/src ./packages/cli/src
COPY packages/a2a-server/src ./packages/a2a-server/src

# Build the application
RUN pnpm build

# Runtime stage
FROM node:18-alpine AS runtime

# Create non-root user for security
RUN addgroup -g 1001 -S axilo && \
    adduser -S axilo -u 1001

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/packages/cli/dist ./packages/cli/dist
COPY --from=builder /app/packages/a2a-server/dist ./packages/a2a-server/dist

# Copy runtime dependencies (node_modules for production)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/cli/node_modules ./packages/cli/node_modules
COPY --from=builder /app/packages/a2a-server/node_modules ./packages/a2a-server/node_modules

# Create logs directory
RUN mkdir -p /app/logs && chown -R axilo:axilo /app

# Switch to non-root user
USER axilo

# Set environment variables
ENV NODE_ENV=production
ENV PATH="/app/packages/cli/dist:${PATH}"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Use dumb-init as entrypoint for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Default command - run the CLI
CMD ["node", "/app/packages/cli/dist/index.js"]
