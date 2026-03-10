import express from "express";
import { supabase } from "./supabase";

const router = express.Router();

function generatePublicID(length = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
}

// POST /api/sessions → Create a new session
router.post("/", async (req, res) => {
  try {
    let publicID = generatePublicID();
    let sessionRow = null;

    while (!sessionRow) {
      const { data, error } = await supabase
        .from("sessions")
        .insert({ publicID })
        .select()
        .single();

      if (error?.code === "23505") {
        publicID = generatePublicID();
      } else if (error) {
        return res.status(500).json({ error });
      } else {
        sessionRow = data;
      }
    }

    return res.json({
      publicID: sessionRow.publicID,
      createdAt: sessionRow.createdAt,
      lastSeen: sessionRow.lastSeen,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});
export default router;
