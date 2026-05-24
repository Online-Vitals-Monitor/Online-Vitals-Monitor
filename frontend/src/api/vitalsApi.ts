export interface Vitals {
  heartRate: number;
  respRate: number;
  o2Saturation: number;
  systolicBP: number;
  diastolicBP: number;
  eTCO2: number;
  sessionID: string;
}

const API_URL = import.meta.env.VITE_API_URL

const getBaseUrl = () => API_URL;

export async function getVitals(publicID: string): Promise<Vitals> {
  const baseUrl = getBaseUrl();
  console.log("Fetching from:", `${baseUrl}/api/vitals/${publicID}`);

  const res = await fetch(`${baseUrl}/api/vitals/${publicID}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("SERVER ERROR:", errorText);
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}

export async function updateVitals(
  publicID: string,
  newVitals: Partial<Vitals>,
): Promise<Vitals> {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/vitals/${publicID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newVitals),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("UPDATE ERROR:", errorText);
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}
