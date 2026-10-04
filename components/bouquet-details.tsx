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

  // Nauja būsena – ar šiuo metu redaguojame puokštę
  const [editing, setEditing] = useState(false);

  // Redaguojamų laukų reikšmės
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  async function load() {
    const response = await fetch(`/api/bouquets/${id}`);

    if (response.ok) {
      const data = await response.json();

      setBouquet(data);

      // Užpildome redagavimo laukus
      setName(data.name);
      setDescription(data.description);
      setPrice(String(data.price));
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

  async function updateBouquet() {
    const response = await fetch(`/api/bouquets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        description,
        price: Number(price)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Nepavyko atnaujinti puokštės.");
      return;
    }

    setBouquet(data);
    setEditing(false);
    setMessage("Puokštė sėkmingai atnaujinta.");
  }

  function cancelEditing() {
    if (!bouquet) return;

    // Grąžiname senas reikšmes
    setName(bouquet.name);
    setDescription(bouquet.description);
    setPrice(String(bouquet.price));

    setEditing(false);
    setMessage("");
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="details-page">Kraunama...</main>
      </>
    );
  }

  if (!bouquet) {
    return (
      <>
        <Header />
        <main className="details-page">Puokštė nerasta.</main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="details-page">
        <Link href="/" className="back">
          ← Grįžti į puokštes
        </Link>

        <div className="details-card">

          <div className="details-image">
            {bouquet.image_url ? (
              <img src={bouquet.image_url} alt={bouquet.name} />
            ) : (
              "💐"
            )}
          </div>

          <div className="details-content">

            <p className="eyebrow">
              PUOKŠTĖ #{bouquet.id}
            </p>

            {editing ? (
              <>
                <div className="form-group">
                  <label>Pavadinimas</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Aprašymas</label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="form-group">
                  <label>Kaina</label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <h1>{bouquet.name}</h1>

                <span className={`details-status ${bouquet.status}`}>
                  {bouquet.status === "sold"
                    ? "PARDUOTA"
                    : "GALIMA PIRKTI"}
                </span>

                <p className="details-description">
                  {bouquet.description}
                </p>

                <div className="details-price">
                  {Number(bouquet.price).toFixed(2)} €
                </div>
              </>
            )}

            {bouquet.sold_at && (
              <p className="muted">
                Parduota:{" "}
                {new Date(bouquet.sold_at).toLocaleString("lt-LT")}
              </p>
            )}

            {message && (
              <div className="success">
                {message}
              </div>
            )}

            <div className="details-actions">

              {editing ? (
                <>
                  <button
                    onClick={updateBouquet}
                    className="sold-button"
                  >
                    ✓ Išsaugoti
                  </button>

                  <button
                    onClick={cancelEditing}
                    className="secondary"
                  >
                    Atšaukti
                  </button>
                </>
              ) : (
                <>
                  {bouquet.status === "available" && (
                    <button
                      onClick={markSold}
                      className="sold-button"
                    >
                      ✓ Pažymėti kaip parduotą
                    </button>
                  )}

                  <button
                    onClick={() => setEditing(true)}
                    className="secondary"
                  >
                    Redaguoti
                  </button>

                  <button
                    className="secondary"
                    onClick={deleteBouquet}
                  >
                    Ištrinti
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  );
}