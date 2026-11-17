# API Documentation — Smart CRM / Mekong Mobile / L3 (SE)

**Repository:** https://github.com/Taingo-0712/cdtn1-ngophutai-l3  
**Scope:** REST API implemented in `src/index.js` and its registered routes  
**Default base URL:** `http://localhost:3000` (Docker backend)  
**Content type:** `application/json`  
**Authentication header:** `Authorization: Bearer <REDACTED_TOKEN>` (except login and health)

**Live evidence:** On 17 November 2026, each of the 18 endpoints was exercised in Postman against the local Docker environment. All 18 supplied screenshots show a successful HTTP response (16 responses with status `200`, two creation responses with status `201`). Screenshot files are stored in the repository's root-level `API/` folder and linked under each endpoint.

**Evidence convention:** Request bodies reproduce the Postman Collection used for the recorded run; numeric identifiers are shown when corroborated by the captured response. Response JSON below contains **observed fields** transcribed from screenshots. For long lists and large objects, the JSON is a selected excerpt, not a claim that the whole body is reproduced. Bearer tokens and passwords are redacted. See the linked image for the captured screen.

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

## Postman execution summary — 17 November 2026

| Recorded status | Endpoints |
|---|---|
| HTTP `200 OK` | 01–07, 09–14, 16–18 |
| HTTP `201 Created` | 08, 15 |

**Total:** 18/18 endpoints have a captured successful HTTP response and a corresponding screenshot. The screenshots provide observed HTTP status and response content. Automated tests (73/73) and the 15 functional test cases are recorded separately in `docs/test-report.md`.

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

   **Executed Postman request:**

   ```http
   POST {{baseUrl}}/api/auth/login
   ```

   **Request body used in the Postman Collection:**

   ```json
{
  "username": "sales01",
  "password": "[ĐÃ ẨN]"
}
   ```

5. **Successful status and response:** 200; response fields: `access_token` (JWT), `token_type` (`Bearer`), `expires_in` (3600), `user` (`user_id`, `username`, `full_name`, `role`, `store_id`).

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "user_id": "1",
    "username": "sales01",
    "role": "SALES",
    "store_id": "1"
  }
}
   ```

   The screenshot shows a successful login for `sales01`; the generated access token is deliberately omitted from the public record.

   **Postman screenshot:** [BT3-API-01.png](../API/BT3-API-01.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_LOGIN_DATA`; 401 `INVALID_CREDENTIALS`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Response contains credentials-derived JWT. Redact before documenting. `Cache-Control: no-store`.

### 02. `GET /api/auth/me`

1. **Method and path:** `GET /api/auth/me`.
2. **Business purpose:** Return the authenticated account context.
3. **Authentication and authorization:** Bearer token; SALES or MANAGER.
4. **Request parameters/body:** No body or query parameters.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/api/auth/me
   ```

   Request body: none.

5. **Successful status and response:** 200; `{ "user": { ...authenticated account fields... } }`.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "user": {
    "user_id": "1",
    "username": "sales01",
    "full_name": "Nguyen Van An",
    "role": "SALES",
    "store_id": "1"
  }
}
   ```

   **Postman screenshot:** [BT3-API-02.png](../API/BT3-API-02.png) (17 November 2026).

6. **Error statuses for this implementation:** 401 `UNAUTHENTICATED`; 500 `INTERNAL_SERVER_ERROR` from auth middleware.
7. **Special behavior / known limits:** User object derives from a valid JWT and a current active database account; `Cache-Control: no-store`.

### 03. `GET /api/opportunities`

