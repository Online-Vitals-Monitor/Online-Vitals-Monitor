import express from 'express';
import cors from 'cors';
import vitalsRouter from './vitalsRouter';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// routes
app.use('/api/vitals', vitalsRouter);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
