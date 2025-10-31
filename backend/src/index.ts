import express from 'express';
import cors from 'cors';
import vitalsRouter from './vitalsRouter';
import pool from "./db";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

interface users {
  id: number;
  name: string;
}
// routes
app.use('/api/vitals', vitalsRouter);

// app.get("/api/users", async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query<users>("SELECT * FROM users");
//     res.status(200).json(result.rows);  // <- typed correctly
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
