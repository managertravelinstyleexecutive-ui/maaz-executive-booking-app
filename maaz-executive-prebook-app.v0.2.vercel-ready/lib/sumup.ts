export async function getAccessToken(){
  const clientId = process.env.SUMUP_CLIENT_ID!;
  const clientSecret = process.env.SUMUP_CLIENT_SECRET!;
  if(!clientId || !clientSecret) throw new Error("Missing SumUp credentials");
  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const resp = await fetch("https://api.sumup.com/token", {
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded", "Authorization":"Basic "+Buffer.from(clientId+":"+clientSecret).toString("base64") },
    body
  });
  if(!resp.ok) throw new Error("Token error");
  return resp.json() as Promise<{ access_token:string }>;
}

export async function createHostedCheckout({ amount, currency, description, checkout_reference, merchant_code }:{ amount:number; currency:string; description:string; checkout_reference:string; merchant_code:string; }){
  const { access_token } = await getAccessToken();
  const resp = await fetch("https://api.sumup.com/v0.1/checkouts", {
    method:"POST",
    headers:{ "Authorization":`Bearer ${access_token}`, "Content-Type":"application/json" },
    body: JSON.stringify({ amount, currency, description, checkout_reference, merchant_code, hosted_checkout: { enabled: true } })
  });
  const data = await resp.json();
  if(!resp.ok) throw new Error("Checkout error: "+JSON.stringify(data));
  return data as any;
}
