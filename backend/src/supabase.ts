import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend .env",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws as any, // ← cast to any to bypass type mismatch
  },
});
