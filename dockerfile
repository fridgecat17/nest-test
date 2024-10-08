# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm --registry=https://registry.npmmirror.com \
    && pnpm config set registry https://registry.npmmirror.com \
    && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

ENV NODE_ENV production
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_PWD=${DATABASE_PWD}
ENV DATABASE_LIB=${DATABASE_LIB}
EXPOSE 3001

CMD ["node", "dist/main.js"]