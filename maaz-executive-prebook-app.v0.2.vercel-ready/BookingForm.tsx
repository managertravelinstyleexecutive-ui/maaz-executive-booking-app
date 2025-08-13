"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Plane, MapPin, Phone, Mail, User, Luggage, Car } from "lucide-react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { estimateFareAdvanced } from "@/lib/tariff";

const currency = (n:number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "GBP" }).format(n);

export default function BookingForm(){
  const [form, setForm] = useState({ name:"", phone:"", email:"", pickup:"", dropoff:"", date:"", time:"", miles:"", passengers:1, luggage:0, vehicle:"business" as "business"|"suv"|"first", notes:"", isAirportPickup:false, flightNumber:"", buffer:"30" });
  const [quote, setQuote] = useState<number|null>(null);
  const [submitted, setSubmitted] = useState<any|null>(null);
  const [loading, setLoading] = useState(false);

  const canEstimate = useMemo(()=> !!form.pickup && !!form.dropoff && !!form.date && !!form.time, [form]);
  const onChange = (k: keyof typeof form, v: any)=> setForm(p=>({ ...p, [k]: v }));

  // Auto distance via Google Maps proxy
  useEffect(()=>{
    const fetchMiles = async ()=>{
      if(!form.pickup || !form.dropoff) return;
      try{
        const q = new URLSearchParams({ origin: form.pickup, destination: form.dropoff }).toString();
        const res = await fetch(`/api/distance?${q}`);
        const j = await res.json();
        if(j?.miles){ onChange("miles", String(j.miles)); }
      }catch{ /* ignore */ }
    };
    fetchMiles();
  }, [form.pickup, form.dropoff]);

  const doEstimate = ()=>{
    const q = estimateFareAdvanced({ miles: Number(form.miles||0), vehicle: form.vehicle, isAirportPickup: form.isAirportPickup && !!form.flightNumber, dropoffText: form.dropoff });
    setQuote(q);
  };

  const submit = async ()=>{
    setLoading(true);
    try{
      const res = await fetch("/api/bookings", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ ...form, quote }) });
      if(!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSubmitted(data);
    }catch(e){ alert("Could not submit booking. Please try again."); }
    finally{ setLoading(false); }
  };

  return (
    <div className="grid md:grid-cols-5 gap-4">
      <div className="md:col-span-3 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><Label><User size={14}/> Full name</Label><Input value={form.name} onChange={e=>onChange("name", e.target.value)} placeholder="Your name"/></div>
          <div><Label><Phone size={14}/> Phone</Label><Input value={form.phone} onChange={e=>onChange("phone", e.target.value)} placeholder="+44 ..."/></div>
          <div><Label><Mail size={14}/> Email</Label><Input type="email" value={form.email} onChange={e=>onChange("email", e.target.value)} placeholder="name@example.com"/></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label><MapPin size={14}/> Pickup</Label><Input value={form.pickup} onChange={e=>onChange("pickup", e.target.value)} placeholder="10 Downing St, London"/></div>
          <div><Label><MapPin size={14}/> Drop-off</Label><Input value={form.dropoff} onChange={e=>onChange("dropoff", e.target.value)} placeholder="Heathrow T3"/></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><Label><Calendar size={14}/> Date</Label><Input type="date" value={form.date} onChange={e=>onChange("date", e.target.value)}/></div>
          <div><Label><Clock size={14}/> Time</Label><Input type="time" value={form.time} onChange={e=>onChange("time", e.target.value)}/></div>
          <div><Label><Car size={14}/> Distance (mi)</Label><Input inputMode="decimal" value={form.miles} onChange={e=>onChange("miles", e.target.value.replace(/[^0-9.]/g, ""))} placeholder="auto-calculated"/></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><Label>Passengers</Label><Input inputMode="numeric" value={form.passengers} onChange={e=>onChange("passengers", Number(e.target.value.replace(/\D/g, ""))||1)} /></div>
          <div><Label>Luggage</Label><Input inputMode="numeric" value={form.luggage} onChange={e=>onChange("luggage", Number(e.target.value.replace(/\D/g, ""))||0)} /></div>
          <div><Label>Vehicle</Label>
            <select className="w-full rounded-xl border px-3 py-2 text-sm" value={form.vehicle} onChange={e=>onChange("vehicle", e.target.value as any)}>
              <option value="business">Business Class</option>
              <option value="suv">SUV / VAN Class</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border p-3">
          <div className="text-sm">
            <div className="font-medium flex items-center gap-2"><Plane size={14}/> Airport pickup</div>
            <div className="text-xs text-slate-500">Add flight + buffer so we greet at the right time. (+£12 pickup surcharge)</div>
          </div>
          <input type="checkbox" checked={form.isAirportPickup} onChange={e=>onChange("isAirportPickup", e.target.checked)} />
        </div>
        <AnimatePresence>
          {form.isAirportPickup && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><Label>Flight number</Label><Input value={form.flightNumber} onChange={e=>onChange("flightNumber", e.target.value.toUpperCase())} placeholder="BA0159"/></div>
              <div><Label>Buffer (min)</Label><select className="w-full rounded-xl border px-3 py-2 text-sm" value={form.buffer} onChange={e=>onChange("buffer", e.target.value)}>
                {["0","15","30","45","60"].map(v=> <option key={v} value={v}>{v}</option>)}
              </select></div>
              <div className="text-xs text-slate-500 flex items-end">We enter car park ~10 min before adjusted pickup time.</div>
            </motion.div>
          )}
        </AnimatePresence>
        <div><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={e=>onChange("notes", e.target.value)} placeholder="Child seats, concierge details, etc."/></div>
        <div className="flex gap-2">
          <Button onClick={doEstimate} disabled={!canEstimate}>Get instant estimate</Button>
          <Button onClick={submit} disabled={!canEstimate || loading}>{loading ? "Sending..." : "Request booking"}</Button>
        </div>
      </div>
      <div className="md:col-span-2 space-y-3">
        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex justify-between text-sm"><span>Vehicle</span><span className="font-medium capitalize">{form.vehicle} class</span></div>
          <div className="flex justify-between text-sm"><span>Passengers</span><span className="font-medium">{form.passengers}</span></div>
          <div className="flex justify-between text-sm"><span>Distance</span><span className="font-medium">{form.miles||0} mi</span></div>
          {form.isAirportPickup && form.flightNumber && <div className="flex justify-between text-sm"><span>Flight</span><span className="font-medium">{form.flightNumber} · Buffer {form.buffer}m</span></div>}
          <div className="pt-2 border-t mt-2 flex justify-between"><span>Estimated fare</span><span className="text-xl font-semibold">{quote != null ? currency(quote) : "—"}</span></div>
          <p className="text-xs text-slate-500">Per-mile pricing with minimum fare and airport surcharges applied.</p>
        </div>
        <div className="rounded-2xl border p-3 text-xs text-slate-600">
          <div className="font-semibold mb-1">Waiting time policy</div>
          <ul className="list-disc ml-5 space-y-1">
            <li>Airport pickups: <strong>60 mins complimentary</strong> from adjusted pickup time.</li>
            <li>Town pickups: <strong>30 mins allowed</strong> — first 15 mins free, remaining minutes charged.</li>
          </ul>
        </div>
        <div className="rounded-2xl border p-4 space-y-2">
          <div className="text-sm font-medium">Payment</div>
          <label className="flex items-center gap-2 text-sm"><input type="radio" name="pay" defaultChecked/> Pay during the ride</label>
          <form action="/api/checkout" method="post" className="space-y-2">
            <input type="hidden" name="amount" value={quote ?? ""}/>
            <input type="hidden" name="currency" value="GBP"/>
            <button className="w-full rounded-2xl px-4 py-2 text-sm border" type="submit">Or pay deposit now (SumUp)</button>
          </form>
          <p className="text-xs text-slate-500 text-center">SumUp link works if configured; otherwise choose pay during the ride.</p>
        </div>
        <div className="text-xs text-center text-slate-500 pt-2">Need help? Call 020 8227 0942</div>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-3">
              <h3 className="text-xl font-semibold">Thanks, {submitted.name || "there"}!</h3>
              <p className="text-sm text-slate-600">Your booking request has been received. We'll confirm by SMS/email.</p>
              <div className="text-xs bg-slate-50 border rounded-xl p-3">
                <div className="flex justify-between"><span>Pickup</span><span className="font-medium">{submitted.pickup}</span></div>
                <div className="flex justify-between"><span>Drop-off</span><span className="font-medium">{submitted.dropoff}</span></div>
                <div className="flex justify-between"><span>Date</span><span className="font-medium">{submitted.date} {submitted.time}</span></div>
                {submitted.quote != null && (<div className="flex justify-between"><span>Estimate</span><span className="font-medium">{currency(submitted.quote)}</span></div>)}
              </div>
              <div className="flex justify-end"><Button onClick={()=>setSubmitted(null)}>Close</Button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
