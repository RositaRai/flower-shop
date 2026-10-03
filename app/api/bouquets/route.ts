import { NextResponse } from "next/server";
import { createBouquet, getBouquets } from "@/lib/flowers";
import { validateBouquet } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const data = await getBouquets(status);

    return NextResponse.json({ data, count: data.length });
  } catch {
    return NextResponse.json(
      { error: "Nepavyko gauti puokščių." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationError = validateBouquet(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const bouquet = await createBouquet({
      name: body.name.trim(),
      description: body.description.trim(),
      price: Number(body.price),
      imageUrl: body.imageUrl ?? null,
      imageName: body.imageName ?? null
    });

    return NextResponse.json(bouquet, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Nepavyko sukurti puokštės." },
      { status: 500 }
    );
  }
}