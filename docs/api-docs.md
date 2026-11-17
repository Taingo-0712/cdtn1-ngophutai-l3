# API Documentation — Smart CRM / Mekong Mobile / L3 (SE)

**Repository:** https://github.com/Taingo-0712/cdtn1-ngophutai-l3  
**Scope:** REST API implemented in `src/index.js` and its registered routes  
**Default base URL:** `http://localhost:3000` (Docker backend)  
**Content type:** `application/json`  
**Authentication header:** `Authorization: Bearer <REDACTED_TOKEN>` (except login and health)

**Example convention:** JSON examples describe the API response structures using representative values. IDs, timestamps, and business records vary with database contents. Previously recorded HTTP checks are documented separately. Credentials and JWTs are redacted.

## Endpoint inventory

| # | Method | Route | Function |
|---:|---|---|---|
| 1 | `POST` | `/api/auth/login` | Authenticate a demo account and issue a one-hour bearer token. |
| 2 | `GET` | `/api/auth/me` | Return the authenticated account context. |
| 3 | `GET` | `/api/opportunities` | List sales opportunities visible to the authenticated account. |
| 4 | `GET` | `/api/opportunities/references` | Provide customer and active product selectors used by opportunity forms. |
| 5 | `GET` | `/api/opportunities/funnel` | Summarize counts of opportunities by pipeline stage for one store. |
| 6 | `GET` | `/api/opportunities/:id/history` | List recorded pipeline stage changes for an authorized opportunity. |
| 7 | `GET` | `/api/opportunities/:id` | Retrieve one sales opportunity visible to the current account. |
| 8 | `POST` | `/api/opportunities` | Create a new opportunity owned by the authenticated salesperson. |
| 9 | `PATCH` | `/api/opportunities/:id/stage` | Advance the opportunity to its next pipeline stage. |
| 10 | `PATCH` | `/api/opportunities/:id/result` | Record final success or failure for an opportunity at CHOT. |
| 11 | `PATCH` | `/api/opportunities/:id` | Edit fields of an owned, not-yet-finalized opportunity. |
| 12 | `DELETE` | `/api/opportunities/:id` | Delete an opportunity that belongs to the authenticated salesperson. |
| 13 | `GET` | `/api/products` | List active catalog products. |
| 14 | `GET` | `/api/products/:id` | Retrieve an active product by ID. |
| 15 | `POST` | `/api/products` | Create a catalog product. |
| 16 | `PATCH` | `/api/products/:id` | Change code and/or name of an active product. |
| 17 | `DELETE` | `/api/products/:id` | Deactivate a product without removing the record from the database. |
| 18 | `GET` | `/health` | Check API availability and PostgreSQL connectivity. |

## API Validation Summary

- `GET /health` returned HTTP 200 with `{"status":"ok","database":"connected"}` in the local Docker environment.
- `GET /api/opportunities` **without Authorization** returned HTTP 401 and `{"message":"UNAUTHENTICATED"}`.
- `POST /api/auth/login` with `{}` returned HTTP 400 and `{"message":"INVALID_LOGIN_DATA"}`.
- The automated regression suite completed with **73/73 passing tests**. Detailed test evidence is recorded in `docs/test-report.md`.

## Endpoint specifications — seven required fields each

### 01. `POST /api/auth/login`

1. **Method and path:** `POST /api/auth/login`.
2. **Business purpose:** Authenticate a demo account and issue a one-hour bearer token.
3. **Authentication and authorization:** Public; no bearer token.
4. **Request parameters/body:** JSON: `username` string (required, trimmed/lowercased, 1–80 chars); `password` string (required, 1–72 UTF-8 bytes).

   **Request example:**
   ```text
   POST /api/auth/login
   ```
   ```json
   {"username":"sales01","password":"<DEMO_PASSWORD_FROM_LOCAL_ENV>"}
   ```
