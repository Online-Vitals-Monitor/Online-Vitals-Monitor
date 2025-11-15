import express from "express";
import { supabase } from "./supabase";

export interface Vitals {
  heartRate: number;
  respRate: number;
  o2Saturation: number;
  systolicBP: number;
  diastolicBP: number;
  eTCO2: number;
}

// interface Vitals {
//   heartRate: number;
//   respRate: number;
//   o2Saturation: number;
//   systolicBP: number;
//   diastolicBP: number;
//   eTCO2: number;
// }

// // vitals object to store info (until we get a database up)
// let vitals: Vitals = {
//   heartRate: 65,
//   respRate: 10,
//   o2Saturation: 100,
//   systolicBP: 188,
//   diastolicBP: 177,
//   eTCO2: 4,
// };

const router = express.Router();
// helper: get the single vitals row (if you plan to support multiple monitors, change this later)
async function getSingleVitalsRowId(): Promise<string | null> {
  const { data, error } = await supabase
    .from("vitals")
    .select("id")
    .limit(1)
    .single();

  if (error) {
    console.error("getSingleVitalsRowId error:", error);
    return null;
  }
  return (data as any)?.id ?? null;
}

// GET - return current vitals
router.get("/", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("vitals")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("GET /api/vitals supabase error:", error);
      return res.status(500).json({ error });
    }

    return res.json(data);
  } catch (err) {
    console.error("GET /api/vitals unexpected error:", err);
    return res.status(500).json({ error: "internal" });
  }
});

// PUT - partial update of the single vitals row
router.put("/", async (req, res) => {
  try {
    const updates = req.body as Partial<Vitals>;

    // find the row id (first row) dynamically
    const id = await getSingleVitalsRowId();
    if (!id) {
      return res.status(500).json({ error: "no vitals row found" });
    }

    const { data, error } = await supabase
      .from("vitals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PUT /api/vitals supabase error:", error);
      return res.status(500).json({ error });
    }

    return res.json(data);
  } catch (err) {
    console.error("PUT /api/vitals unexpected error:", err);
    return res.status(500).json({ error: "internal" });
  }
});

export default router;
