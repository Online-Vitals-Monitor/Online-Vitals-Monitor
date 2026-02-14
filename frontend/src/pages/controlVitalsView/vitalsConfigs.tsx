import { Vitals } from "../../api/vitalsApi";

export interface PresetConfig {
  name: string;
  values: Partial<Vitals>;
}

export interface VitalConfig {
  key: keyof Vitals;
  title: string;
  step: number;
  min: number;
  max: number;
  unitConverter?: (value: number, etco2Unit: "kPa" | "mmHg") => number;
  unitDeconverter?: (displayValue: number, etco2Unit: "kPa" | "mmHg") => number;
}

export const presetConfigs: PresetConfig[] = [
  {
    name: "Reset Defaults",
    values: {
      heartRate: 60,
      respRate: 14,
      o2Saturation: 100,
      systolicBP: 120,
      diastolicBP: 80,
      eTCO2: 4.0,
    },
  },
  {
    name: "Shock",
    values: { heartRate: 140, respRate: 25, systolicBP: 80, diastolicBP: 60 },
  },
  { name: "Hypoxia", values: { respRate: 25, o2Saturation: 86 } },
  {
    name: "Increased ICP",
    values: {
      heartRate: 50,
      respRate: 10,
      systolicBP: 190,
      diastolicBP: 100,
    },
  },
  {
    name: "Zero",
    values: {
      heartRate: 0,
      respRate: 0,
      o2Saturation: 0,
      systolicBP: 0,
      diastolicBP: 0,
      eTCO2: 0,
    },
  },
];

export const vitalsConfig: VitalConfig[] = [
  {
    key: "heartRate",
    title: "Heart Rate",
    step: 1,
    min: 0,
    max: 250,
  },
  {
    key: "respRate",
    title: "Respiratory Rate",
    step: 1,
    min: 0,
    max: 60,
  },
  {
    key: "o2Saturation",
    title: "SpO2",
    step: 1,
    min: 0,
    max: 100,
  },
  {
    key: "systolicBP",
    title: "Systolic BP",
    step: 1,
    min: 0,
    max: 250,
  },
  {
    key: "diastolicBP",
    title: "Diastolic BP",
    step: 1,
    min: 0,
    max: 250,
  },
  {
    key: "eTCO2",
    title: "ETCO2",
    step: 0.1,
    min: 0,
    max: 20,
    unitConverter: (value: number, etco2Unit: "kPa" | "mmHg") =>
      etco2Unit === "kPa" ? value : Math.round(value * 7.5),
    unitDeconverter: (displayValue: number, etco2Unit: "kPa" | "mmHg") =>
      etco2Unit === "kPa" ? displayValue : displayValue / 7.5,
  },
];