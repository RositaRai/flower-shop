export function validateBouquet(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const price = Number(body.price);

  if (!name) return "Pavadinimas yra privalomas.";
  if (name.length > 200) return "Pavadinimas negali būti ilgesnis nei 200 simbolių.";
  if (!description) return "Aprašymas yra privalomas.";
  if (!Number.isFinite(price) || price < 0) return "Kaina turi būti teigiamas skaičius.";

  return null;
}