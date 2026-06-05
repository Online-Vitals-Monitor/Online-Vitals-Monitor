import express from "express";
import cors from "cors";
import vitalsRouter from "./vitalsRouter";
import sessionsRouter from "./sessionsRouter";

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://online-vitals-monitor-session-deplo.vercel.app",
      process.env.FRONTEND_URL ?? "",
    ],
  }),
);
app.use(express.json());

app.use("/api/sessions", sessionsRouter);
app.use("/api/vitals", vitalsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// cache bust Fri Jun  5 05:14:37 PDT 2026
