import { getStore } from "@netlify/blobs";

export function getBouquetImageStore() {
  return getStore({
    name: "bouquet-images",
    region: "eu-central-1"
  });
}