1. **Method and path:** `GET /api/opportunities`.
2. **Business purpose:** List sales opportunities visible to the authenticated account.
3. **Authentication and authorization:** Bearer; SALES own opportunities in store; MANAGER store-wide.
4. **Request parameters/body:** Optional query `stage` string: `TIEP_CAN`, `TU_VAN`, `BAO_GIA`, `CHOT`; omit for all.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/api/opportunities
   ```

   Request body: none.

5. **Successful status and response:** 200; JSON array of opportunity records with joined `customer_name`, `product_name`, `customer_phone`.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "opportunity_id": "1",
  "customer_id": "1",
  "stage": "CHOT",
  "result": "THANH_CONG",
  "customer_phone": "090****567"
}
   ```

   This JSON is a field excerpt from one item in the returned array.

   **Postman screenshot:** [BT3-API-03.png](../API/BT3-API-03.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_STAGE`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Customer phone is masked for SALES, visible for MANAGER. Stage filtering is applied inside SQL with access control.

### 04. `GET /api/opportunities/references`

1. **Method and path:** `GET /api/opportunities/references`.
2. **Business purpose:** Provide customer and active product selectors used by opportunity forms.
3. **Authentication and authorization:** Bearer; SALES or MANAGER.
4. **Request parameters/body:** No body or query parameters.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/api/opportunities/references
   ```

   Request body: none.

5. **Successful status and response:** 200; object with `customers` array (`customer_id`,`full_name`) and `products` array (`product_id`,`product_code`,`product_name`).

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "customers": [
    {
      "customer_id": "3",
      "full_name": "Khach hang demo 01"
    },
    {
      "customer_id": "4",
      "full_name": "Khach hang demo 02"
    }
  ]
}
   ```

   The screenshot displays the customers section of the reference object; the endpoint also returns a products collection.

   **Postman screenshot:** [BT3-API-04.png](../API/BT3-API-04.png) (17 November 2026).

6. **Error statuses for this implementation:** 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Returns references for the UI; implementation does not apply per-store filtering to reference list.

### 05. `GET /api/opportunities/funnel`

1. **Method and path:** `GET /api/opportunities/funnel`.
2. **Business purpose:** Summarize counts of opportunities by pipeline stage for one store.
3. **Authentication and authorization:** Bearer; MANAGER only.
4. **Request parameters/body:** No body or query parameters.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/api/opportunities/funnel
   ```

   Request body: none.

5. **Successful status and response:** 200; array of four `{ "stage": string, "count": number }` records.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
[
  {
    "stage": "TIEP_CAN",
    "count": 14
  },
  {
    "stage": "TU_VAN",
    "count": 3
  },
  {
    "stage": "BAO_GIA",
    "count": 2
  },
  {
    "stage": "CHOT",
    "count": 11
  }
]
   ```

   **Postman screenshot:** [BT3-API-05.png](../API/BT3-API-05.png) (17 November 2026).

6. **Error statuses for this implementation:** 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Includes all four stages even when a count is zero; restricted to manager store.

### 06. `GET /api/opportunities/:id/history`

1. **Method and path:** `GET /api/opportunities/:id/history`.
2. **Business purpose:** List recorded pipeline stage changes for an authorized opportunity.
3. **Authentication and authorization:** Bearer; SALES owner or MANAGER in store.
4. **Request parameters/body:** Path `id` required: opportunity identifier.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/api/opportunities/{{opportunityId}}/history
   ```

   Request body: none.

   The ID was supplied by the active Postman environment; its resolved numeric value is not visible in the screenshot.

5. **Successful status and response:** 200; array of history records (`history_id`,`from_stage`,`to_stage`,`changed_at`,`changed_by`,`changed_by_name`).

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
[
  {
    "history_id": "30",
    "from_stage": "TIEP_CAN",
    "to_stage": "TU_VAN",
    "changed_by": "1",
    "changed_by_name": "Nguyen Van An"
  }
]
   ```

   This JSON is the recorded history entry; the response is an array.

   **Postman screenshot:** [BT3-API-06.png](../API/BT3-API-06.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_DATA` for PostgreSQL invalid numeric syntax; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** First checks opportunity visibility; returns `[]` if accessible but no stage history.

### 07. `GET /api/opportunities/:id`

