const SAMPLE_RATE = 95; // approx px/s at 25 mm/s and 96 DPI.

const g = (x: number, center: number, width: number, amplitude: number) =>
  amplitude * Math.exp(-0.5 * ((x - center) / width) ** 2);

const repeatCycle = (cycle: number[], times: number) =>
  Array.from({ length: times }, () => cycle).flat();

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const cycleSamplesForRate = (ratePerMinute: number, min = 1, max = 240) => {
  const safeRate = clamp(ratePerMinute || min, min, max);
  return Math.max(24, Math.round((SAMPLE_RATE * 60) / safeRate));
};

// normalize beat to the range [0, 100] so it fits the Y axis
const normalizeToRange = (values: number[], minOut = 0, maxOut = 100) => {
  const inMin = Math.min(...values);
  const inMax = Math.max(...values);
  const span = inMax - inMin || 1;
  return values.map((v) => minOut + ((v - inMin) / span) * (maxOut - minOut));
};

export function generateEcgWaveform(heartRate: number): number[] {
  const n = cycleSamplesForRate(heartRate || 72, 20, 220);
  const beat = Array.from({ length: n }, (_, i) => {
    const x = i / n;
    // P wave -> Q dip -> R spike -> S dip -> T wave
    const p = g(x, 0.15, 0.035, 0.1);
    const q = g(x, 0.28, 0.01, -0.25);
    const r = g(x, 0.3, 0.008, 1.0);
    const s = g(x, 0.33, 0.012, -0.35);
    const t = g(x, 0.55, 0.08, 0.35);
    return p + q + r + s + t;
  });

  return repeatCycle(normalizeToRange(beat, 8, 94), 4);
}

// placeholder implementations
export function generateRespWaveform(respRate: number): number[] {
  // flatline
  if (respRate <= 0) return Array(100).fill(0);

  // points for a breath
  const mmPerSecond = 6.25; // match monitorView.tsx
  const pxPerMm = 3.78;     // match WaveformChart.tsx
  const pxPerSec = mmPerSecond * pxPerMm; 
  
  const secondsPerBreath = 60 / respRate;
  const totalPoints = Math.floor(pxPerSec * secondsPerBreath);

  // a breath consists of active inspiration (inhalation) and passive expiration (exhalation)
  // inspiration-expiration (I:E) resting ratio is typically 1:2 or 1:3 - set to 1:2
  // divide total breath/wave points to inspiration and expiration
  const inspPoints = Math.floor(totalPoints * 0.33); // 1/3 to breathe in
  const expPoints = Math.floor(totalPoints * 0.50); // 1/2 to breathe out
  const pausePoints = totalPoints - inspPoints - expPoints; // rest (1/6) of resting after ehalation 

  const waveform: number[] = [];
  const amplitude = 50; // height
  const baseline = 10;  // resting baseline

  // using sin to create smooth inhalation
  for (let i = 0; i < inspPoints; i++) {
    const progress = i / inspPoints;
    // get the sin wave from [0, 1] * how far we are in the inhalation
    const val = baseline + amplitude * Math.sin(progress * (Math.PI / 2));
    waveform.push(val);
  }

  // cos for smooth exhalation
  for (let i = 0; i < expPoints; i++) {
    const progress = i / expPoints;
    // get the cos wave from [1, 0] * how far we are in the exhalation
    const val = baseline + amplitude * Math.cos(progress * (Math.PI / 2));
    waveform.push(val);
  }

  // rest after exhilation
  for (let i = 0; i < pausePoints; i++) {
    // with some noise so it's not just flatline
    const noise = (Math.random() - 0.5) * 1.5;
    waveform.push(baseline + noise);
  }

  // // Keep the 1:2 I:E ratio, but group the active breathing points together
  // const activePoints = Math.floor(totalPoints * 0.83); // roughly 33% insp + 50% exp
  // const pausePoints = totalPoints - activePoints;

  // const waveform: number[] = [];
  // const amplitude = 50; 
  // const baseline = 10;  

  // // Phase 1 & 2: Active Breath (Smooth curve from 0 to PI)
  // for (let i = 0; i < activePoints; i++) {
  //   const progress = i / activePoints;
  //   // Math.sin from 0 to PI creates a smooth, bell-like curve
  //   const waveCurve = Math.sin(progress * Math.PI);
    
  //   // Add a tiny bit of noise across the whole breath for realism
  //   const noise = (Math.random() - 0.5) * 1.5;
    
  //   const val = baseline + (amplitude * waveCurve) + noise;
  //   waveform.push(val);
  // }

  // // Phase 3: Expiratory Pause
  // for (let i = 0; i < pausePoints; i++) {
  //   const noise = (Math.random() - 0.5) * 1.5;
  //   waveform.push(baseline + noise);
  // }
  
  return waveform
}

export function generatePlethWaveform(
  heartRate: number,
  _o2Saturation: number,
): number[] {
  return generateEcgWaveform(heartRate || 72);
}

export function generateEtco2Waveform(
  respRate: number,
  _etco2Kpa: number,
): number[] {
  return generateEcgWaveform(respRate || 14);
}

export function generateBpWaveform(
  heartRate: number,
  _systolicBp: number,
  _diastolicBp: number,
): number[] {
  return generateEcgWaveform(heartRate || 72);
}
