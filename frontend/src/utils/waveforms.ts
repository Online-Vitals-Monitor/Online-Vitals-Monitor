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
  return generateEcgWaveform(respRate || 14);
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
