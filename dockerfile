FROM node:18
RUN mkdir -p /home/www/express
WORKDIR /home/www/express
COPY . /home/www/express
# 安装依赖
RUN npm install -g pnpm --registry=https://registry.npmmirror.com
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm install
EXPOSE 3001
ENTRYPOINT ["pnpm", "run"]
CMD ["start:dev"]