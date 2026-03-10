import express from "express";
import { supabase } from "./supabase";

export interface Vitals {
  heartRate: number;
  respRate: number;
  o2Saturation: number;
  systolicBP: number;
  diastolicBP: number;
  eTCO2: number;
  sessionID: string;
}

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
router.get("/:publicID", async (req, res) => {
  try {
    const { publicID } = req.params;

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("publicID", publicID)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const { data: vitals, error: vitalsError } = await supabase
      .from("vitals")
      .select("*")
      .eq("sessionID", session.id)
      .single();

    if (vitalsError || !vitals) {
      return res.status(404).json({ error: "Vitals not found" });
    }

    res.json(vitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
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
