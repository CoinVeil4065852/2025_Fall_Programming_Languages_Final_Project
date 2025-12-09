# API Requirements for Health Tracker App (JSON + C++ server style)

## Authentication & profile

### POST `/register`

- Content-Type: `application/json`
- Body JSON (all fields required):

```json
{ "name": "...", "password": "...", "age": 30, "weightKg": 70, "heightM": 1.75, "gender": "male|female|other" }
```

- Success: `201 Created` returns a JWT token

```json
{ "token": "<jwt>" }
```

- Errors:
  - `400 Bad Request` — missing or invalid fields: `{ "errorMessage": "Missing or invalid fields", "details": { "field": "reason" } }`
  - `409 Conflict` — user already exists: `{ "errorMessage": "User already exists" }`

### POST `/login`

- Content-Type: `application/json`
- Body JSON: `{ "name": "...", "password": "..." }`
- Success: `200` `{ "token": "<jwt>" }`
- Errors:
  - `400 Bad Request` — missing fields: `{ "errorMessage": "Missing name or password" }`
  - `401 Unauthorized` — invalid credentials: `{ "errorMessage": "Invalid name or password" }`

### GET `/user/profile`

- Header: `Authorization: Bearer <jwt>`
- Success: returns the user profile object, for example:

```json
{ "id": "...", "name": "...", "gender": "female", "weightKg": 70, "heightM": 1.75, "age": 30 }
```

- Errors:
  - `401 Unauthorized` — missing/invalid token: `{ "errorMessage": "Missing or invalid Authorization token" }`
  - `404 Not Found` — profile not found: `{ "errorMessage": "Profile not found" }`

### GET `/user/bmi`

- Header: `Authorization: Bearer <jwt>`
- Success: `200` `{ "bmi": 22.86 }`
- Errors:
  - `401 Unauthorized` — missing/invalid token
  - `404 Not Found` — profile not found

## Waters

### POST `/waters`

- Header: `Authorization: Bearer <jwt>`
- Content-Type: `application/json`
- Body JSON (required): `{ "datetime": "2025-12-09T08:00:00Z", "amountMl": 250 }`
- Success: `201 Created` returns the created item object, for example:

```json
{ "id": "...", "datetime": "2025-12-09T08:00:00Z", "amountMl": 250 }
```

- Errors:
  - `400 Bad Request` — missing/invalid fields: `{ "errorMessage": "Missing datetime or amountMl" }`
  - `401 Unauthorized` — missing/invalid token

### GET `/waters`

- Header: `Authorization: Bearer <jwt>`
- Success: returns an array of records, for example:

```json
[ { "id":"...","datetime":"...","amountMl":123 }, ... ]
```

- Errors:
  - `401 Unauthorized` — missing/invalid token

### PATCH `/waters/{id}`

- Header: `Authorization: Bearer <jwt>`
- Content-Type: `application/json`
- Body JSON (partial allowed): `{ "datetime"?: "2025-12-09T08:00:00Z", "amountMl"?: 300 }`
- Success: returns the updated item object, for example:

```json
{ "id": "...", "datetime": "2025-12-09T08:00:00Z", "amountMl": 300 }
```

- Errors:
  - `400 Bad Request` — invalid payload
  - `401 Unauthorized` — missing/invalid token
  - `404 Not Found` — record not found

### DELETE `/waters/{id}`

- Header: `Authorization: Bearer <jwt>`
- Success: `204 No Content`
- Errors:
  - `401 Unauthorized` — missing/invalid token
  - `404 Not Found` — record not found

## Sleeps

### POST `/sleeps`

- Header: `Authorization: Bearer <jwt>`
- Content-Type: `application/json`
- Body JSON (required): `{ "datetime": "2025-12-09T23:00:00Z", "hours": 7.5 }`
- Success: `201 Created` returns the created sleep item, for example:

```json
{ "id": "...", "datetime": "...", "hours": 7.5 }
```

- Errors:
  - `400 Bad Request` — missing/invalid fields
  - `401 Unauthorized` — missing/invalid token

### GET `/sleeps`

- Header: `Authorization: Bearer <jwt>`
- Success: returns an array of sleep records, for example:

```json
[ { "id":"...","datetime":"...","hours":7.5 }, ... ]
```

- Errors:
  - `401 Unauthorized` — missing/invalid token

### PATCH `/sleeps/{id}`

- Header: `Authorization: Bearer <jwt>`
- Content-Type: `application/json`
- Body JSON (partial allowed): `{ "datetime"?: "2025-12-09T23:00:00Z", "hours"?: 8.0 }`
- Success: returns the updated sleep item, for example:

```json
{ "id": "...", "datetime": "2025-12-09T23:00:00Z", "hours": 8.0 }
```

- Errors:
  - `400 Bad Request` — invalid payload
  - `401 Unauthorized` — missing/invalid token
  - `404 Not Found` — record not found

### DELETE `/sleeps/{id}`

- Header: `Authorization: Bearer <jwt>`
- Success: `204 No Content`
- Errors:
  - `401 Unauthorized` — missing/invalid token
  - `404 Not Found` — record not found

