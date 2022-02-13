FROM node:16.3.0-alpine

ENV NODE_VERSION 16.3.0

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server/index.js"]