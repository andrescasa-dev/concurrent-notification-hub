# Production image (e.g. Railway). Dev/test: Dockerfile.dev + docker-compose-*.yml

FROM node:24-alpine AS build

ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:24-alpine AS production

ENV NODE_ENV=production
ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["sh", "-c", "pnpm migration:run && pnpm start:prod"]
