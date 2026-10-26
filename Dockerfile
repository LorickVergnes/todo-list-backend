FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY db/init.sql ./db/init.sql

USER node
EXPOSE 3000

CMD ["node", "src/index.js"]
