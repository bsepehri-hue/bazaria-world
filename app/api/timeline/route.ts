import { NextResponse } from "next/server";
import { getUnifiedTimeline } from "@/app/actions/timeline";



export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;

    const events = await getUnifiedTimeline(cursor);

    return NextResponse.json(events);
  } catch (err) {
    console.error("Error fetching timeline:", err);
    return NextResponse.json({ error: "Failed to load timeline" }, { status: 500 });
  }
}
