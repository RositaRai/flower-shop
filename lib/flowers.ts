import { sql } from "@/lib/db";

export type BouquetStatus = "available" | "sold";

export async function getBouquets(status?: string) {
  if (status) {
    return sql`
      SELECT *
      FROM bouquets
      WHERE status = ${status}
      ORDER BY created_at DESC
    `;
  }

  return sql`
    SELECT *
    FROM bouquets
    ORDER BY created_at DESC
  `;
}

export async function getBouquet(id: number) {
  const rows = await sql`
    SELECT *
    FROM bouquets
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function createBouquet(input: {
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  imageName?: string | null;
}) {
  const rows = await sql`
    INSERT INTO bouquets (
      name,
      description,
      price,
      image_url,
      image_name
    )
    VALUES (
      ${input.name},
      ${input.description},
      ${input.price},
      ${input.imageUrl ?? null},
      ${input.imageName ?? null}
    )
    RETURNING *
  `;

  return rows[0];
}

export async function updateBouquet(
  id: number,
  input: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string | null;
    imageName?: string | null;
    status?: BouquetStatus;
    soldAt?: string | null;
  }
) {
  const current = await getBouquet(id);

  if (!current) return null;

  const rows = await sql`
    UPDATE bouquets
    SET
      name = ${input.name ?? current.name},
      description = ${input.description ?? current.description},
      price = ${input.price ?? current.price},
      image_url = ${input.imageUrl === undefined ? current.image_url : input.imageUrl},
      image_name = ${input.imageName === undefined ? current.image_name : input.imageName},
      status = ${input.status ?? current.status},
      sold_at = ${input.soldAt === undefined ? current.sold_at : input.soldAt},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return rows[0] ?? null;
}

export async function markBouquetSold(id: number) {
  const rows = await sql`
    UPDATE bouquets
    SET
      status = 'sold',
      sold_at = NOW(),
      updated_at = NOW()
    WHERE id = ${id}
      AND status = 'available'
    RETURNING *
  `;

  return rows[0] ?? null;
}

export async function deleteBouquet(id: number) {
  const rows = await sql`
    DELETE FROM bouquets
    WHERE id = ${id}
    RETURNING id
  `;

  return rows.length > 0;
}

/*
 * The report is calculated for the previous calendar day.
 * This means that the 17:00 job creates yesterday's final report.
 *
 * The database uses UTC timestamps. The report date is calculated
 * using the Europe/Vilnius calendar date in the application.
 */
export async function createDailyReport() {
  const rows = await sql`
    INSERT INTO daily_sales_reports (
      report_date,
      bouquets_sold,
      revenue
    )
    SELECT
      ((NOW() AT TIME ZONE 'Europe/Vilnius')::date - INTERVAL '1 day')::date,
      COUNT(*)::integer,
      COALESCE(SUM(price), 0)
    FROM bouquets
    WHERE status = 'sold'
      AND (sold_at AT TIME ZONE 'Europe/Vilnius')::date =
          ((NOW() AT TIME ZONE 'Europe/Vilnius')::date - INTERVAL '1 day')::date
    ON CONFLICT (report_date)
    DO UPDATE SET
      bouquets_sold = EXCLUDED.bouquets_sold,
      revenue = EXCLUDED.revenue
    RETURNING *
  `;

  return rows[0];
}

export async function getDailyReports() {
  return sql`
    SELECT
      id,
      report_date,
      bouquets_sold,
      revenue,
      created_at
    FROM daily_sales_reports
    ORDER BY report_date DESC
  `;
}