1. **Method and path:** `GET /api/opportunities/:id`.
2. **Business purpose:** Retrieve one sales opportunity visible to the current account.
3. **Authentication and authorization:** Bearer; SALES owner or MANAGER in store.
4. **Request parameters/body:** Path `id` required: opportunity identifier.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/api/opportunities/{{opportunityId}}
   ```

   Request body: none.

   The ID was supplied by the active Postman environment; its resolved numeric value is not visible in the screenshot.

5. **Successful status and response:** 200; single opportunity record joined with customer/product name and customer phone.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "opportunity_id": "101",
  "customer_id": "3",
  "stage": "TU_VAN",
  "result": null,
  "customer_phone": "090****001"
}
   ```

   This JSON shows selected fields of an opportunity record.

   **Postman screenshot:** [BT3-API-07.png](../API/BT3-API-07.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** SALES phone is masked. An invisible ID may be reported as not found.

### 08. `POST /api/opportunities`

1. **Method and path:** `POST /api/opportunities`.
2. **Business purpose:** Create a new opportunity owned by the authenticated salesperson.
3. **Authentication and authorization:** Bearer; SALES only.
4. **Request parameters/body:** JSON required: `customer_id` (existing id), `product_id` (active product id), `need_desc` (nonempty trimmed string ≤500), `expected_value` (safe nonnegative integer ≤999999999999999; numeric string accepted).

   **Executed Postman request:**

   ```http
   POST {{baseUrl}}/api/opportunities
   ```

   **Request body used in the Postman Collection:**

   ```json
{
  "customer_id": "3",
  "product_id": "3",
  "need_desc": "Kiem thu BT3 bang Postman",
  "expected_value": 1000000
}
   ```

5. **Successful status and response:** 201; newly created opportunity row.

   **Observed HTTP `201` response — transcribed fields from the screenshot:**

   ```json
{
  "opportunity_id": "98",
  "customer_id": "3",
  "product_id": "3",
  "expected_value": "1000000",
  "stage": "TIEP_CAN",
  "result": null
}
   ```

   The response confirms creation of opportunity `98` at `TIEP_CAN`.

   **Postman screenshot:** [BT3-API-08.png](../API/BT3-API-08.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_OPPORTUNITY_DATA`/`MISSING_REQUIRED_FIELDS`/`INVALID_NEED_DESC`/`INVALID_EXPECTED_VALUE`/`INVALID_REFERENCE`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Owner derived from token; initial stage `TIEP_CAN`; references must exist and product must be active. This request creates data.

### 09. `PATCH /api/opportunities/:id/stage`

1. **Method and path:** `PATCH /api/opportunities/:id/stage`.
2. **Business purpose:** Advance the opportunity to its next pipeline stage.
3. **Authentication and authorization:** Bearer; SALES owner only.
4. **Request parameters/body:** Path `id` required. JSON `stage` required, one of the four stages; must be exactly next in sequence.

   **Executed Postman request:**

   ```http
   PATCH {{baseUrl}}/api/opportunities/98/stage
   ```

   **Request body used in the Postman Collection:**

   ```json
{
  "stage": "TU_VAN"
}
   ```

5. **Successful status and response:** 200; updated opportunity row.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "opportunity_id": "98",
  "stage": "TU_VAN",
  "result": null,
  "updated_at": "2026-11-17T07:40:15.041Z"
}
   ```

   The captured result is the `TIEP_CAN` → `TU_VAN` transition on opportunity `98`.

   **Postman screenshot:** [BT3-API-09.png](../API/BT3-API-09.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_STAGE`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 409 `INVALID_STAGE_TRANSITION`/`RESULT_ALREADY_RECORDED`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Valid order: TIEP_CAN → TU_VAN → BAO_GIA → CHOT. Transition and history insert are in one transaction. This request changes data.

### 10. `PATCH /api/opportunities/:id/result`

1. **Method and path:** `PATCH /api/opportunities/:id/result`.
2. **Business purpose:** Record final success or failure for an opportunity at CHOT.
3. **Authentication and authorization:** Bearer; SALES owner only.
4. **Request parameters/body:** Path `id` required. JSON `result` required: `THANH_CONG` or `THAT_BAI`; `failure_reason` required (nonblank, trimmed, max 500) if `THAT_BAI`.

   **Executed Postman request:**

   ```http
   PATCH {{baseUrl}}/api/opportunities/99/result
   ```

   **Request body used in the Postman Collection:**

   ```json
{
  "result": "THAT_BAI",
  "failure_reason": "Khach hang tu choi trong lan kiem thu Postman"
}
   ```

5. **Successful status and response:** 200; updated opportunity row.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "opportunity_id": "99",
  "stage": "CHOT",
  "result": "THAT_BAI",
  "failure_reason": "Khach hang tu choi trong lan kiem thu Postman"
}
   ```

   The captured result is a finalized opportunity `99` at `CHOT`; the request body is shown above.

   **Postman screenshot:** [BT3-API-10.png](../API/BT3-API-10.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_RESULT`/`FAILURE_REASON_REQUIRED`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 409 `OPPORTUNITY_NOT_AT_CHOT`/`RESULT_ALREADY_RECORDED`/`RESULT_UPDATE_CONFLICT`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Final result can only be written once at `CHOT`. Success saves `failure_reason` as null. This request changes data.

### 11. `PATCH /api/opportunities/:id`

1. **Method and path:** `PATCH /api/opportunities/:id`.
2. **Business purpose:** Edit fields of an owned, not-yet-finalized opportunity.
3. **Authentication and authorization:** Bearer; SALES owner only.
4. **Request parameters/body:** Path `id` required. JSON: at least one of `product_id` (positive bigint, active), `need_desc` (trimmed 1–500 chars, no NUL), `expected_value` (safe integer 0–999999999999999). Other fields rejected.

   **Executed Postman request:**

   ```http
   PATCH {{baseUrl}}/api/opportunities/98
   ```

   **Request body used in the Postman Collection:**

   ```json
{
  "need_desc": "Da cap nhat nhu cau trong buoi kiem thu BT3"
}
   ```

5. **Successful status and response:** 200; updated opportunity row.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "opportunity_id": "98",
  "need_desc": "Da cap nhat nhu cau trong buoi kiem thu BT3",
  "stage": "TU_VAN"
}
   ```

   **Postman screenshot:** [BT3-API-11.png](../API/BT3-API-11.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_OPPORTUNITY_DATA`/`INVALID_PRODUCT_ID`/`INVALID_NEED_DESC`/`INVALID_EXPECTED_VALUE`/`INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 409 `OPPORTUNITY_FINALIZED`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Uses a transaction and row locking; cannot edit after recording a final result. This request changes data.

### 12. `DELETE /api/opportunities/:id`

1. **Method and path:** `DELETE /api/opportunities/:id`.
2. **Business purpose:** Delete an opportunity that belongs to the authenticated salesperson.
3. **Authentication and authorization:** Bearer; SALES owner only.
4. **Request parameters/body:** Path `id` required; no request body.

   **Executed Postman request:**

   ```http
   DELETE {{baseUrl}}/api/opportunities/100
   ```

   Request body: none.

5. **Successful status and response:** 200; deleted opportunity row returned by PostgreSQL.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "opportunity_id": "100",
  "stage": "TIEP_CAN",
  "result": null
}
   ```

   The response is the deleted disposable opportunity `100`, which had no stage history.

   **Postman screenshot:** [BT3-API-12.png](../API/BT3-API-12.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_DATA`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `OPPORTUNITY_NOT_FOUND`; 409 `OPPORTUNITY_HAS_HISTORY`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Physical deletion; a history foreign-key constraint may prevent deletion. Use disposable demo records only.

### 13. `GET /api/products`

1. **Method and path:** `GET /api/products`.
2. **Business purpose:** List active catalog products.
3. **Authentication and authorization:** Bearer; SALES or MANAGER.
4. **Request parameters/body:** No body or query parameters.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/api/products
   ```

   Request body: none.

5. **Successful status and response:** 200; JSON array with `product_id`,`product_code`,`product_name`,`is_active`,`created_at`.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "product_id": "1",
  "product_code": "IP15-128",
  "product_name": "Điện thoại kiểm thử đã sửa",
  "is_active": true
}
   ```

   This JSON is a selected product from the returned array.

   **Postman screenshot:** [BT3-API-13.png](../API/BT3-API-13.png) (17 November 2026).

6. **Error statuses for this implementation:** 401 `UNAUTHENTICATED`; 500 `INTERNAL_SERVER_ERROR` (unexpected repository error).
7. **Special behavior / known limits:** Only active products; sorted by product ID.

### 14. `GET /api/products/:id`

1. **Method and path:** `GET /api/products/:id`.
2. **Business purpose:** Retrieve an active product by ID.
3. **Authentication and authorization:** Bearer; SALES or MANAGER.
4. **Request parameters/body:** Path `id` required: positive bigint up to 9223372036854775807.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/api/products/3
   ```

   Request body: none.

5. **Successful status and response:** 200; single product with `product_id`,`product_code`,`product_name`,`is_active`,`created_at`.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "product_id": "3",
  "product_code": "SP-BT2-TEST01",
  "product_name": "Điện thoại kiểm thử BT2",
  "is_active": true
}
   ```

   **Postman screenshot:** [BT3-API-14.png](../API/BT3-API-14.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_PRODUCT_ID`; 401 `UNAUTHENTICATED`; 404 `PRODUCT_NOT_FOUND`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Inactive products are treated as not found.

### 15. `POST /api/products`

1. **Method and path:** `POST /api/products`.
2. **Business purpose:** Create a catalog product.
3. **Authentication and authorization:** Bearer; MANAGER only.
4. **Request parameters/body:** JSON required: `product_code` string 1–30 characters after trim; `product_name` string 1–150 characters after trim; no other keys.

   **Executed Postman request:**

   ```http
   POST {{baseUrl}}/api/products
   ```

   **Request body used in the Postman Collection:**

   ```json
{
  "product_code": "BT3-1794902226899",
  "product_name": "BT3 Postman Demo Product"
}
   ```

5. **Successful status and response:** 201; inserted product row (PostgreSQL `RETURNING *`).

   **Observed HTTP `201` response — transcribed fields from the screenshot:**

   ```json
{
  "product_id": "31",
  "product_code": "BT3-1794902226899",
  "product_name": "BT3 Postman Demo Product",
  "is_active": true
}
   ```

   The created product code was generated at execution time and returned in the HTTP response.

   **Postman screenshot:** [BT3-API-15.png](../API/BT3-API-15.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_PRODUCT_DATA`/`INVALID_PRODUCT_CODE`/`INVALID_PRODUCT_NAME`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 409 `PRODUCT_CODE_EXISTS`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Product code must be unique; strings are trimmed. This request creates data.

### 16. `PATCH /api/products/:id`

1. **Method and path:** `PATCH /api/products/:id`.
2. **Business purpose:** Change code and/or name of an active product.
3. **Authentication and authorization:** Bearer; MANAGER only.
4. **Request parameters/body:** Path `id` required: positive bigint. JSON: at least one `product_code`/`product_name` following POST constraints; no other keys.

   **Executed Postman request:**

   ```http
   PATCH {{baseUrl}}/api/products/31
   ```

   **Request body used in the Postman Collection:**

   ```json
{
  "product_name": "BT3 Postman Demo Product - Updated"
}
   ```

5. **Successful status and response:** 200; updated product row (PostgreSQL `RETURNING *`).

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "product_id": "31",
  "product_name": "BT3 Postman Demo Product - Updated",
  "is_active": true
}
   ```

   **Postman screenshot:** [BT3-API-16.png](../API/BT3-API-16.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_PRODUCT_ID`/`INVALID_PRODUCT_DATA`/`INVALID_PRODUCT_CODE`/`INVALID_PRODUCT_NAME`/`EMPTY_PRODUCT_UPDATE`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `PRODUCT_NOT_FOUND`; 409 `PRODUCT_CODE_EXISTS`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Only active products may be updated. This request changes data.

### 17. `DELETE /api/products/:id`

1. **Method and path:** `DELETE /api/products/:id`.
2. **Business purpose:** Deactivate a product without removing the record from the database.
3. **Authentication and authorization:** Bearer; MANAGER only.
4. **Request parameters/body:** Path `id` required: positive bigint; no body.

   **Executed Postman request:**

   ```http
   DELETE {{baseUrl}}/api/products/31
   ```

   Request body: none.

5. **Successful status and response:** 200; product row after update (`is_active = false`).

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "product_id": "31",
  "product_name": "BT3 Postman Demo Product - Updated",
  "is_active": false
}
   ```

   The response confirms soft deletion (`is_active: false`).

   **Postman screenshot:** [BT3-API-17.png](../API/BT3-API-17.png) (17 November 2026).

6. **Error statuses for this implementation:** 400 `INVALID_PRODUCT_ID`; 401 `UNAUTHENTICATED`; 403 `FORBIDDEN`; 404 `PRODUCT_NOT_FOUND`; 500 `INTERNAL_SERVER_ERROR`.
7. **Special behavior / known limits:** Soft delete sets `is_active` to false; subsequent GET queries hide the product. This request changes data.

### 18. `GET /health`

1. **Method and path:** `GET /health`.
2. **Business purpose:** Check API availability and PostgreSQL connectivity.
3. **Authentication and authorization:** Public; no bearer token.
4. **Request parameters/body:** No body or query parameters.

   **Executed Postman request:**

   ```http
   GET {{baseUrl}}/health
   ```

   Request body: none.

5. **Successful status and response:** 200; response: `{"status":"ok","database":"connected"}`.

   **Observed HTTP `200` response — transcribed fields from the screenshot:**

   ```json
{
  "status": "ok",
  "database": "connected"
}
   ```

   **Postman screenshot:** [BT3-API-18.png](../API/BT3-API-18.png) (17 November 2026).

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

