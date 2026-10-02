# ASD Bucketlist — Products API

A simple RESTful Products API built with **Express.js**, demonstrating **layered architecture** and **TTL-based in-memory caching**. Built as a college assignment for the ASD module.

---

## Folder Structure

```
asd-bucketlist/
├── app.js                          # Express app setup (middleware, routes, error handlers)
├── server.js                       # HTTP server — listens on port 3000
├── package.json
│
├── routes/
│   └── product.routes.js           # Maps HTTP method + path → middleware + controller
│
├── middleware/
│   ├── cache.middleware.js          # Cache HIT/MISS logic for GET routes
│   ├── invalidate.middleware.js     # Clears cache on successful write operations
│   └── error.middleware.js          # 404 fallback + centralized error handler
│
├── controllers/
│   └── product.controller.js       # Handles req/res, calls services (no business logic)
│
├── services/
│   ├── product.service.js           # Business logic layer — calls the database
│   └── cache.service.js             # TTL-based in-memory cache (Map + createdAt)
│
├── database/
│   └── products.db.js               # In-memory data store with simulated 300ms latency
│
└── docs/
    └── screenshots/                 # Place your screenshots here
```

---

## Request Flow

Every request follows this strict layered flow:

```
Client
  │
  ▼
Route  (product.routes.js)
  │  maps HTTP method + path to middleware + controller
  ▼
Middleware  (cache / invalidation / error)
  │  cache HIT → returns early
  │  cache MISS → calls next()
  ▼
Controller  (product.controller.js)
  │  handles req/res, delegates to service
  ▼
Service  (product.service.js)
  │  business logic, calls database
  ▼
Database  (products.db.js)
  │  in-memory array with simulated latency
  ▼
Response flows back up through the layers
```

---

## Caching & TTL

### How It Works

| Concept | Detail |
|---|---|
| **Store** | JavaScript `Map` in `services/cache.service.js` |
| **Entry format** | `{ value, createdAt: Date.now() }` |
| **TTL** | 60 000 ms (1 minute), defined as a single constant |
| **Key** | `req.originalUrl` (e.g. `/products` or `/products/3`) |

### Cache Middleware (GET routes)

1. **HIT** — entry exists and `Date.now() - createdAt ≤ TTL`:
   - Sets headers `X-Cache: HIT` and `X-Cache-Age: <seconds>`
   - Returns the cached JSON immediately (controller is never called)

2. **MISS** — entry missing or expired:
   - Sets header `X-Cache: MISS`
   - Wraps `res.json` to intercept the response
   - Only **200** responses are cached; 400 / 404 / 500 are never stored
   - Expired entries are deleted and the data is re-fetched through the full layer stack

### Cache Invalidation (write routes)

- Attached to POST, PUT, PATCH, DELETE via `middleware/invalidate.middleware.js`
- Uses `res.on('finish')` to check the status code **after** the response is sent
- **Only 2xx** responses clear the entire cache
- A failed write (e.g. DELETE of a nonexistent product → 404) does **not** clear the cache

---

## API Endpoints

| Method | Path | Description | Cache |
|---|---|---|---|
| `GET` | `/products` | List all products | Cached |
| `GET` | `/products/:id` | Get one product | Cached |
| `POST` | `/products` | Create a product | Invalidates |
| `PUT` | `/products/:id` | Full update | Invalidates |
| `PATCH` | `/products/:id` | Partial update | Invalidates |
| `DELETE` | `/products/:id` | Remove a product | Invalidates |

### Validation Rules

- **POST / PUT**: `name` (string) and `price` (number) are required
- **PATCH**: `price`, if provided, must be a number
- Unknown product ID → `404 { error: "Product not found" }`
- Invalid ID format → `400 { error: "Invalid product ID" }`

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the server
npm start        # node server.js
# or with auto-reload
npm run dev      # nodemon server.js
```

The server runs on **http://localhost:3000**.

---

## Testing with curl

### 1. Cache MISS then HIT

```bash
# First request — MISS (takes ~300ms due to simulated DB latency)
curl -i http://localhost:3000/products
# → X-Cache: MISS

# Second request — HIT (instant, served from cache)
curl -i http://localhost:3000/products
# → X-Cache: HIT, X-Cache-Age: 0
```

### 2. Per-ID Caching

```bash
# First request for product 1 — MISS
curl -i http://localhost:3000/products/1
# → X-Cache: MISS

# Second request — HIT
curl -i http://localhost:3000/products/1
# → X-Cache: HIT
```

### 3. TTL Expiration

```bash
# Request to populate cache
curl -i http://localhost:3000/products
# → X-Cache: MISS

# Wait 60 seconds (or set TTL to 5s for faster testing)...

# Request again — entry expired, refetched
curl -i http://localhost:3000/products
# → X-Cache: MISS
```

### 4. POST Invalidates Cache

```bash
# Populate cache
curl -i http://localhost:3000/products
# → X-Cache: MISS

curl -i http://localhost:3000/products
# → X-Cache: HIT

# Create a product
curl -i -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Water Bottle","price":15.99,"category":"Kitchen"}'
# → 201 Created

# Cache was cleared — next GET is a MISS
curl -i http://localhost:3000/products
# → X-Cache: MISS
```

### 5. PUT Full Update

```bash
curl -i -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Ergonomic Mouse","price":49.99,"category":"Electronics"}'
# → 200 OK

curl -i http://localhost:3000/products
# → X-Cache: MISS (cache was invalidated)
```

### 6. PATCH Partial Update

```bash
curl -i -X PATCH http://localhost:3000/products/2 \
  -H "Content-Type: application/json" \
  -d '{"price":69.99}'
# → 200 OK

curl -i http://localhost:3000/products
# → X-Cache: MISS
```

### 7. DELETE Invalidates Cache

```bash
curl -i -X DELETE http://localhost:3000/products/5
# → 200 OK, product deleted

curl -i http://localhost:3000/products
# → X-Cache: MISS
```

### 8. Failed DELETE Does NOT Invalidate Cache

```bash
# Populate cache
curl -i http://localhost:3000/products
# → X-Cache: MISS

curl -i http://localhost:3000/products
# → X-Cache: HIT

# Try to delete a nonexistent product
curl -i -X DELETE http://localhost:3000/products/999
# → 404 { "error": "Product not found" }

# Cache is still valid!
curl -i http://localhost:3000/products
# → X-Cache: HIT
```

### 9. Validation Errors

```bash
# Missing required fields
curl -i -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"category":"Test"}'
# → 400 { "error": "Name and price are required" }

# Price is not a number
curl -i -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Bad Product","price":"not-a-number"}'
# → 400 { "error": "Price must be a number" }
```

### 10. 404 Fallback

```bash
curl -i http://localhost:3000/unknown-route
# → 404 { "error": "Route GET /unknown-route not found" }
```

---

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Caching**: Manual in-memory Map with TTL
- **Dev tool**: nodemon (auto-restart on file changes)

---

## License

ISC
