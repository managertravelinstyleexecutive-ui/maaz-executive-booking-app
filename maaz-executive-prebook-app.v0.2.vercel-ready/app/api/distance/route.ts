import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
  try{
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    if(!origin || !destination) return NextResponse.json({ error: "Missing origin/destination" }, { status: 400 });
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if(!key) return NextResponse.json({ error: "Missing GOOGLE_MAPS_API_KEY" }, { status: 500 });
    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    url.searchParams.set("origins", origin);
    url.searchParams.set("destinations", destination);
    url.searchParams.set("units", "imperial");
    url.searchParams.set("key", key);
    const resp = await fetch(url.toString());
    const data = await resp.json();
    const element = data?.rows?.[0]?.elements?.[0];
    if(!element || element.status !== "OK") throw new Error("No distance");
    const milesText = element.distance.text; // e.g., "18.2 mi"
    const miles = Number(String(milesText).replace(/[^0-9.]/g, ""));
    return NextResponse.json({ miles });
  }catch(e:any){
    return NextResponse.json({ error: e?.message || "Distance error" }, { status: 500 });
  }
}
