import React, {useState, useEffect, useMemo, useRef} from 'react';
import { getVitals, Vitals } from '../api/vitalsApi';
import WaveformChart from "../components/WaveformChart";

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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const rowStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 150, 
    borderBottom: '1px solid #333',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // vertically center content
    width: '100%'
  };

  return (
    <div style={pageStyle}>
      {/* ROW 0: TEST BUFFER */}
      <div style={rowStyle}>
        
        {/* LEFT: Numerics Panel */}
        <div 
          className="d-flex flex-column justify-content-center ps-4" 
          style={{ 
            width: '200px', 
            minWidth: '200px', 
            borderRight: '1px solid #333', 
            height: '100%' 
          }}
        >
          <div style={{ color: '#ffff00', fontSize: '1.2rem', fontWeight: 'bold' }}>
            BUFFER <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>xyz</span>
          </div>
          
          <div style={{ 
            color: '#ffff00', 
            fontSize: '5rem', 
            lineHeight: '1', 
            fontWeight: 'bold',
            marginTop: '5px'
          }}>
            {vitals.respRate || 12}
          </div>
        </div>

        {/* RIGHT: Waveform Placeholder */}
        <div className="flex-grow-1 h-100 d-flex align-items-center ps-5">
           <span className="text-secondary small" style={{ letterSpacing: '2px' }}>
             [ RESPIRATORY WAVEFORM AREA ]
           </span>
        </div>
      </div>


      {/* ROW 1: HEART RATE */}
      <div style={rowStyle}>
        
        {/* LEFT: Numerics Panel */}
        <div 
          className="d-flex flex-column justify-content-center ps-4" 
          style={{ 
            width: '200px', 
            minWidth: '200px', 
            borderRight: '1px solid #333', 
            height: '100%' 
          }}
        >
          {/* Label Group */}
          <div style={{ color: '#00ff4f', fontSize: '1.2rem', fontWeight: 'bold' }}>
            HR <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>bpm</span>
          </div>

          {/* Value */}
          <div style={{ 
            color: '#00ff4f', 
            fontSize: '5rem', 
            lineHeight: '1', 
            fontWeight: 'bold',
            marginTop: '5px' 
          }}>
            {vitals.heartRate || 65}
          </div>
        </div>

        {/* RIGHT: Waveform Panel */}
        <div 
          className="flex-grow-1 h-100 position-relative" 
          ref={waveformWrapperRef} 
          style={{ overflow: 'hidden', backgroundColor: 'white' }}
        >
          {waveformWidth > 0 && (
            <WaveformChart
              elementId="ecg_waveform"
              beatData={ecgBeat}
              color="#00ff4f"
              height={180} // matches the rowStyle height
              width={waveformWidth}
              mmPerSecond={25}
              vitalValue={vitals.heartRate || 65}
            />
          )}
        </div>
      </div>

      {/* ROW 2: RESPIRATORY RATE */}
      <div style={rowStyle}>
        
        {/* LEFT: Numerics Panel */}
        <div 
          className="d-flex flex-column justify-content-center ps-4" 
          style={{ 
            width: '200px', 
            minWidth: '200px', 
            borderRight: '1px solid #333', 
            height: '100%' 
          }}
        >
          <div style={{ color: '#ffff00', fontSize: '1.2rem', fontWeight: 'bold' }}>
            RESP <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>rpm</span>
          </div>
          
          <div style={{ 
            color: '#ffff00', 
            fontSize: '5rem', 
            lineHeight: '1', 
            fontWeight: 'bold',
            marginTop: '5px'
          }}>
            {vitals.respRate || 12}
          </div>
        </div>

        {/* RIGHT: Waveform Placeholder */}
        <div className="flex-grow-1 h-100 d-flex align-items-center ps-5">
           <span className="text-secondary small" style={{ letterSpacing: '2px' }}>
             [ RESPIRATORY WAVEFORM AREA ]
           </span>
        </div>
      </div>

      {/* OPTIONAL ROW 3: OTHER VITALS */}
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <div 
          className="d-flex flex-column justify-content-center ps-4" 
          style={{ width: '200px', minWidth: '200px', borderRight: '1px solid #333', height: '100%' }}
        >
          <div style={{ color: '#00ffff', fontSize: '1.2rem', fontWeight: 'bold' }}>
            SpO2 <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>%</span>
          </div>
          <div style={{ color: '#00ffff', fontSize: '5rem', lineHeight: '1', fontWeight: 'bold' }}>
            {vitals.o2Saturation || 98}
          </div>
        </div>
        <div className="flex-grow-1 h-100 d-flex align-items-center ps-5">
           <span className="text-secondary small">[Waveform Placeholder]-</span>
        </div>
      </div>
      
    </div>
  );
};

export default MonitorView;