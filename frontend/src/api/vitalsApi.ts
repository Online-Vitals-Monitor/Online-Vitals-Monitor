export interface Vitals {
  heartRate: number;
  respRate: number;
  o2Saturation: number;
  systolicBP: number;
  diastolicBP: number;
  eTCO2: number;
}

const API_URL = import.meta.env.VITE_API_URL

const getBaseUrl = () => {
  if (!API_URL) {
    throw new Error("API URL is not defined. Check REACT_APP_API_URL env var.");
  }
  return API_URL;
}

export async function getVitals(): Promise<Vitals> {
  const baseUrl = getBaseUrl();
  console.log("Fetching from:", `${baseUrl}/api/vitals`);
  
  const res = await fetch(`${baseUrl}/api/vitals`);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("SERVER ERROR:", errorText);
    throw new Error(`Server responded with ${res.status}`);
  }
  
  return res.json();
}

export async function updateVitals(newVitals: Partial<Vitals>): Promise<Vitals> {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/vitals`, { 
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newVitals),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("UPDATE ERROR:", errorText);
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}