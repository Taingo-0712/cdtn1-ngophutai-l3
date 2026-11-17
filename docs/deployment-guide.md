# Deployment Guide — Smart CRM / Mekong Mobile / L3 (SE)

**Project:** Sales Opportunities and Sales Funnel (L3)  
**Repository:** https://github.com/Taingo-0712/cdtn1-ngophutai-l3  
**Submitted version:** `v1.0` — commit `0dd09d1`
**Earlier packaging baseline:** commit `1d8ee0b`
**Verification:** Cold-cloned and verified locally using Docker Compose on Windows, 17 November 2026.
**Scope:** Local classroom prototype; not intended for public production deployment.

## 1. Requirements

- Git for cloning the repository.
- Docker Desktop (or Docker Engine) with Docker Compose.
- WSL 2 when using Docker Desktop with Linux containers on Windows.
- Available host ports `3000` (Backend) and `5173` (Frontend), or other ports configured in `.env`.

Node.js, npm and PostgreSQL do not need to be installed separately on the host.

```powershell
git --version
docker --version
docker compose version
```

Make sure Docker is running.

## 2. Setup Steps

### 2.1. Clone the submitted release

To reproduce the version submitted for BT3:

```powershell
git clone --branch v1.0 --single-branch https://github.com/Taingo-0712/cdtn1-ngophutai-l3.git cdtn1-l3-v1
cd cdtn1-l3-v1
git describe --tags --exact-match
git log -1 --oneline
```

Expected tag: `v1.0`; expected commit prefix: `0dd09d1`. A `detached HEAD` notice is normal when checking out a tag. To work on the latest `main` branch instead, use a normal clone without `--branch v1.0`.

### 2.2. Create the local environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux or macOS:

```bash
cp .env.example .env
```

Review `.env` before running Docker. The sample values are for local demonstrations only. Never commit `.env` or deploy public sample secrets.

If host ports `3000` and `5173` are occupied, set alternative host ports in `.env`:

```dotenv
APP_PORT=3002
WEB_PORT=5175
```

Keep `PORT=3000` for the API inside Docker.

### 2.3. Start Docker Compose

For a fresh machine without an existing Compose project or volume for this application:

```powershell
docker compose config --quiet
docker compose up -d --build
```

**Important for repeated cold clones:** The submitted `docker-compose.yml` contains `name: cdtn1-l3-smart-crm`. Thus, separate folders started with the default command may reuse the same Compose project and PostgreSQL volume. For independent testing, specify a *new* project name:

```powershell
docker compose -p cdtn1-l3-v1-check config --quiet
docker compose -p cdtn1-l3-v1-check up -d --build
```

Use the same `-p` project name for later `ps`, `exec`, and `logs` commands. The example project name must be changed if it already exists on the machine.

| Service | Technology | Responsibility |
|---|---|---|
| `db` | PostgreSQL 16 | Data storage |
| `api` | Node.js 24 / Express | REST API and business logic |
| `web` | React / Nginx | Web interface and API reverse proxy |

### 2.4. Database initialization

On the **first initialization of a new empty PostgreSQL volume**:

1. `db/10-init.sh` executes migrations `001` through `008`.
2. `seeds/001_seed_demo.sql` inserts reference data.
3. After PostgreSQL becomes healthy, `api` executes `seeds/002_setup_demo_login.js`.
4. `api` executes `seeds/004_seed_references.js`.
5. Express starts after the seed scripts succeed.

The `.gitattributes` file forces LF line endings for shell scripts for Linux container compatibility.

**Persistent data warning:** Database initialization scripts run automatically only for a new empty data directory. Do not run `docker compose down -v` on a database containing important data; it removes the project's named database volume.

## 3. Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `DB_HOST` | Database host | `localhost` for host execution; Compose overrides it to `db` inside the API |
| `DB_PORT` | PostgreSQL port | `5432` internally |
| `DB_NAME` | Database name | Default: `mekong_mobile_l3` |
| `DB_USER` | Database user | Demo: `postgres` |
| `DB_PASSWORD` | Database password | Used for initial PostgreSQL setup and the API connection |
| `PORT` | Express application port | Docker overrides it to `3000` internally |
| `APP_PORT` | API port on the host | Default: `3000` |
| `WEB_PORT` | Frontend port on the host | Default: `5173` |
| `JWT_SECRET` | JWT signing secret | Minimum 32 UTF-8 bytes |
| `DEMO_PASSWORD` | Password for demo users | At least 8 characters; at most 72 UTF-8 bytes |

`.env.example` contains public demo placeholders. Real credentials, JWT tokens, and `.env` must never be committed.

### 3.1. Running multiple copies on one machine

The repository's Compose file includes:

```yaml
name: cdtn1-l3-smart-crm
```

Two clones using default Compose commands can therefore share the same project resources. To isolate copies, use a **unique `-p` value**. If running simultaneously, also configure **different host ports**.

Example for a second instance:

```dotenv
APP_PORT=3002
WEB_PORT=5175
```

```powershell
docker compose -p cdtn1-l3-second up -d --build
docker compose -p cdtn1-l3-second ps
```

A unique project name isolates Compose-managed resources; different host ports prevent port collisions. One does not replace the other.

## 4. Sample Data

The project includes synthetic data for two Mekong Mobile stores.

