# Todo List — Backend

API REST de la Todo List, écrite avec Node.js et Express, et sa base de données PostgreSQL.

Ce dépôt contient deux services Docker :

| Service   | Technologie       | Dockerfile      |
| --------- | ----------------- | --------------- |
| `backend` | Node.js + Express | `Dockerfile`    |
| `db`      | PostgreSQL 17     | `db/Dockerfile` |

L'interface web se trouve dans le dépôt du frontend.

## Lancer l'API et la base

```bash
docker compose up --build -d
```

L'API répond sur http://localhost:3000/api/todos.

Pour arrêter :

```bash
docker compose down
```

Ajouter `-v` supprime aussi le volume `db_data`, donc les tâches enregistrées.

## Configuration

Les identifiants de la base et le port ont des valeurs par défaut dans `docker-compose.yml`. Pour les changer, copier `.env.example` vers `.env` et modifier les valeurs. Le fichier `.env` n'est pas versionné.

| Variable            | Défaut | Rôle                          |
| ------------------- | ------ | ----------------------------- |
| `POSTGRES_USER`     | `todo` | Utilisateur de la base        |
| `POSTGRES_PASSWORD` | `todo` | Mot de passe de la base       |
| `POSTGRES_DB`       | `todo` | Nom de la base                |
| `BACKEND_PORT`      | `3000` | Port de l'API sur la machine  |

Le script `db/init.sql` n'est exécuté qu'au premier démarrage, quand le volume est vide. Après une modification du schéma, il faut recréer le volume avec `docker compose down -v`.

## API

| Méthode  | Route            | Corps                                         | Description                 |
| -------- | ---------------- | --------------------------------------------- | --------------------------- |
| `GET`    | `/api/health`    | —                                             | État de l'API et de la base |
| `GET`    | `/api/todos`     | —                                             | Liste des tâches            |
| `POST`   | `/api/todos`     | `{ "title": string }`                         | Crée une tâche              |
| `PATCH`  | `/api/todos/:id` | `{ "title"?: string, "completed"?: boolean }` | Modifie une tâche           |
| `DELETE` | `/api/todos/:id` | —                                             | Supprime une tâche          |

## Application complète

Pour lancer le frontend avec l'API, cloner les deux dépôts côte à côte dans des dossiers nommés `backend` et `frontend`, puis créer dans le dossier parent un fichier `docker-compose.yml` :

```yaml
include:
  - backend/docker-compose.yml
  - frontend/docker-compose.yml
```

`docker compose up --build -d` lancé depuis ce dossier parent démarre alors les trois services.

## Développement hors Docker

La base peut rester dans Docker ; il faut alors publier son port en ajoutant `ports: ["5432:5432"]` au service `db`.

```powershell
npm install
$env:PGHOST="localhost"; $env:PGUSER="todo"; $env:PGPASSWORD="todo"; $env:PGDATABASE="todo"
npm run dev
```
