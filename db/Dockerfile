FROM postgres:17-alpine

# Les scripts de ce dossier sont exécutés au premier démarrage (volume vide)
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
