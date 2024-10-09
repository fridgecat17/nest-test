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
ENV DATABASE_HOST=43.136.93.90
ENV DATABASE_PORT=3306
ENV DATABASE_NAME=root
ENV DATABASE_PWD=ADMINroot17+
ENV DATABASE_LIB=blog
ENV APP_PROT=3111

EXPOSE 3111

CMD ["node", "dist/main.js"]