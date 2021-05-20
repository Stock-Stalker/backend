FROM node:lts-alpine

LABEL decription="Production image for StockStalker backend."

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production

COPY . .

CMD ["npm", "start"]
