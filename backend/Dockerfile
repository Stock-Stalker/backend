FROM node:14-alpine

LABEL decription="Production image for StockStalker backend."

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "start"]
