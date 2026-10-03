CREATE TABLE IF NOT EXISTS bouquets (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  image_name TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'sold')),
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_sales_reports (
  id BIGSERIAL PRIMARY KEY,
  report_date DATE NOT NULL UNIQUE,
  bouquets_sold INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bouquets_status ON bouquets(status);
CREATE INDEX IF NOT EXISTS idx_bouquets_sold_at ON bouquets(sold_at DESC);
CREATE INDEX IF NOT EXISTS idx_bouquets_created_at ON bouquets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_sales_reports(report_date DESC);