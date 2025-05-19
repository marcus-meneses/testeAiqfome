FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY .env.production ./

RUN npm install --production
RUN npm install pm2 -g

COPY ./dist /app

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pm2-runtime", "index.js"]