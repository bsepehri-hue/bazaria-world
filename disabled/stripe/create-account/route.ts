import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ id: "acct_mock", status: "created" });
}
