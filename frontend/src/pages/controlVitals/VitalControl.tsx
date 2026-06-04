import React, { memo } from "react";
import { Box } from "@mui/material";
import VitalSlider from "../../components/vitalSlider";
import "./ControlVitalsView.css";

interface VitalControlProps {
  title: string;
  value: number;
  committedVal?: number;
  onChange: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
  step: number;
  min: number;
  max: number;
}

const VitalControl: React.FC<VitalControlProps> = memo(
  ({
    title,
    value,
    committedVal,
    onChange,
    onChangeCommitted,
    step,
    min,
    max,
  }) => (
    <Box className="vital-control-row">
      <VitalSlider
        title={title}
        step={step}
        min={min}
        max={max}
        currentVal={value}
        committedVal={committedVal}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
      />
    </Box>
  ),
);

export default VitalControl;
