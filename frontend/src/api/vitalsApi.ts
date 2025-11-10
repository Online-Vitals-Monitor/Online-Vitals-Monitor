export interface Vitals {
  heartRate: number;
  respRate: number;
  o2Saturation: number;
  systolicBP: number;
  diastolicBP: number;
  eTCO2: number;
}

const API_URL = "http://localhost:4000/api/vitals";

export async function getVitals(): Promise<Vitals> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function updateVitals(
  newVitals: Partial<Vitals>,
): Promise<Vitals> {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newVitals),
  });
  return res.json();
}
