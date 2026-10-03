"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";

type Bouquet = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  image_url: string | null;
  image_name: string | null;
  status: "available" | "sold";
  sold_at: string | null;
};

export function BouquetDetails({ id }: { id: string }) {
  const router = useRouter();
  const [bouquet, setBouquet] = useState<Bouquet | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch(`/api/bouquets/${id}`);
    if (response.ok) {
      setBouquet(await response.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function markSold() {
    const response = await fetch(`/api/bouquets/${id}/sold`, {
      method: "POST"
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Nepavyko pažymėti kaip parduotos.");
      return;
    }

    setBouquet(data);
    setMessage("Puokštė pažymėta kaip parduota.");
  }

  async function deleteBouquet() {
    if (!confirm("Ar tikrai ištrinti šią puokštę?")) return;

    const response = await fetch(`/api/bouquets/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      router.push("/");
    }
  }

  if (loading) return <><Header /><main className="details-page">Kraunama...</main></>;
  if (!bouquet) return <><Header /><main className="details-page">Puokštė nerasta.</main></>;

  return (
    <>
      <Header />
      <main className="details-page">
        <Link href="/" className="back">← Grįžti į puokštes</Link>

        <div className="details-card">
          <div className="details-image">
            {bouquet.image_url ? (
              <img src={bouquet.image_url} alt={bouquet.name} />
            ) : (
              "💐"
            )}
          </div>

          <div className="details-content">
            <p className="eyebrow">PUOKŠTĖ #{bouquet.id}</p>
            <h1>{bouquet.name}</h1>
            <span className={`details-status ${bouquet.status}`}>
              {bouquet.status === "sold" ? "PARDUOTA" : "GALIMA PIRKTI"}
            </span>

            <p className="details-description">{bouquet.description}</p>
            <div className="details-price">{Number(bouquet.price).toFixed(2)} €</div>

            {bouquet.sold_at && (
              <p className="muted">
                Parduota: {new Date(bouquet.sold_at).toLocaleString("lt-LT")}
              </p>
            )}

            {message && <div className="success">{message}</div>}

            <div className="details-actions">
              {bouquet.status === "available" && (
                <button onClick={markSold} className="sold-button">
                  ✓ Pažymėti kaip parduotą
                </button>
              )}

              <button className="secondary" onClick={deleteBouquet}>
                Ištrinti
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}