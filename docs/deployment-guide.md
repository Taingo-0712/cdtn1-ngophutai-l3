# Deployment Guide — Smart CRM / Mekong Mobile / L3 (SE)

**Project:** Sales Opportunities and Sales Funnel (L3)  
**Repository:** https://github.com/Taingo-0712/cdtn1-ngophutai-l3  
**Verified commit:** `1d8ee0b`  
**Status:** Verified on a fresh local Git clone using Docker Compose on Windows.  
**Scope:** Local classroom prototype only. Not intended for public production deployment.

## 1. Requirements

The following tools are required:

- Git to clone the source repository.
- Docker Desktop or Docker Engine with Docker Compose.
- WSL 2 for Docker Desktop using Linux containers on Windows.
- Available local ports `3000` (Backend) and `5173` (Frontend), or alternative ports configured in `.env`.

No separate installation of Node.js, npm, or PostgreSQL is required on the host machine.

Verify the tools:

```powershell
git --version
docker --version
docker compose version
```

## 2. Setup Steps

### 2.1. Clone the repository

Clone the source code:

```powershell
git clone https://github.com/Taingo-0712/cdtn1-ngophutai-l3.git
cd cdtn1-ngophutai-l3
```

For the verified Docker packaging baseline, the tested commit is `1d8ee0b`. After the final submission is completed, use the published `v1.0` tag to reproduce the submitted version.

### 2.2. Start the application

Run the following two setup commands in Windows PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

For Linux or macOS, replace the first command with:

```bash
cp .env.example .env
```

The second command remains the same.

Docker Compose starts three services:

| Service | Technology | Responsibility |
|---|---|---|
| `db` | PostgreSQL 16 | Stores application data |
| `api` | Node.js 24 / Express | Provides REST APIs and business logic |
| `web` | React / Nginx | Serves the user interface and forwards API requests |

### 2.3. Database initialization

On the first initialization of an empty PostgreSQL volume:

1. `db/10-init.sh` executes migrations `001` through `008`.
2. `seeds/001_seed_demo.sql` inserts initial reference data.
3. After PostgreSQL becomes healthy, the API container executes `seeds/002_setup_demo_login.js`.
4. The API then executes `seeds/004_seed_references.js`.
5. The Express server starts after the Node.js seed scripts complete successfully.

The `.gitattributes` file enforces LF line endings for shell scripts to prevent Linux interpreter errors when cloning the repository on Windows.

**Important:** Database initialization scripts only run automatically when the PostgreSQL data volume is empty.

Do not run `docker compose down -v` on a database containing valuable data. This command removes the project's database volume.

## 3. Environment Variables

The `.env.example` file provides public demonstration values. Copy it to `.env` before running the application.

| Variable | Purpose | Notes |
|---|---|---|
| `DB_HOST` | PostgreSQL host | `localhost` for direct host execution; Docker overrides it to `db` |
| `DB_PORT` | PostgreSQL port | Internal Docker port: `5432` |
| `DB_NAME` | Database name | Default: `mekong_mobile_l3` |
| `DB_USER` | Database user | Demo: `postgres` |
| `DB_PASSWORD` | Database password | Required; replace demonstration value for non-demo use |
| `PORT` | Express application port | Docker uses `3000` internally |
| `APP_PORT` | Backend port exposed to host | Default: `3000` |
| `WEB_PORT` | Frontend port exposed to host | Default: `5173` |
| `JWT_SECRET` | Secret used to sign JWT tokens | Minimum 32 UTF-8 bytes |
| `DEMO_PASSWORD` | Password for demo accounts | 8 or more characters; maximum 72 UTF-8 bytes |

Never commit `.env`, real passwords, tokens or confidential information to GitHub.

The `.env.example` values are public demo placeholders and must not be reused for an Internet-facing service.

### Running two instances on one machine

When an existing instance already occupies ports `3000` and `5173`, set alternative ports in the second instance's `.env`:

```dotenv
APP_PORT=3002
WEB_PORT=5175
```

Use a separate Docker Compose project name:

```powershell
docker compose -p cdtn1-l3-final up -d --build
```

This creates a separate group of containers, network and database volume.

## 4. Sample Data

The project includes synthetic data for two Mekong Mobile stores.

| Username | Role | Store |
|---|---|---|
| `sales01` | SALES | MM001 |
| `sales02` | SALES | MM001 |
| `manager01` | MANAGER | MM001 |
| `sales03` | SALES | MM002 |
| `manager02` | MANAGER | MM002 |

An additional sample SALES account is created by the seed script.

The password is configured through `DEMO_PASSWORD` in `.env`.

The seed scripts also create sample customers, products and sales opportunities.

All sample customer data is synthetic and intended only for testing and demonstration.

## 5. Verify It Works

### 5.1. Check container health

Run:

```powershell
docker compose ps
```

Expected result: the `db`, `api` and `web` services all report `healthy`.

### 5.2. Check the Backend health endpoint

Run:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Expected JSON response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

If a different `APP_PORT` is configured, use that port instead of `3000`.

### 5.3. Verify the user interface

Open:

http://localhost:5173

Log in using `sales01` and the configured demo password.

Verify that the sales opportunity list loads successfully.

For functional verification, create an opportunity using active customer and product references. Log in as `manager01` to check manager-specific functionality, including the sales funnel.

### 5.4. Run automated tests

Execute:

```powershell
docker compose exec api npm test
```

**Verified result:** 73 tests passed, 0 failed, when executed inside the Docker API container.

This verifies the automated test suite. It does not replace functional checks against a running PostgreSQL database.

### 5.5. Fresh-clone reproducibility verification

A fresh local clone of commit `1d8ee0b` was tested using the Docker Compose project name `cdtn1-l3-final`, with ports `3002` and `5175`.

The following outcomes were observed:

| Check | Result |
|---|---|
| Backend Docker image build | PASS |
| Frontend Docker image build | PASS |
| New PostgreSQL volume initialization | PASS |
| PostgreSQL healthcheck | PASS |
| Backend healthcheck | PASS |
| Frontend healthcheck | PASS |
| API response | `status: ok`, `database: connected` |
| Demo user records in an earlier isolated cold-clone test | 6 records |

The final clone reached three healthy services without manually editing the shell script.

This verification was conducted on an existing Windows machine with Docker Desktop installed, rather than on a completely separate physical machine.

### 5.6. Troubleshooting

**Database initialization error**

Inspect the database startup logs:

```powershell
docker compose logs --tail=80 db
```

Confirm that migrations and SQL seed initialization have completed successfully.

**Backend fails to become healthy**

Inspect the API logs:

```powershell
docker compose logs --tail=80 api
```

Check database readiness, credentials and demo seed configuration.

**Frontend returns an HTTP error**

Inspect the Nginx logs:

```powershell
docker compose logs --tail=80 web
```

Check `frontend/docker/nginx.conf` and the frontend container health status.

**Port conflict**

Change `APP_PORT` or `WEB_PORT` in `.env`, and restart the relevant Compose services.

**Security and deployment limitations**

This prototype is designed for local classroom use. Before public hosting, it requires replacement of demo credentials, HTTPS configuration, appropriate access controls, persistent database backup and recovery procedures, security testing and operational monitoring.

For the separate security self-assessment, see `docs/security-checklist-bt3.md` once the checklist has been reviewed and finalized.
