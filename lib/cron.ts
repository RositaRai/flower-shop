import { NextResponse } from "next/server";

export function checkCronSecret(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET nėra sukonfigūruotas." },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Neteisingas Cron autorizacijos raktas." },
      { status: 401 }
    );
  }

  return null;
}