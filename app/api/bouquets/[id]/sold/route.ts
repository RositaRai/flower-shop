import { NextResponse } from "next/server";
import { markBouquetSold } from "@/lib/flowers";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Neteisingas ID." }, { status: 400 });
  }

  const bouquet = await markBouquetSold(id);

  if (!bouquet) {
    return NextResponse.json(
      { error: "Puokštė nerasta arba jau parduota." },
      { status: 409 }
    );
  }

  return NextResponse.json(bouquet);
}