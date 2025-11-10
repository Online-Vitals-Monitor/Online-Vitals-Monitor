import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Typography, Slider, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

/*Interface to pass in props for react-slider from @mui material ui 
 https://mui.com/material-ui/react-slider/*/
interface vitalSliderProps {
  title: string;
  step: number; //value to decrease/increase slider by each step
  min: number; //min number range for slider
  max: number; //max number range for slider
  currentVal: number; //current value
  onChange: (value: number) => void;
  //parent callback when slider changes
}

const VitalSlider: React.FC<vitalSliderProps> = ({
  title,
  step,
  min,
  max,
  currentVal,
  onChange,
}) => {
  const [inputVal, setInputVal] = useState(
    currentVal !== undefined && currentVal !== null
      ? currentVal.toString()
      : "",
  );
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // keep text field in sync when currentVal changes externally
  useEffect(() => {
    const strVal =
      currentVal !== undefined && currentVal !== null
        ? currentVal.toString()
        : "";
    setInputVal((prevInputVal) => {
      if (strVal !== prevInputVal) {
        return strVal;
      }
      return prevInputVal; // no change, so no re-render
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
    setInputVal(newInput); // always update textbox immediately

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      const parsed = parseFloat(newInput);
      if (!isNaN(parsed)) {
        const clamped = Math.min(Math.max(parsed, min), max);
        onChange(clamped); // update slider value/state
        setInputVal(clamped.toString()); // forcibly reset input text to clamped value
      }
    }, 1000);
  };

  /* return */
  return (
    <Box sx={{ width: 600, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}:
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          type="number"
          value={inputVal}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          sx={{
            width: 100,
            mr: 3,
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

        <Slider
          aria-label={title}
          value={currentVal}
          onChange={(_, newValue) => onChange(newValue as number)}
          valueLabelDisplay="auto"
          step={step}
          min={min}
          max={max}
          sx={{ mx: 2 }}
        />

        <Button
          variant="contained"
          color="error"
          onClick={handleIncrement}
          sx={{ minHeight: 50, minWidth: 55, p: 0 }}
        >
          <AddIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default VitalSlider;
