import { NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/cron";
import { createDailyReport } from "@/lib/flowers";

export async function GET(request: Request) {
  const authError = checkCronSecret(request);
  if (authError) return authError;

  try {
    const report = await createDailyReport();

    return NextResponse.json({
      success: true,
      report,
      executedAt: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      { error: "Nepavyko sugeneruoti dienos ataskaitos." },
      { status: 500 }
    );
  }
}