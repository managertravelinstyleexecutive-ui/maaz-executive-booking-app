import BookingForm from "@/components/BookingForm";
import { Car } from "lucide-react";
export default function Page(){
  return (<main className="max-w-5xl mx-auto p-4 md:p-8">
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2"><Car size={24}/> Maaz Executive — Pre-book a Chauffeur</h1>
        <p className="text-slate-600 text-sm md:text-base">Business, SUV/VAN, and First Class vehicles, including Mercedes EQE and EQS.</p>
      </div>
      <span className="text-xs border rounded-xl px-2 py-1">Pilot MVP</span>
    </header>
    <BookingForm/>
    <footer className="text-center text-xs text-slate-500 mt-10">© {new Date().getFullYear()} Maaz Executive • TfL-registered operator • Pilot customer app (pre-book only)</footer>
  </main>);
}
