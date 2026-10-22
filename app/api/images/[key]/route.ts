import { getBouquetImageStore } from "@/lib/blob";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  try {
    const store = getBouquetImageStore();

    const result = await store.getWithMetadata(key, {
      type: "arrayBuffer"
    });

    if (!result) {
      return new Response("Nuotrauka nerasta", {
        status: 404
      });
    }

    const contentType =
      typeof result.metadata.contentType === "string"
        ? result.metadata.contentType
        : "application/octet-stream";

    return new Response(new Uint8Array(result.data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Image read failed:", error);

    return new Response("Nepavyko nuskaityti nuotraukos", {
      status: 500
    });
  }
}