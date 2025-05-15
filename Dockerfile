# === Build Stage ===
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy dependency files first for better caching
COPY package.json bun.lock ./
RUN bun install

# Now copy the source code
COPY . .
RUN bun run build

# === Production Stage ===
FROM oven/bun:latest

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/package.json /app/bun.lock ./
# Since node_modules is in .dockerignore, we need the installed dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
# Since .next is in .dockerignore, we need the built app from builder
COPY --from=builder /app/.next ./.next
# Any other necessary files for production
COPY --from=builder /app/public ./public

# Run as non-root user for better security
USER node

EXPOSE 3000

CMD ["bun", "start"]

