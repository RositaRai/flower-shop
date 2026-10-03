"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";

type Bouquet = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  image_url: string | null;
  status: "available" | "sold";
};

export function FlowerShop() {
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBouquets() {
    const response = await fetch("/api/bouquets");
    const data = await response.json();
    setBouquets(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadBouquets();
  }, []);

  return (
    <>
      <Header />

      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">GĖLĖS KIEKVIENAI PROGAI</p>
          <h1>
            Daugiau nei gėlės – <span>daugiau jausmų</span>
          </h1>
          <p>
            Šviežios gėlės, kurios sukuria ypatingas akimirkas.
            Nustebinkite artimuosius ir padovanokite šypseną.
          </p>
          <a className="button" href="#bouquets">Rinktis puokštę →</a>
        </div>

        <div className="flower-image">🌷🌸🌹</div>
      </section>

      <section className="features">
        <div><span>🌿</span><h3>Šviežios gėlės</h3><p>Tiesiai iš augintojų</p></div>
        <div><span>🚚</span><h3>Greitas pristatymas</h3><p>Visoje Lietuvoje</p></div>
        <div><span>♡</span><h3>Kiekvienai progai</h3><p>Meilei, šventei, dovanai</p></div>
        <div><span>🎁</span><h3>Gražus įpakavimas</h3><p>Su meile detalėms</p></div>
      </section>

      <section className="bouquets" id="bouquets">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MŪSŲ PUOKŠTĖS</p>
            <h2>Puokščių katalogas</h2>
          </div>
          <Link className="button small" href="/bouquets/new">+ Pridėti naują</Link>
        </div>

        {loading ? (
          <p className="center">Kraunama...</p>
        ) : bouquets.length === 0 ? (
          <div className="empty">
            <h3>Kol kas nėra puokščių</h3>
            <p>Pridėk pirmą puokštę į katalogą.</p>
            <Link className="button" href="/bouquets/new">Pridėti puokštę</Link>
          </div>
        ) : (
          <div className="cards">
            {bouquets.map((bouquet) => (
              <Link
                href={`/bouquets/${bouquet.id}`}
                className={`card ${bouquet.status === "sold" ? "sold-card" : ""}`}
                key={bouquet.id}
              >
                <div className="card-image">
                  {bouquet.image_url ? (
                    <img src={bouquet.image_url} alt={bouquet.name} />
                  ) : (
                    "💐"
                  )}
                  {bouquet.status === "sold" && <span className="sold-badge">PARDUOTA</span>}
                </div>
                <div className="card-content">
                  <h3>{bouquet.name}</h3>
                  <p>{bouquet.description}</p>
                  <span className="price">{Number(bouquet.price).toFixed(2)} €</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer>© 2026 Žiedai · Gėlės su meile 🌸</footer>
    </>
  );
}