FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY dist ./dist
COPY node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