## Activities

### POST `/activities`

- Header: `Authorization: Bearer <jwt>`
- Content-Type: `application/json`
- Body JSON (required): `{ "datetime": "2025-12-09T18:00:00Z", "minutes": 30, "intensity": "moderate" }`
- Success: `201 Created` returns the created activity item, for example:

```json
{ "id": "...", "datetime": "...", "minutes": 30, "intensity": "moderate" }
```

- Errors:
  - `400 Bad Request` — missing/invalid fields
  - `401 Unauthorized` — missing/invalid token

### GET `/activities`

- Header: `Authorization: Bearer <jwt>`
- Success: returns an array of activity records, for example:

```json
[ { "id":"...","datetime":"...","minutes":30,"intensity":"moderate" }, ... ]
```

- Errors:
  - `401 Unauthorized` — missing/invalid token

### PATCH `/activities/{id}`

- Header: `Authorization: Bearer <jwt>`
- Content-Type: `application/json`
- Body JSON (partial allowed): `{ "datetime"?: "2025-12-09T18:00:00Z", "minutes"?: 45, "intensity"?: "high" }`
- Success: returns the updated activity item, for example:

```json
{ "id": "...", "datetime": "2025-12-09T18:00:00Z", "minutes": 45, "intensity": "high" }
```

- Errors:
  - `400 Bad Request` — invalid payload
  - `401 Unauthorized` — missing/invalid token
  - `404 Not Found` — record not found

### DELETE `/activities/{id}`

- Header: `Authorization: Bearer <jwt>`
- Success: `204 No Content`
- Errors:
  - `401 Unauthorized` — missing/invalid token
  - `404 Not Found` — record not found

## Custom categories & items (per-user)

### GET `/category/list`

- Header: `Authorization: Bearer <jwt>` (required)
- Returns the list of categories for the authenticated user. Categories are scoped per-user.
- Success: `200` returns an array of category objects, for example:

```json
[
  { "id": "cat-1", "categoryName": "Eating" },
  { "id": "cat-2", "categoryName": "Meditation" }
]
```

- Errors:
  - `401 Unauthorized` — missing or invalid token

### POST `/category/create`

- Header: `Authorization: Bearer <jwt>` (required)
- Content-Type: `application/json`
- Body JSON: `{ "categoryName": "Eating" }`
- Success: `201 Created` returns the created category object, for example:

```json
{ "id": "cat-1", "categoryName": "Eating" }
```

- Errors:
  - `400 Bad Request` — missing `categoryName`
  - `401 Unauthorized` — missing or invalid token

### GET `/category/{categoryId}/list`

- Header: `Authorization: Bearer <jwt>` (required)
- Path param: `categoryId` — the id of the category belonging to the authenticated user
- Success: `200` returns an array of items in the category, for example:

```json
[{ "id": "item-1", "datetime": "2025-12-09T12:00:00Z", "note": "lunch" }]
```

- Errors:
  - `400 Bad Request` — invalid `categoryId`
  - `401 Unauthorized` — missing or invalid token
  - `404 Not Found` — category not found for this user

### POST `/category/{categoryId}/add`

- Header: `Authorization: Bearer <jwt>` (required)
- Content-Type: `application/json`
- Path param: `categoryId` — category id
- Body JSON (note is required for custom items): `{ "datetime": "2025-12-09T12:00:00Z", "note": "some details" }`
- Success: `201` returns the created item object, for example:

```json
{
  "id": "item-1",
  "categoryId": "cat-1",
  "datetime": "2025-12-09T12:00:00Z",
  "note": "some details"
}
```

- Errors:
  - `400 Bad Request` — missing/invalid fields
  - `401 Unauthorized` — missing or invalid token
  - `404 Not Found` — category not found for this user

### PATCH `/category/{categoryId}/{itemId}`

- Header: `Authorization: Bearer <jwt>` (required)
- Content-Type: `application/json`
- Path params: `categoryId`, `itemId`
- Body JSON (partial allowed): `{ "datetime"?: "2025-12-09T12:00:00Z", "note"?: "updated details" }`
- Success: `200` returns the updated item object, for example:

```json
{
  "id": "item-1",
  "categoryId": "cat-1",
  "datetime": "2025-12-09T12:00:00Z",
  "note": "updated details"
}
```

- Errors:
  - `400 Bad Request` — invalid payload
  - `401 Unauthorized` — missing or invalid token
  - `404 Not Found` — category or item not found for this user

### DELETE `/category/{categoryId}/{itemId}`

- Header: `Authorization: Bearer <jwt>` (required)
- Path params: `categoryId`, `itemId`
- Success: `204 No Content`
- Errors:
  - `401 Unauthorized` — missing or invalid token
  - `404 Not Found` — category or item not found for this user

Validation (minimal)

- `datetime`: should be valid ISO 8601 datetime strings.
- `amountMl`: number > 0.
- `hours`: number >= 0.
- `minutes`: integer > 0.
- `name`, `password`, `categoryName`: non-empty.
- `intensity`: prefer one of `low`, `moderate`, `high`.
