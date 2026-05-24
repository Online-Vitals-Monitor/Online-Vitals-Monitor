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

// GET - return current vitals by publicID
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

// PUT - partial update vitals by publicID
router.put("/:publicID", async (req, res) => {
  try {
    const { publicID } = req.params;
    const updates = req.body as Partial<Vitals>;

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("publicID", publicID)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const { data, error } = await supabase
      .from("vitals")
      .update(updates)
      .eq("sessionID", session.id)
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
