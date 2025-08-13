import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest){
  const body = await req.json();
  const id = `bk_${Date.now()}`;
  // email confirmation (optional)
  try{
    await sendEmail(body.email, "Your Maaz Executive booking request", `Thank you for your request. Ref: ${id}. We will confirm shortly.`);
  }catch{}
  return NextResponse.json({ id, ...body });
}
