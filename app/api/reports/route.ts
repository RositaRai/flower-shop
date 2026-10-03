import { NextResponse } from "next/server";
import { getDailyReports } from "@/lib/flowers";

export async function GET() {
  try {
    const data = await getDailyReports();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Nepavyko gauti ataskaitų." },
      { status: 500 }
    );
  }
}