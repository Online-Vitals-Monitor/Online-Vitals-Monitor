import React, {useState, useEffect, useMemo, useRef} from 'react';
import { getVitals, Vitals } from '../api/vitalsApi';
import MonitorVitalRow from '../components/MonitorVitalRow';
import WaveformChart from "../components/WaveformChart";

function generateECGData(): number[] {
  const N = 35;
  const g = (x: number, center: number, width: number, ampl: number) =>
    ampl * Math.exp(-0.5 * ((x - center) / width) ** 2);

  const beat: number[] = Array.from({ length: N }, (_, i) => {
    const x = i / N;
    const p = g(x, 0.1, 0.02, 0.15);
    const q = g(x, 0.18, 0.005, -0.1);
    const r = g(x, 0.2, 0.005, 1.0);
    const s = g(x, 0.22, 0.007, -0.2);
    const t = g(x, 0.45, 0.05, 0.25);
    
    return p + q + r + s + t;
  });

  // normalize to 0-100 w/o shifting baseline
  // keep flat part inbetween beats at a certain level
  const maxV = Math.max(...beat);
  
  // use 40 as our baseline (isoelectric line)
  // ensures the Q and S dips go down from the line
  const baseline = 20;
  return beat.map(v => (v * 50) + baseline);
}

// function generatePlethData() {} // disabled for CI to pass
// function generateBPData() {}
// function generateEtco2Data() {}

const MonitorView: React.FC = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0, 
    respRate: 0, 
    o2Saturation: 0,
    systolicBP: 0,
    diastolicBP: 0,
    eTCO2: 0,
  });

  const fetchVitals = async () => {
    try {
      const data = await getVitals();
      setVitals(data);
    } catch (e) {
      // default if API fails
      setVitals(prev => ({ ...prev, heartRate: 65, respRate: 12 })); 
    }
  };

  useEffect(() => {
    document.title = "Monitor";
    fetchVitals();
    const interval = setInterval(fetchVitals, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  // measure layout elements (for fitting waveforms)
  const waveformWrapperRef = useRef<HTMLDivElement>(null);
  const [waveformWidth, setWaveformWidth] = useState(300); // default

  useEffect(() => {
    function computeWidth() {
      if (!waveformWrapperRef.current) return;
      // buffer to prevent scrolling
      setWaveformWidth(waveformWrapperRef.current.clientWidth - 20);
    }

    // initial calculation
    const timer = setTimeout(computeWidth, 100);
    window.addEventListener("resize", computeWidth);
    
    return () => {
      window.removeEventListener("resize", computeWidth);
      clearTimeout(timer);
    };
  }, []);

  // memoize ecg data so it doesn't regenerate every time
  const ecgBeat = useMemo(() => generateECGData(), []);

  // use inline styles to override potential parent CSS container that could restrict width
  const pageStyle: React.CSSProperties = {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  return (
   <div style={pageStyle} ref={waveformWrapperRef}>
      
      {/* IMPORTANT: 
          When adding rows using MonitorVitalRow, only the very LAST row should have the 'isLast' prop. 
          If a row above it has 'isLast' the separating black line will disappear.
      */}
      
      {/* ROW 0: BUFFER (Using Component) */}
      <MonitorVitalRow 
        label="BUFFER" 
        unit="xyz" 
        value={vitals.respRate || 12} 
        color="yellow"
      >
        <div className="ps-5">
           <span className="text-secondary small" style={{ letterSpacing: '2px' }}>
             [ RESPIRATORY WAVEFORM AREA ]
           </span>
        </div>
      </MonitorVitalRow>

      {/* ROW 1: HEART RATE (With Dynamic Waveform) */}
      <MonitorVitalRow 
        label="HR" 
        unit="bpm" 
        value={vitals.heartRate || 65} 
        color="green"
      >
        {waveformWidth > 0 && (
          <WaveformChart
            elementId="ecg_waveform"
            beatData={ecgBeat}
            color="green"
            height={120} 
            width={waveformWidth}
            mmPerSecond={25}
            vitalValue={vitals.heartRate || 65}
          />
        )}
      </MonitorVitalRow>

      {/* ROW 2: RESPIRATORY RATE */}
      <MonitorVitalRow 
        label="RESP" 
        unit="rpm" 
        value={vitals.respRate || 12} 
        color="yellow"
      >
        <div className="ps-5">
           <span className="text-secondary small" style={{ letterSpacing: '2px' }}>
             [ RESPIRATORY WAVEFORM AREA ]
           </span>
        </div>
      </MonitorVitalRow>

      {/* ROW 3: SpO2 (Optional Waveform Omitted) */}
      <MonitorVitalRow 
        label="SpO2" 
        unit="%" 
        value={vitals.o2Saturation || 98} 
        color="cyan" 
      >
        <div className="ps-5">
            <span className="text-secondary small" >
              [Waveform Placeholder]
            </span>
        </div>
      </MonitorVitalRow>

      {/* ROW 3: SpO2 (Optional Waveform Omitted) */}
      <MonitorVitalRow 
        label="Systolic BP:" 
        unit="%" 
        value={vitals.systolicBP || 80} 
        color="red" 
        isLast
      >
        <div className="ps-5">
          <span className="text-secondary small">
            [Waveform Placeholder]
          </span>
        </div>
      </MonitorVitalRow>
      
    </div>
    
  );
};

export default MonitorView;