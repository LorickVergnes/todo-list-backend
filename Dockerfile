FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Les dépendances sont installées avant la copie du code pour profiter du cache Docker
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

USER node
EXPOSE 3000

CMD ["node", "src/index.js"]
