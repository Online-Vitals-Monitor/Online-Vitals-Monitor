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
  // flatline
  if (heartRate <= 0) return Array(100).fill(0);

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

export function generateRespWaveform(respRate: number): number[] {
  // flatline
  if (respRate <= 0) return Array(100).fill(0);

  // points for a breath
  const mmPerSecond = 6.25; // match monitorView.tsx
  const pxPerMm = 3.78;     // match WaveformChart.tsx
  const pxPerSec = mmPerSecond * pxPerMm; 
  
  const secondsPerBreath = 60 / respRate;
  const totalPoints = Math.floor(pxPerSec * secondsPerBreath);

  const waveform: number[] = [];
  const amplitude = 50; // height
  const baseline = 10;  // resting baseline

  // cos wave with noise
  for (let i = 0; i < totalPoints; i++) {
    const progress = i / totalPoints;
    
    // raised cos
    const wave = 0.5 - 0.5 * Math.cos(2 * Math.PI * progress);
    
    // lil bit of noise
    const noise = (Math.random() - 0.5) * 1.5;
    waveform.push(baseline + (amplitude * wave) + noise);
  }
  
  return waveform
}

// you can play with the desmos graph of this waveform here: https://www.desmos.com/calculator/jayrvvlft0

export function generatePlethWaveform(heartRate: number, spo2: number): number[] {
  // flatline
  if (heartRate <= 0) return Array(100).fill(0);

  const mmPerSecond = 25; // from monitorView.tsx
  const pxPerMm = 3.78;     // from WaveformChart.tsx
  const pxPerSec = mmPerSecond * pxPerMm;
  
  const secondsPerBeat = 60 / heartRate;
  const totalPoints = Math.floor(pxPerSec * secondsPerBeat);

  // split the beat into phrases
  const risePoints = Math.floor(totalPoints * 0.20); // fast rise for 20% of wave
  const fallPoints = totalPoints - risePoints; // slower fall for rest of wave

  const waveform: number[] = [];
  // scale amplitude slightly by SpO2 value
  const amplitude = 50 * (spo2 / 100); 
  const baseline = 10;

  // fast systolic rise
  for (let i = 0; i < risePoints; i++) {
    const progress = i / risePoints;
    // steep sin for initial rise
    const val = baseline + amplitude * Math.sin(progress * (Math.PI / 2));
    waveform.push(val);
  }

  // diastolic fall 
  for (let i = 0; i < fallPoints; i++) {
    const progress = i / fallPoints;

    // main decay as an exponential
    let decay = Math.cos(progress * (Math.PI / 2));

    // add dicrotic notch
    const notchLocation = 0.65; // l in desmos
    const notchWidth = 0.08; // w in desmos
    const notchHeight = 0.15; // h in desmos

    const bump = notchHeight * Math.exp(
      -Math.pow(progress - notchLocation, 2) / (2 * Math.pow(notchWidth, 2))
    );
    decay += bump;
    waveform.push(baseline + (amplitude * decay));  
  }
  
  return waveform;
}

export function generateEtco2Waveform(respRate: number, etco2Value: number): number[] {
  // flatline
  if (respRate <= 0) return Array(100).fill(0);

  const mmPerSecond = 6.25; // from monitorView.tsx
  const pxPerMm = 3.78;     // from WaveformChart.tsx
  const pxPerSec = mmPerSecond * pxPerMm;
  const secondsPerBreath = 60 / respRate;
  const totalPoints = Math.floor(pxPerSec * secondsPerBreath);

  // divide into phases
  const baselinePoints = Math.floor(totalPoints * 0.10); // phase I
  const risePoints = Math.floor(totalPoints * 0.10);     // phase II (sharp rise)
  const plateauPoints = Math.floor(totalPoints * 0.35);  // phase III
  const fallPoints = Math.floor(totalPoints * 0.10);     // phase IV (sharp decline)
  const restPoints = totalPoints - (baselinePoints + risePoints + plateauPoints + fallPoints);  

  const waveform: number[] = [];
  const amplitude = etco2Value;
  const baseline = 2; // offset from bottom for visibility

  // baseline
  for (let i = 0; i < baselinePoints; i++) {
    waveform.push(baseline);
  }

  // linear rise
  for (let i = 0; i < risePoints; i++) {
    const progress = i / risePoints;
    // round corners
    const curve = (Math.sin((progress * Math.PI) - (Math.PI / 2)) + 1) / 2;
    waveform.push(baseline + (amplitude * curve));
  }

  // plateau
  for (let i = 0; i < plateauPoints; i++) {
    const progress = i / plateauPoints;
    // slightly upward tilt
    const tilt = 5 * progress; 
    const noise = (Math.random() - 0.2) * 1.5;
    waveform.push(baseline + amplitude + tilt);
  }

  // linear fall
  for (let i = 0; i < fallPoints; i++) {
    const progress = i / fallPoints;
    const curve = (Math.sin((progress * Math.PI) + (Math.PI / 2)) + 1) / 2;
    waveform.push(baseline + (amplitude * (1 - progress)));
  }

  // remainder of cycle at baseline
  for (let i = 0; i < restPoints; i++) {
    waveform.push(baseline);
  }

  return waveform;
}

export function generateBpWaveform(
  heartRate: number,
  _systolicBp: number,
  _diastolicBp: number,
): number[] {
  return generateEcgWaveform(heartRate || 72);
}
