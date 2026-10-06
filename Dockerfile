FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Les dépendances sont installées avant la copie du code pour profiter du cache Docker
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
# Le schéma est aussi appliqué par l'API au démarrage (voir src/db.js)
COPY db/init.sql ./db/init.sql

USER node
EXPOSE 3000

CMD ["node", "src/index.js"]
