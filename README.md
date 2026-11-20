# 🌸 Bloomora — Handmade Fuzzy-Wire Flowers & Gifts

Full-stack TypeScript storefront for a handmade studio: bouquets, glow lamps, keychains, keepsakes and custom orders.
Every piece of content — products, categories, reviews, store settings, payment details, policy pages — lives in **PostgreSQL**. Nothing in the app code is a hardcoded catalogue.

- **Frontend**: Nuxt 3 · Vue 3 · strict TypeScript (SSR)
- **Backend**: Express · PostgreSQL (`pg`) · Zod · layered architecture
- **Remote**: <https://github.com/naveenjangir4733/Bloomora.git>

---

## 🚀 Quick start

**Prerequisites:** Node 20+, pnpm, PostgreSQL 14+ running locally (or `docker compose up -d`).

```bash
# 1. Configure the database connection
cp backend/.env.example backend/.env          # then set your Postgres password
cp frontend/.env.example frontend/.env

# 2. Install
pnpm --dir backend install
pnpm --dir frontend install

# 3. Create the database, apply migrations and load demo data
pnpm --dir backend db:setup

# 4. Run (two terminals)
pnpm --dir backend dev      # http://localhost:5000/api/v1
pnpm --dir frontend dev     # http://localhost:3000
```

`db:setup` creates the `bloomora_db` database automatically if it does not exist.

| Script (backend)  | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `db:migrate`      | Creates the DB if missing and applies pending `db/migrations/*.sql` |
| `db:seed`         | Truncates demo tables and reloads seed data (refuses in production) |
| `db:setup`        | `db:migrate` + `db:seed`                                            |
| `db:reset`        | Drops the schema, re-migrates and re-seeds (development only)       |

### Environment (`backend/.env`)

`DATABASE_URL` wins when set; otherwise `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` and `DB_NAME` are used.
URL-encode special characters in the password inside `DATABASE_URL`.

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/bloomora_db
CORS_ORIGIN=http://localhost:3000
```

---

## 🧭 Features

- Home: hero, live stats (from DB), highlights, shop-by-category, favourites, testimonials, custom-order CTA
- Shop with search, category filter, sort, in-stock filter and pagination — all synced to the URL
- Collection pages (`/collections/:slug`) and product pages with gallery, **Mini / Standard / Premium** sizes, reviews and related items
- Persistent cart drawer with a free-delivery progress meter
- Checkout with advance payment (Bank / Easypaisa / JazzCash). **Prices, delivery and stock are recalculated on the server** inside a transaction
- Order confirmation with payment instructions, plus order tracking by order number + phone
- Custom-order requests, contact form, and CMS-style policy pages (`/about`, `/shipping-delivery`, …)

---

## 📁 Structure

```
backend/src/
├── config/          env.config.ts — Zod-validated environment
├── constants/       HTTP status codes
├── container.ts     Composition root: repositories → services → controllers
├── controllers/     HTTP boundary only (read validated input, call service, send envelope)
├── db/
│   ├── migrations/  Versioned SQL (001_initial_schema.sql)
│   ├── seeds/data/  Typed demo data (categories, products, reviews, store, pages)
│   ├── migrate.ts · seed.ts · postgres.ts · sql-builder.ts
├── middlewares/     validateRequest (Zod), error + 404 handler, logger
├── repositories/    All SQL lives here — parameterised queries, row → domain mapping
├── routes/          api.router.ts — every endpoint and its validation in one place
├── services/        Business rules (pricing, stock, shipping) — no Express imports
├── types/           Domain models and API envelopes
├── utils/           ApiResponse, AppError, asyncHandler, pagination
└── validators/      Zod schemas + inferred DTO types

frontend/
├── components/
│   ├── common/      Primitives: AppButton, AppInput, AppPrice, AppRating, AppHeader, AppFooter…
│   └── features/    Domain UI grouped by area: product/, catalog/, cart/, checkout/, order/, inquiry/, home/…
├── composables/     useApiClient, useCatalog, useStoreConfig, useCart, useOrders, useAsyncAction
├── pages/           index, shop, collections/[slug], products/[slug], checkout, order/[orderNumber],
│                    track-order, custom-orders, reviews, contact, [slug] (content pages)
├── plugins/         cart-persistence.client.ts (validated localStorage sync)
├── types/           API contract types (mirror the backend)
└── utils/           format, labels (exhaustive enum maps), api-error, route helpers
```

## 🔌 API (`/api/v1`)

| Method | Path                     | Notes                                                         |
| ------ | ------------------------ | ------------------------------------------------------------- |
| GET    | `/health`                | Includes DB connectivity (503 if unreachable)                 |
| GET    | `/store`                 | Settings, payment options, highlights, live stats             |
| GET    | `/categories[/:slug]`    | With product counts                                           |
| GET    | `/products`              | `search, category, featured, badge, minPrice, maxPrice, inStock, sort, page, limit` |
| GET    | `/products/:slug`        | Variants, reviews, related products                           |
| GET    | `/reviews`               | `featured, limit`                                             |
| POST   | `/orders`                | Server-side pricing + atomic stock decrement                  |
| GET    | `/orders/:number?phone=` | Order tracking                                                |
| POST   | `/custom-orders`         | Custom order request                                          |
| POST   | `/contact`               | Contact message                                               |
| GET    | `/pages[/:slug]`         | Content pages                                                 |
| CRUD   | `/users[/:id]`           | GET / POST / PATCH / DELETE                                   |

Responses: `{ success: true, data, message?, meta?, timestamp }` or `{ success: false, error: { message, code, details? }, timestamp }`.

---

## ✅ Quality gates

- `strict` TypeScript everywhere, no `any`, explicit return types (enforced by ESLint), `@/*` imports only
- `pnpm lint` runs with `--max-warnings 0`
- Husky **pre-commit**: lint + typecheck both apps · **pre-push**: typecheck + build both apps + SonarQube (if available)