5. **Successful status and response:** 200; response fields: `access_token` (JWT), `token_type` (`Bearer`), `expires_in` (3600), `user` (`user_id`, `username`, `full_name`, `role`, `store_id`).

   ```json
{
  "access_token": "<REDACTED_JWT>",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "user_id": "<USER_ID>",
    "username": "sales01",
    "full_name": "<DEMO_ACCOUNT_NAME>",
    "role": "SALES",
    "store_id": "<STORE_ID>"
  }
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_LOGIN_DATA`; 401 `INVALID_CREDENTIALS`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Response contains credentials-derived JWT. Redact before documenting. `Cache-Control: no-store`.

### 02. `GET /api/auth/me`

1. **Method and path:** `GET /api/auth/me`.
2. **Business purpose:** Return the authenticated account context.
3. **Authentication and authorization:** Bearer token; SALES or MANAGER.
4. **Request parameters/body:** No body or query parameters.

   **Request example:**
   ```text
   GET /api/auth/me
   ```
5. **Successful status and response:** 200; `{ "user": { ...authenticated account fields... } }`.

   ```json
{
  "user": {
    "user_id": "<USER_ID>",
    "username": "sales01",
    "full_name": "<DEMO_ACCOUNT_NAME>",
    "role": "SALES",
    "store_id": "<STORE_ID>"
  }
}
   ```
6. **Error statuses for this implementation:** 401 `UNAUTHENTICATED`; 500 `INTERNAL_SERVER_ERROR` from auth middleware.
7. **Special behavior / known limits:** User object derives from a valid JWT and a current active database account; `Cache-Control: no-store`.

### 03. `GET /api/opportunities`

1. **Method and path:** `GET /api/opportunities`.
2. **Business purpose:** List sales opportunities visible to the authenticated account.
3. **Authentication and authorization:** Bearer; SALES own opportunities in store; MANAGER store-wide.
4. **Request parameters/body:** Optional query `stage` string: `TIEP_CAN`, `TU_VAN`, `BAO_GIA`, `CHOT`; omit for all.

   **Request example:**
   ```text
   GET /api/opportunities?stage=TIEP_CAN
   ```
5. **Successful status and response:** 200; JSON array of opportunity records with joined `customer_name`, `product_name`, `customer_phone`.

   ```json
[
  {
    "opportunity_id": "<OPPORTUNITY_ID>",
    "customer_id": "<CUSTOMER_ID>",
    "product_id": "<PRODUCT_ID>",
    "owner_id": "<OWNER_ID>",
    "need_desc": "Classroom demo opportunity",
    "expected_value": "1000000",
    "stage": "TIEP_CAN",
    "result": null,
    "failure_reason": null,
    "created_at": "<TIMESTAMP>",
    "updated_at": "<TIMESTAMP>",
    "customer_name": "<DEMO_CUSTOMER_NAME>",
    "product_name": "iPhone 15 128GB",
    "customer_phone": "090****001"
  }
]
   ```
6. **Error statuses for this implementation:** 400 `INVALID_STAGE`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Customer phone is masked for SALES, visible for MANAGER. Stage filtering is applied inside SQL with access control.

### 04. `GET /api/opportunities/references`

1. **Method and path:** `GET /api/opportunities/references`.
2. **Business purpose:** Provide customer and active product selectors used by opportunity forms.
3. **Authentication and authorization:** Bearer; SALES or MANAGER.
4. **Request parameters/body:** No body or query parameters.

   **Request example:**
   ```text
   GET /api/opportunities/references
   ```
5. **Successful status and response:** 200; object with `customers` array (`customer_id`,`full_name`) and `products` array (`product_id`,`product_code`,`product_name`).

   ```json
{
  "customers": [
    {
      "customer_id": "<CUSTOMER_ID>",
      "full_name": "<DEMO_CUSTOMER_NAME>"
    }
  ],
  "products": [
    {
      "product_id": "<PRODUCT_ID>",
      "product_code": "DEMO-IP15",
      "product_name": "iPhone 15 128GB"
    }
  ]
}
   ```
6. **Error statuses for this implementation:** 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Returns references for the UI; implementation does not apply per-store filtering to reference list.

### 05. `GET /api/opportunities/funnel`

1. **Method and path:** `GET /api/opportunities/funnel`.
2. **Business purpose:** Summarize counts of opportunities by pipeline stage for one store.
3. **Authentication and authorization:** Bearer; MANAGER only.
4. **Request parameters/body:** No body or query parameters.

   **Request example:**
   ```text
   GET /api/opportunities/funnel
   ```
