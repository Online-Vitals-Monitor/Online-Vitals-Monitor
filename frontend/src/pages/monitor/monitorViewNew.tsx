import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  Fragment,
  useCallback,
} from "react";
import "./monitorViewNew.css";
import { getVitals, Vitals } from "../../api/vitalsApi";
import { useParams } from "react-router-dom";
import { useSession } from "../../contexts/sessionContext";
import WaveformChart from "../../components/WaveformChart";
// import { useVitals } from "../../contexts/vitalsContext";
// import VitalCard from "../../components/VitalCard";
import {
  generateBpWaveform,
  generateEcgWaveform,
  generateEtco2Waveform,
  generatePlethWaveform,
  generateRespWaveform,
} from "../../utils/waveforms";

//map of keys for vital cards
// const vitalInfo: Record<
//   string,
//   { title: string; unit?: string; className?: string }
// > = {
//   heartRate: { title: "Heart Rate", unit: "bpm" },
//   respRate: { title: "Respiratory Rate", unit: "rpm" },
//   o2Saturation: { title: "Oxygen Saturation", unit: "%" },
//   systolicBP: { title: "Systolic BP", unit: "mmHg" },
//   diastolicBP: { title: "Diastolic BP", unit: "mmHg" },
//   eTCO2: { title: "ETCO2", unit: "mmHg" },
// };

const MonitorViewNew = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0,
    respRate: 0,
    o2Saturation: 0,
    systolicBP: 0,
    diastolicBP: 0,
    eTCO2: 0,
    sessionID: "",
  });

  const { publicID: paramID } = useParams<{ publicID: string }>();
  const { session } = useSession();
  const publicID = paramID ?? session?.publicID;

  // const { state } = useVitals(); //from context get array of selected vitals
  // const selected: string[] = state?.selected ?? [];

  const fetchVitals = useCallback(async () => {
    if (!publicID) return;
    try {
      const data = await getVitals(publicID);
      setVitals(data);
    } catch (err) {
      console.error("Failed to fetch vitals:", err);
    }
  }, [publicID]);

  useEffect(() => {
    if (!publicID) return;
    document.title = "Monitor";
    fetchVitals();
    const interval = setInterval(fetchVitals, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, [publicID, fetchVitals]);

  // measure layout elements (for fitting waveforms)
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const waveformMeasureRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 100 }); // default

  useEffect(() => {
    const computeDimensions = () => {
      const cell = waveformMeasureRef.current;
      if (!cell) return;
      const { width, height } = cell.getBoundingClientRect();

      setDimensions({
        width: Math.max(180, Math.floor(width)),
        height: Math.max(48, Math.floor(height)),
      });
    };

    computeDimensions();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(computeDimensions)
        : null;

    if (resizeObserver) {
      if (waveformContainerRef.current)
        resizeObserver.observe(waveformContainerRef.current);
      if (waveformMeasureRef.current) {
        resizeObserver.observe(waveformMeasureRef.current);
      }
    }

    window.addEventListener("resize", computeDimensions);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", computeDimensions);
    };
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

  //  toggle function for full screen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      waveformContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // double click puts it in full screen
  return (
    <div
      className="monitor-grid"
      ref={waveformContainerRef}
      onDoubleClick={toggleFullScreen}
    >
      {/* Add a full screen button */}
      <button
        className="fullscreen-btn"
        onClick={toggleFullScreen}
        title="Toggle Fullscreen"
      >
        ⛶
      </button>

      {waveformRows.map((wave) => (
        <Fragment key={wave.id}>
          {/* LEFT COLUMN */}
          <div
            className="waveform-container"
            ref={wave.id === "ecg" ? waveformMeasureRef : undefined}
            style={{ gridArea: `wave-${wave.id}` }}
          >
            <WaveformChart
              elementId={`${wave.id}_waveform`}
              beatData={wave.beatData}
              color={wave.color}
              // easing="Power2.inOut"
              waveformType="ecg"
              width={dimensions.width}
              height={dimensions.height} // CHANGED THIS LINE
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
