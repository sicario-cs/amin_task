# Quotes API

A tiny Express API (plus a one-page frontend) that ships through Docker and GitHub Actions
to a free cloud host. Built as a team exercise for the CI/CD & Deployment session.

## Endpoints

| Method | Path                 | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | `/`                  | Minimal web page that shows a quote  |
| GET    | `/health`            | Health check used by Docker & Render |
| GET    | `/api/quotes`        | List all quotes                      |
| GET    | `/api/quotes/random` | One random quote                     |
| POST   | `/api/quotes`        | Add a quote — `{ "text", "author" }` |

## Run locally

```bash
npm install
npm start          # http://localhost:3000
npm test           # node:test, no extra test deps
```

## Run with Docker

```bash
docker build -t quotes-api .
docker run --rm -p 3000:3000 quotes-api
```

## Pipeline

`.github/workflows/cicd.yml` runs on every push and pull request:

1. **test** — install dependencies and run the test suite.
2. **build** — build the Docker image; on `main` it is pushed to GitHub Container Registry.
3. **deploy** — on `main` only, trigger the Render deploy hook.

The image carries no secrets. `RENDER_DEPLOY_HOOK_URL` lives in GitHub repository secrets
and is only read at deploy time.

## Team

| Member | Branch  | Owns                             |
| ------ | ------- | -------------------------------- |
| Ahmad  | `ahmad` | App, tests, README               |
| Qusai  | `qusai` | `Dockerfile`, `.dockerignore`    |
| Siwar  | `siwar` | `.github/workflows/cicd.yml`     |

Every change reaches `main` through a pull request approved by at least one teammate.
