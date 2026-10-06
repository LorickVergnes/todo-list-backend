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

L'API lit aussi deux variables fournies par les hébergeurs :

| Variable       | Rôle                                                                       |
| -------------- | -------------------------------------------------------------------------- |
| `DATABASE_URL` | Adresse complète de la base ; si elle est définie, elle remplace les `PG*` |
| `PORT`         | Port d'écoute de l'API (3000 par défaut)                                   |

Le script `db/init.sql` crée la table `todos` si elle n'existe pas. Il est exécuté par l'image Postgres au premier démarrage, et par l'API à chaque démarrage : une base vide fournie par un hébergeur est donc initialisée automatiquement.

## Déploiement sur Render

Render ne lit pas `docker-compose.yml` : l'API est construite depuis le `Dockerfile`, et la base est un Postgres géré par Render (le dossier `db/` ne sert qu'en local).

1. **Base de données** — *New > Postgres*, choisir une région (par exemple Frankfurt) et le plan *Free*. Une fois créée, copier son *Internal Database URL*.
2. **API** — *New > Web Service*, sélectionner ce dépôt. Render détecte le `Dockerfile` (langage *Docker*). Choisir la même région que la base et le plan *Free*, puis ajouter la variable d'environnement `DATABASE_URL` avec l'adresse copiée.
3. Dans les réglages du service, renseigner `/api/health` comme *Health Check Path*.

L'API est ensuite disponible sur `https://<nom-du-service>.onrender.com/api/todos`. Cette adresse est à fournir au frontend dans sa variable `BACKEND_URL`.

Limites du plan gratuit : le service s'endort après 15 minutes sans trafic (la requête suivante prend environ une minute), et la base gratuite expire 30 jours après sa création.

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
