-- =============================================================================
-- 001 — Initial Bloomora storefront schema
-- =============================================================================

-- Keeps every `updated_at` column current without application code.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Enumerations
-- ---------------------------------------------------------------------------
CREATE TYPE product_badge   AS ENUM ('best_seller', 'new', 'gift_idea', 'limited');
CREATE TYPE order_status    AS ENUM ('pending_payment', 'payment_confirmed', 'in_production', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_method  AS ENUM ('bank_transfer', 'easypaisa', 'jazzcash');
CREATE TYPE inquiry_status  AS ENUM ('new', 'in_review', 'quoted', 'closed');
CREATE TYPE user_role       AS ENUM ('admin', 'editor', 'customer');

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(80)  NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  tagline     VARCHAR(160) NOT NULL,
  description TEXT         NOT NULL,
  image_url   TEXT         NOT NULL,
  sort_order  INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              VARCHAR(120)  NOT NULL UNIQUE,
  name              VARCHAR(150)  NOT NULL,
  short_description VARCHAR(255)  NOT NULL,
  description       TEXT          NOT NULL,
  category_id       UUID          NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  price             NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price  NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price > price),
  badge             product_badge,
  image_url         TEXT          NOT NULL,
  gallery_urls      TEXT[]        NOT NULL DEFAULT '{}',
  materials         TEXT[]        NOT NULL DEFAULT '{}',
  dimensions        VARCHAR(120),
  care_instructions TEXT,
  stock_quantity    INTEGER       NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_featured       BOOLEAN       NOT NULL DEFAULT FALSE,
  is_customizable   BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_featured ON products (is_featured) WHERE is_featured;
CREATE INDEX idx_products_price    ON products (price);

-- Optional size tiers (Mini / Standard / Premium) that override the base price.
CREATE TABLE product_variants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name       VARCHAR(60)   NOT NULL,
  price      NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  sort_order INTEGER       NOT NULL DEFAULT 0,
  UNIQUE (product_id, name)
);

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  author_name VARCHAR(100) NOT NULL,
  city        VARCHAR(80)  NOT NULL,
  rating      SMALLINT     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT         NOT NULL,
  is_featured BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews (product_id);

-- ---------------------------------------------------------------------------
-- Orders (advance payment only)
-- ---------------------------------------------------------------------------
CREATE SEQUENCE order_number_seq START WITH 1001;

CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     VARCHAR(20)   NOT NULL UNIQUE DEFAULT ('BLM-' || nextval('order_number_seq')),
  customer_name    VARCHAR(100)  NOT NULL,
  customer_phone   VARCHAR(20)   NOT NULL,
  customer_email   VARCHAR(150),
  city             VARCHAR(80)   NOT NULL,
  address          TEXT          NOT NULL,
  notes            TEXT,
  payment_method   payment_method NOT NULL,
  status           order_status  NOT NULL DEFAULT 'pending_payment',
  subtotal         NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_fee     NUMERIC(10,2) NOT NULL CHECK (shipping_fee >= 0),
  total            NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Lets TRUNCATE ... RESTART IDENTITY reset order numbers when re-seeding.
ALTER SEQUENCE order_number_seq OWNED BY orders.order_number;

CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID          REFERENCES products(id) ON DELETE SET NULL,
  variant_id   UUID          REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name VARCHAR(150)  NOT NULL,
  variant_name VARCHAR(60),
  image_url    TEXT          NOT NULL,
  unit_price   NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity     INTEGER       NOT NULL CHECK (quantity > 0),
  line_total   NUMERIC(10,2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);

-- ---------------------------------------------------------------------------
-- Customer inquiries
-- ---------------------------------------------------------------------------
CREATE TABLE custom_order_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100)   NOT NULL,
  phone       VARCHAR(20)    NOT NULL,
  email       VARCHAR(150),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  budget      NUMERIC(10,2) CHECK (budget IS NULL OR budget > 0),
  needed_by   DATE,
  description TEXT           NOT NULL,
  status      inquiry_status NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(20),
  subject    VARCHAR(150) NOT NULL,
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Store content (everything the storefront renders comes from the database)
-- ---------------------------------------------------------------------------
CREATE TABLE store_settings (
  id                      SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name              VARCHAR(80)   NOT NULL,
  tagline                 VARCHAR(160)  NOT NULL,
  description             TEXT          NOT NULL,
  hero_title              VARCHAR(160)  NOT NULL,
  hero_subtitle           TEXT          NOT NULL,
  hero_image_url          TEXT          NOT NULL,
  announcements           TEXT[]        NOT NULL DEFAULT '{}',
  currency_code           CHAR(3)       NOT NULL DEFAULT 'PKR',
  shipping_fee            NUMERIC(10,2) NOT NULL CHECK (shipping_fee >= 0),
  free_shipping_threshold NUMERIC(10,2) NOT NULL CHECK (free_shipping_threshold >= 0),
  contact_email           VARCHAR(150)  NOT NULL,
  contact_phone           VARCHAR(20)   NOT NULL,
  whatsapp_number         VARCHAR(20)   NOT NULL,
  instagram_url           TEXT,
  facebook_url            TEXT,
  tiktok_url              TEXT,
  youtube_url             TEXT,
  updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_options (
  method         payment_method PRIMARY KEY,
  label          VARCHAR(60)  NOT NULL,
  account_title  VARCHAR(100) NOT NULL,
  account_number VARCHAR(60)  NOT NULL,
  instructions   TEXT         NOT NULL,
  sort_order     INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE store_highlights (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon        VARCHAR(8)   NOT NULL,
  title       VARCHAR(80)  NOT NULL,
  description VARCHAR(255) NOT NULL,
  sort_order  INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE content_pages (
  slug       VARCHAR(80)  PRIMARY KEY,
  title      VARCHAR(150) NOT NULL,
  summary    TEXT         NOT NULL,
  sections   JSONB        NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  role       user_role    NOT NULL DEFAULT 'customer',
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email_lower ON users (LOWER(email));

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_categories_updated_at     BEFORE UPDATE ON categories     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated_at       BEFORE UPDATE ON products       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_orders_updated_at         BEFORE UPDATE ON orders         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_store_settings_updated_at BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_content_pages_updated_at  BEFORE UPDATE ON content_pages  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_users_updated_at          BEFORE UPDATE ON users          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
