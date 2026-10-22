# 🌸 Žiedai – flower shop

Universitetinei užduočiai skirta web aplikacija.

## Užduoties reikalavimų įgyvendinimas

### 1. PaaS

Aplikacija deployinama į Netlify (Next.js adapteris parenkamas automatiškai).

### Paleidimas ir Netlify konfigūracija

- Naudokite Node.js 22.12 arba naujesnę versiją.
- Priklausomybes įdiekite su `npm ci`, build patikrinkite su `npm run build`.
- Netlify projekto aplinkos kintamuosiuose nustatykite `NETLIFY_DB_URL`
  (Neon PostgreSQL jungties eilutę) ir `CRON_SECRET`; jie turi būti prieinami Functions.
- `netlify.toml` nustato build komandą, `.next` publikavimo katalogą ir Node.js 22.
- Netlify Blobs prisijungimo duomenis pateikia automatiškai. `BLOB_READ_WRITE_TOKEN`
  yra Vercel kintamasis ir nebenaudojamas. Vietiniam darbui su nuotraukomis
  naudokite Netlify Dev (`netlify dev`); paprastas `npm run dev` Blobs konteksto nesuteikia.

### 2. CRUD + list

Puokščių CRUD:

- Create – sukurti naują puokštę
- Read – peržiūrėti puokštę ir visą sąrašą
- Update – pažymėti kaip parduotą / keisti duomenis per API
- Delete – ištrinti puokštę
- List – pagrindiniame puslapyje rodomos visos puokštės

### 3. Web application

Pagrindinis puslapis sukurtas pagal pateiktą „Žiedai“ HTML dizaino kryptį:

- rožinė spalvų paletė
- „Daugiau nei gėlės – daugiau jausmų“
- puokščių kortelės
- naujos puokštės mygtukas
- puokštės detalės puslapis
- pardavimo veiksmas
- pardavimų ataskaitų langas

### 4. Public API

REST API:

```text
GET    /api/bouquets
POST   /api/bouquets
GET    /api/bouquets/:id
PATCH  /api/bouquets/:id
DELETE /api/bouquets/:id
POST   /api/bouquets/:id/sold

POST   /api/files
GET    /api/reports

GET    /api/cron/daily-report
```

## 5. Persistence

### PostgreSQL

Naudojamas Neon PostgreSQL.

`bouquets` lentelėje saugoma:

- pavadinimas
- aprašymas
- kaina
- nuotraukos URL
- statusas
- pardavimo laikas
- sukūrimo / atnaujinimo laikas

`daily_sales_reports` lentelėje saugoma:

- data
- parduotų puokščių kiekis
- pajamos

### File storage

Naujos puokščių nuotraukos saugomos Netlify Blobs, `bouquet-images` saugykloje,
`eu-central-1` regione.

Duomenų bazėje išsaugomas nuotraukos API URL (`/api/images/:key`).
Anksčiau į Vercel Blob įkeltos nuotraukos automatiškai neperkeliamos.

## 6. Background task

`vercel.json` aprašytas Vercel Cron į Netlify automatiškai neperkeliamas.
Netlify aplinkoje reikia atskirai sukonfigūruoti kasdienį užduoties paleidimą,
kuris su antrašte `Authorization: Bearer <CRON_SECRET>` iškviestų:

```text
GET /api/cron/daily-report
```

Jobas apskaičiuoja **ankstesnės dienos**:

```text
kiek parduota puokščių
+
kiek gauta pajamų
```

ir įrašo rezultatą į:

```text
daily_sales_reports
```

Pavyzdys:

```text
2026-10-01    3 puokštės    300.00 €
2026-10-02    5 puokštės    420.00 €
2026-10-03    2 puokštės    150.00 €
```

Ataskaita pasiekiama:

```text
/reports
```

## 7. Architecture

```mermaid
flowchart LR
    U[Customer / Admin Browser] -->|HTTPS| V[Netlify]

    V --> UI[Next.js Web Application]
    V --> API[Next.js REST API]

    API --> DB[(Neon PostgreSQL)]
    API --> B[Netlify Blobs]

    C[Daily scheduler - configure separately] -->|GET /api/cron/daily-report| JOB[Background Job]
    JOB --> DB

    DB --> R[Daily Sales Reports]
    UI --> R
```
