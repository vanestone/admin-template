FROM harbor.meetsocial.cn/library/node:v16
WORKDIR /sino-deploy
COPY package.json pnpm-lock.yaml ./
RUN npm install -g @sino-cli/oss-deploy pnpm --registry http://nexus.meetsocial.cn:8081/repository/npm-all
RUN pnpm i --registry http://nexus.meetsocial.cn:8081/repository/npm-all