5. **Successful status and response:** 200; array of four `{ "stage": string, "count": number }` records.

   ```json
[
  {
    "stage": "TIEP_CAN",
    "count": 1
  },
  {
    "stage": "TU_VAN",
    "count": 0
  },
  {
    "stage": "BAO_GIA",
    "count": 0
  },
  {
    "stage": "CHOT",
    "count": 0
  }
]
   ```
6. **Error statuses for this implementation:** 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Includes all four stages even when a count is zero; restricted to manager store.

### 06. `GET /api/opportunities/:id/history`

1. **Method and path:** `GET /api/opportunities/:id/history`.
2. **Business purpose:** List recorded pipeline stage changes for an authorized opportunity.
3. **Authentication and authorization:** Bearer; SALES owner or MANAGER in store.
4. **Request parameters/body:** Path `id` required: opportunity identifier.

   **Request example:**
   ```text
   GET /api/opportunities/<EXISTING_OPPORTUNITY_ID>/history
   ```
5. **Successful status and response:** 200; array of history records (`history_id`,`from_stage`,`to_stage`,`changed_at`,`changed_by`,`changed_by_name`).

   ```json
[
  {
    "history_id": "<HISTORY_ID>",
    "from_stage": "TIEP_CAN",
    "to_stage": "TU_VAN",
    "changed_at": "<TIMESTAMP>",
    "changed_by": "<USER_ID>",
    "changed_by_name": "<DEMO_ACCOUNT_NAME>"
  }
]
   ```
6. **Error statuses for this implementation:** 400 `INVALID_DATA` for PostgreSQL invalid numeric syntax; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** First checks opportunity visibility; returns `[]` if accessible but no stage history.

### 07. `GET /api/opportunities/:id`

1. **Method and path:** `GET /api/opportunities/:id`.
2. **Business purpose:** Retrieve one sales opportunity visible to the current account.
3. **Authentication and authorization:** Bearer; SALES owner or MANAGER in store.
4. **Request parameters/body:** Path `id` required: opportunity identifier.

   **Request example:**
   ```text
   GET /api/opportunities/<EXISTING_OPPORTUNITY_ID>
   ```
