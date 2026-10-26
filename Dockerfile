ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine

LABEL version="1.0" \
      description="API REST de la Todo List (Node.js + Express)" \
      maintainer="Lorick Vergnes <vergnes.lorick@gmail.com>"

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY db/init.sql ./db/init.sql

USER node

EXPOSE ${PORT}

STOPSIGNAL SIGTERM

ENTRYPOINT ["node"]
CMD ["src/index.js"]

# docker build -t todo-backend .
# docker run --rm -p 3000:3000 -e PGHOST=<hote> -e PGUSER=todo -e PGPASSWORD=todo -e PGDATABASE=todo todo-backend
