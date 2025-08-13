export type VehicleClass = "business" | "suv" | "first";

export type Tariff = {
  perMile: number;
  minFare: number;
  pickupFee: number;
  airportPickupFee: number; // +£12 for airport pickups
};

export const tariffs: Record<VehicleClass, Tariff> = {
  business: { perMile: 2.80, minFare: 62, pickupFee: 0, airportPickupFee: 12 },
  suv:      { perMile: 3.80, minFare: 84, pickupFee: 0, airportPickupFee: 12 },
  first:    { perMile: 3.80, minFare: 84, pickupFee: 0, airportPickupFee: 12 },
};

export function airportDropoffSurcharge(dropoffText:string){
  const t = (dropoffText || "").toLowerCase();
  if (/(heathrow|lhr)/.test(t)) return 6;
  if (/(gatwick|lgw)/.test(t)) return 6;
  if (/(stansted|stn)/.test(t)) return 7;
  return 0;
}

export function estimateFareAdvanced(opts: {
  miles:number;
  vehicle:VehicleClass;
  isAirportPickup:boolean;
  dropoffText?:string;
}){
  const { miles, vehicle, isAirportPickup, dropoffText } = opts;
  const t = tariffs[vehicle];
  const distancePortion = t.pickupFee + t.perMile * Math.max(0, miles);
  let base = Math.max(t.minFare, distancePortion);
  if (isAirportPickup) base += t.airportPickupFee; // +£12 for airport pickups
  base += airportDropoffSurcharge(dropoffText || "");
  return Math.round(base * 100) / 100;
}
