import React, { useState, useEffect, useMemo, useRef } from "react";
import "./monitorViewNew.css";
import { getVitals, Vitals } from "../api/vitalsApi";
import WaveformChart from "../components/WaveformChart";
import { useVitals } from "../contexts/vitalsContext";
import VitalCard from "../components/VitalCard";
import {
  generateBpWaveform,
  generateEcgWaveform,
  generateEtco2Waveform,
  generatePlethWaveform,
  generateRespWaveform,
} from "../utils/waveforms";

//map of keys for vital cards
const vitalInfo: Record<
  string,
  { title: string; unit?: string; className?: string }
> = {
  heartRate: { title: "Heart Rate", unit: "bpm" },
  respRate: { title: "Respiratory Rate", unit: "rpm" },
  o2Saturation: { title: "Oxygen Saturation", unit: "%" },
  systolicBP: { title: "Systolic BP", unit: "mmHg" },
  diastolicBP: { title: "Diastolic BP", unit: "mmHg" },
  eTCO2: { title: "ETCO2", unit: "mmHg" },
};

const MonitorViewNew = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0,
    respRate: 0,
    o2Saturation: 0,
    systolicBP: 0,
    diastolicBP: 0,
    eTCO2: 0,
  });
  return (
    <div className="monitor-grid">
      {/* Row 1 */}
      <div className="monitor-track ecg">
        <div className="waveform">Wave goes here</div>
        <div className="numerics">120 BPM</div>
      </div>

      {/* Row 2 */}
      <div className="monitor-track resp">
        <div className="waveform">Wave goes here</div>
        <div className="numerics">20 RPM</div>
      </div>
      {/* Row 3 */}
      <div className="monitor-track spo2">
        <div className="waveform">Wave goes here</div>
        <div className="numerics">120 BPM</div>
      </div>

      {/* Row 4 */}
      <div className="monitor-track bpmmhg">
        <div className="waveform">Wave goes here</div>
        <div className="numerics">20 RPM</div>
      </div>
      {/* Row 5 */}
      <div className="monitor-track etco2kpa">
        <div className="waveform">Wave goes here</div>
        <div className="numerics">120 BPM</div>
      </div>
    </div>
  );
};

export default MonitorViewNew;
