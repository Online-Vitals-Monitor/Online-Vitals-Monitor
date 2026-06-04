import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Typography, Slider, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

/*Interface to pass in props for react-slider from @mui material ui 
https://mui.com/material-ui/react-slider/*/
interface VitalSliderProps {
  title: string;
  step: number; //value to decrease/increase slider by each step
  min: number; //min number range for slider
  max: number; //max number range for slider
  currentVal: number; //current value
  committedVal?: number;
  onChange: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
}

const VitalSlider: React.FC<VitalSliderProps> = ({
  title,
  step,
  min,
  max,
  currentVal,
  committedVal,
  onChange,
  onChangeCommitted,
}) => {
  const [inputVal, setInputVal] = useState(
    currentVal !== undefined && currentVal !== null
      ? currentVal.toString()
      : "",
  );
  const isDragging = useRef(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // keep text field in sync when currentVal changes externally
  useEffect(() => {
    if (isDragging.current) return;
    const strVal =
      currentVal !== undefined && currentVal !== null
        ? currentVal.toString()
        : "";
    setInputVal((prevInputVal) => {
      if (strVal !== prevInputVal) return strVal;
      return prevInputVal;
    });
  }, [currentVal]);

  //increment the button
  const handleIncrement = () => {
    //increase value by step and clamp it by max
    onChange(Math.min(currentVal + step, max));
  };

  //decrement the button
  const handleDecrement = () => {
    //decrease value by step and clamp it by min
    onChange(Math.max(currentVal - step, min));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInputVal(newInput);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      const parsed = parseFloat(newInput);
      if (!isNaN(parsed)) {
        let clamped = Math.min(Math.max(parsed, min), max);
        onChange(clamped);
        setInputVal(clamped.toString());
      }
    }, 1000);
  };

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          type="number"
          value={inputVal}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          sx={{
            width: 150,
            mr: 3,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#1f2937 !important",
            },
            input: { textAlign: "center" },
            "input::-webkit-outer-spin-button": { display: "none" },
            "input::-webkit-inner-spin-button": { display: "none" },
            "input[type=number]": { MozAppearance: "textfield" },
          }}
          slotProps={{ htmlInput: { min, max } }}
        />

        <Button
          variant="contained"
          color="error"
          onClick={handleDecrement}
          sx={{ minHeight: 50, minWidth: 55, p: 0 }}
        >
          <RemoveIcon />
        </Button>

        <Box
          sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mx: 2 }}
        >
          <Typography variant="h6" gutterBottom sx={{ textAlign: "left" }}>
            {title}:
          </Typography>
          <Slider
            aria-label={title}
            value={currentVal}
            onChange={(_, newValue) => {
              isDragging.current = true;
              setInputVal((newValue as number).toString());
              onChange(newValue as number);
            }}
            onChangeCommitted={(_, newValue) => {
              isDragging.current = false;
              onChangeCommitted && onChangeCommitted(newValue as number);
            }}
            valueLabelDisplay="auto"
            step={step}
            min={min}
            max={max}
          />
        </Box>

        <Button
          variant="contained"
          color="error"
          onClick={handleIncrement}
          sx={{ minHeight: 50, minWidth: 55, p: 0, ml: 2 }}
        >
          <AddIcon />
        </Button>

        <TextField
          type="number"
          value={(committedVal ?? currentVal).toString()}
          variant="outlined"
          size="small"
          sx={{
            width: 150,
            ml: 2,
            pointerEvents: "none",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(15, 23, 42, 0.75) !important",
            },
            input: {
              textAlign: "center",
              color: "#e5e7eb",
            },
            "input::-webkit-outer-spin-button": { display: "none" },
            "input::-webkit-inner-spin-button": { display: "none" },
            "input[type=number]": { MozAppearance: "textfield" },
          }}
          slotProps={{ htmlInput: { readOnly: true, min, max } }}
        />
      </Box>
    </Box>
  );
};

export default VitalSlider;
