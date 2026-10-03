import { NextResponse } from "next/server";
import { deleteBouquet, getBouquet, updateBouquet } from "@/lib/flowers";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (!id) return NextResponse.json({ error: "Neteisingas ID." }, { status: 400 });

  const bouquet = await getBouquet(id);

  if (!bouquet) {
    return NextResponse.json({ error: "Puokštė nerasta." }, { status: 404 });
  }

  return NextResponse.json(bouquet);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (!id) return NextResponse.json({ error: "Neteisingas ID." }, { status: 400 });

  const body = await request.json();
  const bouquet = await updateBouquet(id, body);

  if (!bouquet) {
    return NextResponse.json({ error: "Puokštė nerasta." }, { status: 404 });
  }

  return NextResponse.json(bouquet);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (!id) return NextResponse.json({ error: "Neteisingas ID." }, { status: 400 });

  const deleted = await deleteBouquet(id);

  if (!deleted) {
    return NextResponse.json({ error: "Puokštė nerasta." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}