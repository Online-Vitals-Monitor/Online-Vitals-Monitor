import React, { memo } from "react";
import { Box, Paper } from "@mui/material";
import VitalSlider from "../../components/vitalSlider";
import "./controlVitalsView.css";

interface VitalControlProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
  step: number;
  min: number;
  max: number;
}

interface CurrentValueDisplayProps {
  value: number;
}

const CurrentValueDisplay: React.FC<CurrentValueDisplayProps> = memo(
  ({ value }) => (
    <Box className="vital-value-box">
      <Paper className="vital-value">{value}</Paper>
    </Box>
  )
);

const VitalControl: React.FC<VitalControlProps> = memo(
  ({ title, value, onChange, onChangeCommitted, step, min, max }) => (
    <Box className="vital-control-row">
      <VitalSlider
        title={title}
        step={step}
        min={min}
        max={max}
        currentVal={value}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
      />
      <CurrentValueDisplay value={value} />
    </Box>
  )
);

export default VitalControl;