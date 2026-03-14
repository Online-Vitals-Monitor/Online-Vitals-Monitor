import React, { useState, useEffect, useMemo, useRef, Fragment } from "react";
import "./monitorViewNew.css";
import { getVitals, Vitals } from "../../api/vitalsApi";
import WaveformChart from "../../components/WaveformChart";
import { useVitals } from "../../contexts/vitalsContext";
import VitalCard from "../../components/VitalCard";
import {
  generateBpWaveform,
  generateEcgWaveform,
  generateEtco2Waveform,
  generatePlethWaveform,
  generateRespWaveform,
} from "../../utils/waveforms";

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

  const { state } = useVitals(); //from context get array of selected vitals
  const selected: string[] = state?.selected ?? [];

  const fetchVitals = async () => {
    // from backend
    try {
      const data = await getVitals();
      setVitals(data);
    } catch (err) {
      console.error("Failed to fetch vitals:", err);
    }
  };

  useEffect(() => {
    document.title = "Monitor";
    fetchVitals();
    const interval = setInterval(fetchVitals, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  // measure layout elements (for fitting waveforms)
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 100 }); // default

  useEffect(() => {
    const computeDimensions = () => {
      const wrapper = waveformContainerRef.current;
      if (!wrapper) return;

      const containerHeight = wrapper.offsetHeight;
      const containerWidth = wrapper.offsetWidth;
      const calculatedRowHeight = containerHeight / 5 - 10;

      setDimensions({
        width: Math.max(240, wrapper.offsetWidth - 500), // 450 px for right column rn
        height: Math.max(50, calculatedRowHeight),
      });
    };

    computeDimensions();
    window.addEventListener("resize", computeDimensions);
    return () => window.removeEventListener("resize", computeDimensions);
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
      title: "ECG",
      value: vitals.heartRate || 0,
      unit: "BPM",
      beatData: ecgBeat,
      color: "#00ff4f", // Green
      mmPerSecond: 25,
    },
    {
      id: "resp",
      title: "RESP",
      value: vitals.respRate || 0,
      unit: "BrPM",
      beatData: respBeat,
      color: "#eaf01f", // Yellow
      mmPerSecond: 6.25,
    },
    {
      id: "pleth", // SpO2
      title: "SpO2",
      value: vitals.o2Saturation || 0,
      unit: "%",
      beatData: plethBeat,
      color: "#38d5ff", // Blue
      mmPerSecond: 12.5,
    },
    {
      id: "etco2",
      title: "ETCO2",
      value: vitals.eTCO2 || 0,
      unit: "kPa",
      beatData: etco2Beat,
      color: "#ffa26b", // Orange
      mmPerSecond: 6.25,
    },
    {
      id: "bp",
      title: "NIBP",
      value: `${vitals.systolicBP || 0}/${vitals.diastolicBP || 0}`,
      unit: "mmHg",
      beatData: bpBeat,
      color: "#FFFFFF",
      // color: "#ff5f7e", // Red
      mmPerSecond: 25,
    },
  ];
  return (
    <div className="monitor-grid" ref={waveformContainerRef}>
      {waveformRows.map((wave) => (
        <Fragment key={wave.id}>
          {/* LEFT COLUMN */}
          <div
            className="waveform-container"
            style={{
              gridArea: `wave-${wave.id}`,
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <WaveformChart
              elementId={`${wave.id}_waveform`}
              beatData={wave.beatData}
              color={wave.color}
              easing="Power2.inOut"
              waveformType="ecg"
              width={dimensions.width}
              height={dimensions.height}
              mmPerSecond={wave.mmPerSecond}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div
            className={`numerics-container numerics-${wave.id}`}
            style={{ color: wave.color, gridArea: `num-${wave.id}` }}
          >
            <div className="numerics-title" style={{ gridArea: "title" }}>
              {wave.title}
            </div>

            <span className="numerics-value" style={{ gridArea: "val" }}>
              {wave.value}
            </span>

            <span className="numerics-unit" style={{ gridArea: "unit" }}>
              {wave.unit}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default MonitorViewNew;