| Username | Role | Store |
|---|---|---|
| `sales01` | SALES | MM001 |
| `sales02` | SALES | MM001 |
| `manager01` | MANAGER | MM001 |
| `sales03` | SALES | MM002 |
| `manager02` | MANAGER | MM002 |

An additional demo SALES account is created by the seed script, giving six demo accounts in total. Sign-in passwords are set by `DEMO_PASSWORD` in `.env`. Seeds also create synthetic customers, products and opportunities.

## 5. Verify It Works

**Command convention:** The examples below use the isolated project `cdtn1-l3-v1-check`. Replace it with your actual project name. If you started with the default Compose command, omit `-p cdtn1-l3-v1-check`.

### 5.1. Check container health

```powershell
docker compose -p cdtn1-l3-v1-check ps
```

Expected: `db`, `api` and `web` all show `healthy`.

### 5.2. Check Backend health

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Expected JSON:

```json
{
  "status": "ok",
  "database": "connected"
}
```

If `APP_PORT=3002`, use `http://localhost:3002/health` instead.

### 5.3. Verify the user interface

Open `http://localhost:5173`, or `http://localhost:5175` if configured. Log in with `sales01` and the demo password from `.env`. Confirm the opportunity list loads. Optionally use `manager01` to inspect manager-only views such as the funnel.

### 5.4. Run automated tests

```powershell
docker compose -p cdtn1-l3-v1-check exec api npm test
```

**Observed on the submitted `v1.0` cold clone:**

```text
tests 73
pass 73
fail 0
cancelled 0
skipped 0
```

Passing the test suite does not prove the absence of every bug or vulnerability.

### 5.5. Cold-clone reproducibility verification

**Earlier baseline (commit `1d8ee0b`):** A local cold clone using Compose project `cdtn1-l3-final` and host ports `3002` / `5175` reached three healthy containers. `/health` returned `ok` and `connected`. An earlier isolated clone test also confirmed six demo-user records.

**Submitted release (`v1.0`, commit `0dd09d1`; checked 17 November 2026):** A new local clone in `cdtn1-l3-v1-final-check` initially failed when started with the default Compose project name. The database was healthy, but the API repeatedly logged PostgreSQL error `28P01` and restarted. After using a new Compose project `cdtn1-l3-v1-check`, Docker created a new named database volume, and startup succeeded.

| Verification | Observed result |
|---|---|
| Clone `v1.0` | PASS |
| API and Frontend image builds | PASS |
| New PostgreSQL volume | Created |
| Database, API and Web healthchecks | 3/3 healthy |
| `GET /health` | `status: ok`, `database: connected` |
| Frontend opens | PASS |
| Demo login | PASS |
| Automated tests in API container | 73 PASS, 0 FAIL |

This verification occurred on an existing Windows computer with Docker Desktop, **not a separate physical machine**. Results demonstrate reproducibility with an isolated Compose project and fresh database volume.

The old volume's stored credentials were not directly inspected. Reuse of a volume initialized with another password is a strong explanation consistent with the observed behavior, **not a confirmed root cause**.

### 5.6. Troubleshooting

#### PostgreSQL authentication failed (`28P01`)

**Symptoms:** `db` is healthy; `api` restarts or is unhealthy; `web` cannot start; API logs show `Thiet lap that bai: 28P01`.

**Meaning:** PostgreSQL rejected the credentials used by the API. An existing PostgreSQL volume may have been initialized with a different password. **Changing `DB_PASSWORD` or `POSTGRES_PASSWORD` in `.env` does not change the stored PostgreSQL account password in an existing volume.**

Inspect the error and Compose project without disclosing password values:

```powershell
docker compose logs api --tail=80
docker compose ls
docker compose config --format json | ConvertFrom-Json | Select-Object -ExpandProperty name
```

Check whether the application is reusing an older project/volume. To test a new independent volume safely, assign a *previously unused* project name and free host ports, then run:

```powershell
docker compose -p cdtn1-l3-v1-check up -d --build
docker compose -p cdtn1-l3-v1-check ps
```

This creates separate Compose-managed containers, networks and a database volume. If the new volume also fails with `28P01`, verify the `.env` values, Compose variable mapping, database role, and API connection configuration. A new project name is not a universal solution.

**Data safety:** Do not delete a volume to fix an authentication failure. If existing data is valuable, arrange a backup and correct the database role password or API configuration using a controlled procedure.

#### Database initialization errors

```powershell
docker compose -p cdtn1-l3-v1-check logs --tail=80 db
```

Check migrations and seed initialization. Init scripts do not automatically rerun on existing databases.

#### API unhealthy for another reason

```powershell
docker compose -p cdtn1-l3-v1-check logs --tail=80 api
```

Check DB readiness, credentials, startup/seed errors and `/health`.

#### Frontend HTTP error

```powershell
docker compose -p cdtn1-l3-v1-check logs --tail=80 web
```

Inspect `frontend/docker/nginx.conf`, API health and network connectivity.

#### Host port conflict

Change `APP_PORT` or `WEB_PORT` in `.env` to free host ports and recreate the corresponding project using the same `-p` value.

#### Security and deployment limitations

This prototype is designed for local classroom use only. Public hosting would require replacing demo credentials, HTTPS, proper access controls, backups and recovery testing, security assessment and monitoring. See `docs/security-checklist-bt3.md` for the detailed security self-assessment.
