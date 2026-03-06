import express from "express";
import cors from "cors";
import vitalsRouter from "./vitalsRouter";
import sessionsRouter from "./sessionsRouter";

const app = express();

// app.use(cors({
//   origin: "https://online-vitals-monitor-frontend-pearl.vercel.app",
//   methods: ["GET", "POST"]
// }));

app.use(cors());

app.use(express.json());

// routes
app.use("/api/vitals", vitalsRouter);
app.use("/api/sessions", sessionsRouter);

// for vercel: don't use app.listen unless you're doing local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// 2. Export the app for Vercel
export default app;
