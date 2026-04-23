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

// Router POST, create a new session
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

// joining an existing session via publicID
router.post("/join", async (req, res) => {
  try {
    const { publicID } = req.body;

    if (!publicID?.trim()) {
      return res.status(400).json({ error: "publicID is required" });
    }

    const { data: session, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("publicID", publicID.trim())
      .single();

    if (error || !session) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.json({
      publicID: session.publicID,
      createdAt: session.createdAt,
      lastSeen: session.lastSeen,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

//get session info by publicID, used by getCurrentSession in frontend/src/api/sessionApi.ts
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: session, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("publicID", id)
      .single();

    if (error || !session) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.json({
      publicID: session.publicID,
      createdAt: session.createdAt,
      lastSeen: session.lastSeen,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

export default router;
