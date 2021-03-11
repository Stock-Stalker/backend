FROM node:lts-alpine

LABEL decription="Production image for StockStalker backend."

WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm ci

COPY backend .

CMD ["npm", "start"]
