ARG POSTGRES_VERSION=17

FROM postgres:${POSTGRES_VERSION}-alpine

LABEL version="1.0" \
      description="Base PostgreSQL de la Todo List" \
      maintainer="Lorick Vergnes <vergnes.lorick@gmail.com>"

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

VOLUME /var/lib/postgresql/data

EXPOSE 5432

# docker build -t todo-db .
# docker run --rm -p 5432:5432 -e POSTGRES_USER=todo -e POSTGRES_PASSWORD=todo -e POSTGRES_DB=todo -v todo_data:/var/lib/postgresql/data todo-db
