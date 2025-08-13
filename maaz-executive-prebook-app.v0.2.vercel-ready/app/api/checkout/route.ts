import { NextRequest, NextResponse } from "next/server";
import { createHostedCheckout } from "@/lib/sumup";

export async function POST(req: NextRequest){
  const formData = await req.formData();
  const amount = Number(formData.get("amount") || 0);
  const currency = (formData.get("currency") || "GBP").toString();
  const merchant_code = process.env.SUMUP_MERCHANT_CODE!;
  if(!merchant_code) return NextResponse.json({ error: "Missing SUMUP_MERCHANT_CODE" }, { status: 400 });
  if(!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  const ref = `bk_${Date.now()}`;
  const checkout = await createHostedCheckout({ amount, currency, description: "Maaz Executive booking deposit", checkout_reference: ref, merchant_code });
  const url = checkout.hosted_checkout_url;
  if(!url) return NextResponse.json({ error: "No hosted checkout url" }, { status: 500 });
  return NextResponse.redirect(url);
}
