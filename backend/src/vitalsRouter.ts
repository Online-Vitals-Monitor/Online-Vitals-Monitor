import express from 'express';

interface Vitals {
  heartRate: number;
  respRate: number;
  o2Saturation: number;
  systolicBP: number;
  diastolicBP: number;
  eTCO2: number;
}

// vitals object to store info (until we get a database up)
let vitals: Vitals = {
  heartRate: 65,
  respRate: 10,
  o2Saturation: 100,
  systolicBP: 188,
  diastolicBP: 177,
  eTCO2: 4,
};

const router = express.Router();

// returns current vitals to give to display
router.get('/', (req, res) => {
  res.json(vitals);
});

// updates vitals from controller
router.put('/', (req, res) => {
  const updates = req.body as Partial<Vitals>;
  vitals = { ...vitals, ...updates }; // merges updates from new info to existing vitals object
  res.json(vitals);
});

export default router;
