import dotenv from "dotenv";
dotenv.config();

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
      "https://online-vitals-monitor-s-git-2e888a-jamie-lius-projects-6184fc84.vercel.app",
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
