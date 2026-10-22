import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { getBouquetImageStore } from "@/lib/blob";

export const runtime = "nodejs";

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

    const extension = extname(file.name)
      .toLowerCase()
      .replace(/[^.a-z0-9]/g, "");

    const key = `${randomUUID()}${extension}`;

    const store = getBouquetImageStore();

    await store.set(key, file, {
      metadata: {
        contentType: file.type,
        originalName: file.name
      }
    });

    return NextResponse.json({
      url: `/api/images/${key}`,
      pathname: key
    });
  } catch (error) {
    console.error("Image upload failed:", error);

    return NextResponse.json(
      { error: "Nepavyko įkelti nuotraukos." },
      { status: 500 }
    );
  }
}