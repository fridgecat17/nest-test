FROM node:18
WORKDIR /home/webserver/static/jenkins/dist/background/blog
COPY . /home/webserver/static/jenkins/dist/background/blog
# 安装依赖
RUN npm install -g pnpm --registry=https://registry.npmmirror.com
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm install --frozen-lockfile
EXPOSE 3001 3000
ENTRYPOINT ["npm", "run"]
CMD ["start"]