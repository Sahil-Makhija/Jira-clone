FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
COPY . .

EXPOSE 3000
RUN bun install

CMD bun run dev