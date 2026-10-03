import { BouquetDetails } from "@/components/bouquet-details";

export default async function BouquetPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BouquetDetails id={id} />;
}