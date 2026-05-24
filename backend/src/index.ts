import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import vitalsRouter from "./vitalsRouter";
import sessionsRouter from "./sessionsRouter";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api/sessions", sessionsRouter);
app.use("/api/vitals", vitalsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
