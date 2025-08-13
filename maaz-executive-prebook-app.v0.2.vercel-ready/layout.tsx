import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Maaz Executive — Pre-book a Chauffeur", description: "Business, SUV/VAN, and First Class vehicles, including Mercedes EQE and EQS." };
export default function RootLayout({ children }:{ children: React.ReactNode }){
  return <html lang="en"><body className="min-h-screen bg-gradient-to-b from-slate-50 to-white">{children}</body></html>;
}
