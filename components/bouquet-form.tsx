"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

export function BouquetForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      let imageUrl: string | null = null;
      let imageName: string | null = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const upload = await fetch("/api/files", {
          method: "POST",
          body: formData
        });

        const uploadData = await upload.json();

        if (!upload.ok) throw new Error(uploadData.error);
        imageUrl = uploadData.url;
        imageName = file.name;
      }

      const response = await fetch("/api/bouquets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price,
          imageUrl,
          imageName
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      router.push(`/bouquets/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepavyko išsaugoti.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <main className="form-page">
        <div className="form-card">
          <p className="eyebrow">KATALOGAS</p>
          <h1>Pridėti naują puokštę</h1>
          <p className="muted">Įveskite puokštės informaciją ir pridėkite jos nuotrauką.</p>

          <form onSubmit={submit} className="flower-form">
            <label>
              Puokštės pavadinimas
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
              Aprašymas
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </label>

            <label>
              Kaina (€)
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <label>
              Puokštės nuotrauka
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <small>Nuotrauka turi būti iki 4 MB.</small>
            </label>

            {error && <div className="error">{error}</div>}

            <div className="form-actions">
              <button disabled={saving}>
                {saving ? "Saugoma..." : "Sukurti puokštę"}
              </button>
              <button type="button" className="secondary" onClick={() => router.back()}>
                Atšaukti
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}