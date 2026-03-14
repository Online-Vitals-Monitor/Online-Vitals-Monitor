import React, { useState, useEffect, useMemo, useRef } from "react";
import "./monitorView.css";
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

const MonitorView: React.FC = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0,
    respRate: 0,
    o2Saturation: 0,
    systolicBP: 0,
    diastolicBP: 0,
    eTCO2: 0,
  });

  const { state } = useVitals(); //from context get array of selected vitals
  const selected: string[] = state?.selected ?? [];

  const fetchVitals = async () => {
    // from backend
    // try {
    //   const data = await getVitals();
    //   setVitals(data);
    // } catch (err) {
    //   console.error("Failed to fetch vitals:", err);
    // }

    // mock data for testing / when database is down
    setVitals({
      heartRate: 80,
      respRate: 14, 
      o2Saturation: 99,
      systolicBP: 38,
      diastolicBP: 80,
      eTCO2: 35,
    });
  };

  useEffect(() => {
    document.title = "Monitor";
    fetchVitals();
    const interval = setInterval(fetchVitals, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  // measure layout elements (for fitting waveforms)
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [waveformWidth, setWaveformWidth] = useState(300); // default

  useEffect(() => {
    function computeWidth() {
      const wrapper = waveformContainerRef.current;
      if (!wrapper) return;
      setWaveformWidth(Math.max(240, wrapper.offsetWidth - 12));
    }

    computeWidth();
    window.addEventListener("resize", computeWidth);
    return () => window.removeEventListener("resize", computeWidth);
  }, []);

  const ecgBeat = useMemo(
    () => generateEcgWaveform(vitals.heartRate),
    [vitals.heartRate],
  );
  const respBeat = useMemo(
    () => generateRespWaveform(vitals.respRate),
    [vitals.respRate],
  );
  const plethBeat = useMemo(
    () => generatePlethWaveform(vitals.heartRate, vitals.o2Saturation),
    [vitals.heartRate, vitals.o2Saturation],
  );
  const etco2Beat = useMemo(
    () => generateEtco2Waveform(vitals.respRate, vitals.eTCO2),
    [vitals.respRate, vitals.eTCO2],
  );
  const bpBeat = useMemo(
    () =>
      generateBpWaveform(
        vitals.heartRate,
        vitals.systolicBP,
        vitals.diastolicBP,
      ),
    [vitals.heartRate, vitals.systolicBP, vitals.diastolicBP],
  );

  const waveformRows = [
    {
      id: "ecg",
      label: `ECG  ${vitals.heartRate || 0} bpm`,
      beatData: ecgBeat,
      color: "#00ff4f",
      mmPerSecond: 25,
    },
    {
      id: "resp",
      label: `RESP  ${vitals.respRate || 0} rpm`,
      beatData: respBeat,
      color: "#38d5ff",
      mmPerSecond: 6.25,
    },
    {
      id: "pleth",
      label: `SpO2 Pleth  ${vitals.o2Saturation || 0}%`,
      beatData: plethBeat,
      color: "#f3d66e",
      mmPerSecond: 25,
    },
    {
      id: "etco2",
      label: `ETCO2  ${vitals.eTCO2 || 0} kPa`,
      beatData: etco2Beat,
      color: "#ffa26b",
      mmPerSecond: 6.25,
    },
    {
      id: "bp",
      label: `BP  ${vitals.systolicBP || 0}/${vitals.diastolicBP || 0} mmHg`,
      beatData: bpBeat,
      color: "#ff5f7e",
      mmPerSecond: 25,
    },
  ];

  return (
    <div className="container mt-4">
      <div className="vitals-grid">
        {selected.map((key) => {
          const info = vitalInfo[key];
          if (!info) return null;
          const value = vitals[key as keyof Vitals] as number;
          return (
            <VitalCard
              key={key}
              title={info.title}
              value={value}
              unit={info.unit}
              className={info.className}
            />
          );
        })}
      </div>
      <div className="waveforms-panel" ref={waveformContainerRef}>
        {waveformRows.map((wave) => (
          <div className="waveform-row" key={wave.id}>
            <small className="waveform-label">{wave.label}</small>
            <WaveformChart
              elementId={`${wave.id}_waveform`}
              beatData={wave.beatData}
              color={wave.color}
              height={95}
              easing="Power2.inOut"
              waveformType="ecg"
              width={waveformWidth}
              mmPerSecond={wave.mmPerSecond}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitorView;
