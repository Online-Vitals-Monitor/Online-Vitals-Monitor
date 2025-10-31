import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/vitals", (_req, res) => res.json({ heartRate: 72, respRate: 14 }));

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

export default app;
