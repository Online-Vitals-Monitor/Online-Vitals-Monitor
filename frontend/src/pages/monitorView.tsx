import React, {useState, useEffect, useMemo, useRef} from 'react';
import './monitorView.css';
import { getVitals, Vitals } from '../api/vitalsApi';
import WaveformChart from "../components/WaveformChart";
import { useVitals } from '../contexts/vitalsContext';
import VitalCard from '../components/VitalCard';
import { ClassNames } from '@emotion/react';


function generateECGData(): number[] {
  const N = 200;
  const g = (x: number, center: number, width: number, ampl: number) =>
    ampl * Math.exp(-0.5 * ((x - center) / width) ** 2);

  const beat: number[] = Array.from({length: N}, (_, i) => {  // one heartbeat
    const x = i / N;
    // P wave -> Q dip -> R spike -> S dip -> T wave
    const p = g(x, 0.15, 0.035, 0.1);
    const q = g(x, 0.28, 0.01, -0.25);
    const r = g(x, 0.3, 0.008, 1.0);
    const s = g(x, 0.33, 0.012, -0.35);
    const t = g(x, 0.55, 0.08, 0.35);
    return p + q + r + s + t;
  });

  // normalize beat to the range [0, 100] so it fits the Y axis
  const minV = Math.min(...beat);
  const maxV = Math.max(...beat);
  const beat_scaled = beat.map((v) => ((v - minV) / (maxV - minV)) * 100);

  return [...beat_scaled, ...beat_scaled, ...beat_scaled];  // tile multiple beats so we fill a strip spannign horizontally
}

// function generatePlethData() {} // disabled for CI to pass
// function generateBPData() {}
// function generateEtco2Data() {}

//map of keys for vital cards 
const vitalInfo: Record <
  string,
  {title: string; unit?: string; className?: string}> = {
    heartRate: { title: 'Heart Rate', unit: 'bpm'},
    respRate: { title: 'Respiratory Rate', unit: 'rpm'},
    o2Saturation: { title: 'Oxygen Saturation', unit: '%'},
    systolicBP: { title: 'Systolic BP', unit: 'mmHg'},
    diastolicBP: { title: 'Diastolic BP', unit: 'mmHg'},
    eTCO2: { title: 'ETCO2', unit: 'mmHg'},
}


const MonitorView: React.FC = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0, 
    respRate: 0, 
    o2Saturation: 0,
    systolicBP: 0,
    diastolicBP: 0,
    eTCO2: 0,
  });

  //order which to render the vitals in
  const vitalCardOrder: (keyof Vitals)[] = [
    'heartRate',
    'respRate',
    'o2Saturation',
    'systolicBP',
    'diastolicBP',
    'eTCO2',
  ];

  const { state } = useVitals();  //from context get array of selected vitals
  const selected: string[] = state?.selected ?? []; 

  const fetchVitals = async () => {  // from backend
    const data = await getVitals();
    setVitals(data);
  };

  useEffect(() => {
    document.title = "Monitor";
    fetchVitals();
    const interval = setInterval(fetchVitals, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  // measure layout elements (for fitting waveforms)
  const hrRef = useRef<HTMLDivElement>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [waveformWidth, setWaveformWidth] = useState(300); // default

  useEffect(() => {
    function computeWidth() {
      const hrBox = hrRef.current;
      const wrapper = waveformContainerRef.current;
      if (!hrBox || !wrapper) return;

      const hrWidth = hrBox.offsetWidth;
      const fullWidth = wrapper.offsetWidth;

      setWaveformWidth(Math.max(100, fullWidth - hrWidth - 16));
    }

    computeWidth();
    window.addEventListener("resize", computeWidth);
    return () => window.removeEventListener("resize", computeWidth);
  }, []);

  // memoize ecg data so it doesn't regenerate every time
  const ecgBeat = useMemo(() => generateECGData(), []);
  // const plethData = generatePlethData(); // add other waveforms
  // const bpData = generateBPData();
  // const etco2Data = generateEtco2Data();

  return (
    <div className="container mt-2">
      <div className="vitals-grid">
        {vitalCardOrder.map(
          (key) =>
            selected.includes(key) && (
              <VitalCard
                key={key}
                title={vitalInfo[key].title}
                value={vitals[key as keyof Vitals]}
                unit={vitalInfo[key].unit}
                className={vitalInfo[key].className}
              />
            )
        )}
      </div>

      <div className="ecg-container">
        <small className="text-muted">ECG bpm {vitals.heartRate || 72}</small>
        {/* can be adapted for different types of waveforms (need to add them to WaveformChart.tsx) */}
        <WaveformChart
          elementId="ecg_waveform"
          beatData={ecgBeat}
          color="#00ff4f"
          height={120}
          easing="power1.inOut"
          waveformType='ecg'
          width={waveformWidth}
          mmPerSecond={25}
        />
      </div>

    </div>
  );
};

export default MonitorView;