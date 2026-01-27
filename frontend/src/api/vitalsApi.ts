export interface Vitals {
  heartRate: number;
  respRate: number;
  o2Saturation: number;
  systolicBP: number;
  diastolicBP: number;
  eTCO2: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL //|| "http://localhost:4000";

// export async function getVitals(): Promise<Vitals> {
//   const res = await fetch(`${BASE_URL}/api/vitals`); 
//   return res.json();
// }

export async function getVitals(): Promise<Vitals> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/vitals`;
  console.log("Fetching from:", url);
  
  const res = await fetch(url);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("SERVER ERROR HTML:", errorText); // THIS WILL SHOW THE REAL ERROR
    throw new Error(`Server responded with ${res.status}`);
  }
  
  return res.json();
}

export async function updateVitals(newVitals: Partial<Vitals>): Promise<Vitals> {
  // Append the path here as well
  const res = await fetch(`${BASE_URL}/api/vitals`, { 
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newVitals),
  });
  return res.json();
}