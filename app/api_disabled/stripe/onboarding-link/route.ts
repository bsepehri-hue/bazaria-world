import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ url: "https://onboarding.mock/acct_mock" });
}
