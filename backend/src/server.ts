import express from "express";
import cors from "cors";
import vitalsRouter from "./vitalsRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/vitals", vitalsRouter);

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

export default app;
