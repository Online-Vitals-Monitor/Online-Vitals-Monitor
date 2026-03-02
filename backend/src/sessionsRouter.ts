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

    // Insert until the publicID is unique
    while (!sessionRow) {
      const { data, error } = await supabase
        .from("sessions")
        .insert({ publicID })
        .select()
        .single();

      if (error?.code === "23505") {
        publicID = generatePublicID(); // regenerate on collision
      } else if (error) {
        console.error("Error creating session:", error);
        return res.status(500).json({ error });
      } else {
        sessionRow = data;
      }
    }

    // Return minimal session info
    return res.json({
      id: sessionRow.id,
      publicID: sessionRow.publicID,
      createdAt: sessionRow.createdAt,
      lastSeen: sessionRow.lastSeen,
    });
  } catch (err) {
    console.error("Unexpected /api/sessions error:", err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