5. **Successful status and response:** 200; single opportunity record joined with customer/product name and customer phone.

   ```json
{
  "opportunity_id": "<OPPORTUNITY_ID>",
  "customer_id": "<CUSTOMER_ID>",
  "product_id": "<PRODUCT_ID>",
  "owner_id": "<OWNER_ID>",
  "need_desc": "Classroom demo opportunity",
  "expected_value": "1000000",
  "stage": "TIEP_CAN",
  "result": null,
  "failure_reason": null,
  "created_at": "<TIMESTAMP>",
  "updated_at": "<TIMESTAMP>",
  "customer_name": "<DEMO_CUSTOMER_NAME>",
  "product_name": "iPhone 15 128GB",
  "customer_phone": "090****001"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** SALES phone is masked. An invisible ID may be reported as not found.

### 08. `POST /api/opportunities`

1. **Method and path:** `POST /api/opportunities`.
2. **Business purpose:** Create a new opportunity owned by the authenticated salesperson.
3. **Authentication and authorization:** Bearer; SALES only.
4. **Request parameters/body:** JSON required: `customer_id` (existing id), `product_id` (active product id), `need_desc` (nonempty trimmed string ≤500), `expected_value` (safe nonnegative integer ≤999999999999999; numeric string accepted).

   **Request example:**
   ```text
   POST /api/opportunities
   ```
   ```json
   {"customer_id":"<EXISTING_CUSTOMER_ID>","product_id":"<ACTIVE_PRODUCT_ID>","need_desc":"Classroom demo opportunity","expected_value":1000000}
   ```
5. **Successful status and response:** 201; newly created opportunity row.

   ```json
{
  "opportunity_id": "<NEW_OPPORTUNITY_ID>",
  "customer_id": "<CUSTOMER_ID>",
  "product_id": "<PRODUCT_ID>",
  "owner_id": "<CURRENT_USER_ID>",
  "need_desc": "Classroom demo opportunity",
  "expected_value": "1000000",
  "stage": "TIEP_CAN",
  "result": null,
  "failure_reason": null,
  "created_at": "<TIMESTAMP>",
  "updated_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_OPPORTUNITY_DATA`/`MISSING_REQUIRED_FIELDS`/`INVALID_NEED_DESC`/`INVALID_EXPECTED_VALUE`/`INVALID_REFERENCE`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Owner derived from token; initial stage `TIEP_CAN`; references must exist and product must be active. This request creates data.

### 09. `PATCH /api/opportunities/:id/stage`

1. **Method and path:** `PATCH /api/opportunities/:id/stage`.
2. **Business purpose:** Advance the opportunity to its next pipeline stage.
3. **Authentication and authorization:** Bearer; SALES owner only.
4. **Request parameters/body:** Path `id` required. JSON `stage` required, one of the four stages; must be exactly next in sequence.

   **Request example:**
   ```text
   PATCH /api/opportunities/:id/stage
   ```
   ```json
   {"stage":"TU_VAN"}
   ```
5. **Successful status and response:** 200; updated opportunity row.

   ```json
{
  "opportunity_id": "<OPPORTUNITY_ID>",
  "customer_id": "<CUSTOMER_ID>",
  "product_id": "<PRODUCT_ID>",
  "owner_id": "<OWNER_ID>",
  "need_desc": "Classroom demo opportunity",
  "expected_value": "1000000",
  "stage": "TU_VAN",
  "result": null,
  "failure_reason": null,
  "created_at": "<TIMESTAMP>",
  "updated_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_STAGE`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 409 `INVALID_STAGE_TRANSITION`/`RESULT_ALREADY_RECORDED`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Valid order: TIEP_CAN → TU_VAN → BAO_GIA → CHOT. Transition and history insert are in one transaction. This request changes data.

### 10. `PATCH /api/opportunities/:id/result`

1. **Method and path:** `PATCH /api/opportunities/:id/result`.
2. **Business purpose:** Record final success or failure for an opportunity at CHOT.
3. **Authentication and authorization:** Bearer; SALES owner only.
4. **Request parameters/body:** Path `id` required. JSON `result` required: `THANH_CONG` or `THAT_BAI`; `failure_reason` required (nonblank, trimmed, max 500) if `THAT_BAI`.

   **Request example:**
   ```text
   PATCH /api/opportunities/:id/result
   ```
   ```json
   {"result":"THAT_BAI","failure_reason":"Customer declined demo offer"}
   ```
5. **Successful status and response:** 200; updated opportunity row.

   ```json
{
  "opportunity_id": "<OPPORTUNITY_ID>",
  "customer_id": "<CUSTOMER_ID>",
  "product_id": "<PRODUCT_ID>",
  "owner_id": "<OWNER_ID>",
  "need_desc": "Classroom demo opportunity",
  "expected_value": "1000000",
  "stage": "CHOT",
  "result": "THAT_BAI",
  "failure_reason": "Customer declined demo offer",
  "created_at": "<TIMESTAMP>",
  "updated_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_RESULT`/`FAILURE_REASON_REQUIRED`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 409 `OPPORTUNITY_NOT_AT_CHOT`/`RESULT_ALREADY_RECORDED`/`RESULT_UPDATE_CONFLICT`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Final result can only be written once at `CHOT`. Success saves `failure_reason` as null. This request changes data.

### 11. `PATCH /api/opportunities/:id`

1. **Method and path:** `PATCH /api/opportunities/:id`.
2. **Business purpose:** Edit fields of an owned, not-yet-finalized opportunity.
3. **Authentication and authorization:** Bearer; SALES owner only.
4. **Request parameters/body:** Path `id` required. JSON: at least one of `product_id` (positive bigint, active), `need_desc` (trimmed 1–500 chars, no NUL), `expected_value` (safe integer 0–999999999999999). Other fields rejected.

   **Request example:**
   ```text
   PATCH /api/opportunities/:id
   ```
   ```json
   {"need_desc":"Updated classroom demo request"}
   ```
5. **Successful status and response:** 200; updated opportunity row.

   ```json
{
  "opportunity_id": "<OPPORTUNITY_ID>",
  "customer_id": "<CUSTOMER_ID>",
  "product_id": "<PRODUCT_ID>",
  "owner_id": "<OWNER_ID>",
  "need_desc": "Updated classroom demo request",
  "expected_value": "1000000",
  "stage": "TIEP_CAN",
  "result": null,
  "failure_reason": null,
  "created_at": "<TIMESTAMP>",
  "updated_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_OPPORTUNITY_DATA`/`INVALID_PRODUCT_ID`/`INVALID_NEED_DESC`/`INVALID_EXPECTED_VALUE`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 409 `OPPORTUNITY_FINALIZED`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Uses a transaction and row locking; cannot edit after recording a final result. This request changes data.

### 12. `DELETE /api/opportunities/:id`

1. **Method and path:** `DELETE /api/opportunities/:id`.
2. **Business purpose:** Delete an opportunity that belongs to the authenticated salesperson.
3. **Authentication and authorization:** Bearer; SALES owner only.
4. **Request parameters/body:** Path `id` required; no request body.

   **Request example:**
   ```text
   DELETE /api/opportunities/<DISPOSABLE_OWN_OPPORTUNITY_ID>
   ```
5. **Successful status and response:** 200; deleted opportunity row returned by PostgreSQL.

   ```json
{
  "opportunity_id": "<DELETED_OPPORTUNITY_ID>",
  "customer_id": "<CUSTOMER_ID>",
  "product_id": "<PRODUCT_ID>",
  "owner_id": "<OWNER_ID>",
  "need_desc": "Disposable demo opportunity",
  "expected_value": "1000000",
  "stage": "TIEP_CAN",
  "result": null,
  "failure_reason": null,
  "created_at": "<TIMESTAMP>",
  "updated_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 409 `OPPORTUNITY_HAS_HISTORY`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Physical deletion; a history foreign-key constraint may prevent deletion. Use disposable demo records only.

### 13. `GET /api/products`

1. **Method and path:** `GET /api/products`.
2. **Business purpose:** List active catalog products.
3. **Authentication and authorization:** Bearer; SALES or MANAGER.
4. **Request parameters/body:** No body or query parameters.

   **Request example:**
   ```text
   GET /api/products
   ```
5. **Successful status and response:** 200; JSON array with `product_id`,`product_code`,`product_name`,`is_active`,`created_at`.

   ```json
[
  {
    "product_id": "<PRODUCT_ID>",
    "product_code": "DEMO-IP15",
    "product_name": "iPhone 15 128GB",
    "is_active": true,
    "created_at": "<TIMESTAMP>"
  }
]
   ```
6. **Error statuses for this implementation:** 401 `UNAUTHENTICATED`; 500 `INTERNAL_SERVER_ERROR` (unexpected repository error).
7. **Special behavior / known limits:** Only active products; sorted by product ID.

### 14. `GET /api/products/:id`

1. **Method and path:** `GET /api/products/:id`.
2. **Business purpose:** Retrieve an active product by ID.
3. **Authentication and authorization:** Bearer; SALES or MANAGER.
4. **Request parameters/body:** Path `id` required: positive bigint up to 9223372036854775807.

   **Request example:**
   ```text
   GET /api/products/<ACTIVE_PRODUCT_ID>
   ```
5. **Successful status and response:** 200; single product with `product_id`,`product_code`,`product_name`,`is_active`,`created_at`.

   ```json
{
  "product_id": "<PRODUCT_ID>",
  "product_code": "DEMO-IP15",
  "product_name": "iPhone 15 128GB",
  "is_active": true,
  "created_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_PRODUCT_ID`; 401 `UNAUTHENTICATED`; 404 `PRODUCT_NOT_FOUND`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Inactive products are treated as not found.

### 15. `POST /api/products`

1. **Method and path:** `POST /api/products`.
2. **Business purpose:** Create a catalog product.
3. **Authentication and authorization:** Bearer; MANAGER only.
4. **Request parameters/body:** JSON required: `product_code` string 1–30 characters after trim; `product_name` string 1–150 characters after trim; no other keys.

   **Request example:**
   ```text
   POST /api/products
   ```
   ```json
   {"product_code":"DOC-DEMO-001","product_name":"Documentation demo product"}
   ```
5. **Successful status and response:** 201; inserted product row (PostgreSQL `RETURNING *`).

   ```json
{
  "product_id": "<NEW_PRODUCT_ID>",
  "product_code": "DOC-DEMO-001",
  "product_name": "Documentation demo product",
  "is_active": true,
  "created_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_PRODUCT_DATA`/`INVALID_PRODUCT_CODE`/`INVALID_PRODUCT_NAME`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 409 `PRODUCT_CODE_EXISTS`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Product code must be unique; strings are trimmed. This request creates data.

### 16. `PATCH /api/products/:id`

1. **Method and path:** `PATCH /api/products/:id`.
2. **Business purpose:** Change code and/or name of an active product.
3. **Authentication and authorization:** Bearer; MANAGER only.
4. **Request parameters/body:** Path `id` required: positive bigint. JSON: at least one `product_code`/`product_name` following POST constraints; no other keys.

   **Request example:**
   ```text
   PATCH /api/products/:id
   ```
   ```json
   {"product_name":"Updated demo product"}
   ```
5. **Successful status and response:** 200; updated product row (PostgreSQL `RETURNING *`).

   ```json
{
  "product_id": "<PRODUCT_ID>",
  "product_code": "DOC-DEMO-001",
  "product_name": "Updated demo product",
  "is_active": true,
  "created_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_PRODUCT_ID`/`INVALID_PRODUCT_DATA`/`INVALID_PRODUCT_CODE`/`INVALID_PRODUCT_NAME`/`EMPTY_PRODUCT_UPDATE`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `PRODUCT_NOT_FOUND`; 409 `PRODUCT_CODE_EXISTS`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Only active products may be updated. This request changes data.

### 17. `DELETE /api/products/:id`

1. **Method and path:** `DELETE /api/products/:id`.
2. **Business purpose:** Deactivate a product without removing the record from the database.
3. **Authentication and authorization:** Bearer; MANAGER only.
4. **Request parameters/body:** Path `id` required: positive bigint; no body.

   **Request example:**
   ```text
   DELETE /api/products/<DISPOSABLE_PRODUCT_ID>
   ```
5. **Successful status and response:** 200; product row after update (`is_active = false`).

   ```json
{
  "product_id": "<PRODUCT_ID>",
  "product_code": "DOC-DEMO-001",
  "product_name": "Updated demo product",
  "is_active": false,
  "created_at": "<TIMESTAMP>"
}
   ```
6. **Error statuses for this implementation:** 400 `INVALID_PRODUCT_ID`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `PRODUCT_NOT_FOUND`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Soft delete sets `is_active` to false; subsequent GET queries hide the product. This request changes data.

### 18. `GET /health`

1. **Method and path:** `GET /health`.
2. **Business purpose:** Check API availability and PostgreSQL connectivity.
3. **Authentication and authorization:** Public; no bearer token.
4. **Request parameters/body:** No body or query parameters.

   **Request example:**
   ```text
   GET /health
   ```
5. **Successful status and response:** 200; response: `{"status":"ok","database":"connected"}`.

   **Docker health check:** HTTP requests returned `status: ok` and `database: connected` in the submitted local Docker evidence.

   ```json
   {"status":"ok","database":"connected"}
   ```
6. **Error statuses for this implementation:** 500 when the database is disconnected: `{"status":"error","database":"disconnected"}`.
7. **Special behavior / known limits:** Local Docker check uses backend host port `APP_PORT` (default 3000); Nginx also proxies /health.

## Recorded HTTP Checks

**Unauthenticated opportunity list — recorded HTTP response:**
```http
GET /api/opportunities HTTP/1.1
Host: localhost:3000
```
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{"message":"UNAUTHENTICATED"}
```

**Observed invalid login payload:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{}
```
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"message":"INVALID_LOGIN_DATA"}
```

**Observed health result:**
```json
{"status":"ok","database":"connected"}
```

