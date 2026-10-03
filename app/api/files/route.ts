import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Reikia pasirinkti nuotrauką." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Galima įkelti tik nuotrauką." },
        { status: 400 }
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Nuotrauka turi būti mažesnė nei 4 MB." },
        { status: 413 }
      );
    }

    const blob = await put(`bouquets/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname
    });
  } catch {
    return NextResponse.json(
      { error: "Nepavyko įkelti nuotraukos." },
      { status: 500 }
    );
  }
}