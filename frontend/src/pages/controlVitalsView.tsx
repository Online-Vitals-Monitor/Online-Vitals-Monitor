import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import { getVitals, updateVitals, Vitals } from "../api/vitalsApi";
import {
  Box,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Backdrop,
  Drawer,
  Snackbar,
  Alert,
} from "@mui/material";
import VitalSlider from "../components/vitalSlider";

// Stylin
const valueStyle = {
  width: 70,
  textAlign: "center",
  userSelect: "none",
  fontWeight: "bold",
  fontSize: "1.2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ml: 3,
  minHeight: 50,
};

const valueBoxStyle = {
  minWidth: 120,
  bgcolor: "grey.300",
  ml: 2,
  mb: 1,
  px: 1,
  py: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  pointerEvents: "auto",
};

interface VitalControlProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
  step: number;
  min: number;
  max: number;
}

const VitalControl: React.FC<VitalControlProps> = memo(
  ({ title, value, onChange, onChangeCommitted, step, min, max }) => (
    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
  ),
);

const CurrentValueDisplay = memo(({ value }: { value: number }) => (
  <Box sx={valueBoxStyle}>
    <Paper sx={valueStyle}>{value}</Paper>
  </Box>
));

// Helper function to implement debouncing on sliders
export function useDebouncedCallback(
  callback: (...args: any[]) => void,
  delay: number,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function debouncedFunction(...args: any[]) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}

const ControlVitalsView: React.FC = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0,
    respRate: 0,
    o2Saturation: 0,
    systolicBP: 0,
    diastolicBP: 0,
    eTCO2: 0,
  });

  const [updateMode, setUpdateMode] = useState<"live" | "push">("live");
  const [pendingVitals, setPendingVitals] = useState<Vitals | null>(null);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [savedDiff, setSavedDiff] = useState<number | null>(null);
  const [etco2Unit, setEtco2Unit] = useState<"kPa" | "mmHg">("kPa");
  const etco2Max = etco2Unit === "kPa" ? 20 : 150;
  const [uiVitals, setUiVitals] = useState<Vitals>(vitals);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Preset values
  const presetConfigs = [
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

  useEffect(() => {
    document.title = "Controller";
    fetchVitals();
  }, []);

  useEffect(() => {
    // Ensure UI vitals mirror whatever set from API on mount
    setUiVitals(updateMode === "live" ? vitals : pendingVitals || vitals);
  }, [vitals, pendingVitals, updateMode]);

  // fetch vitals from API
  const fetchVitals = async () => {
    try {
      const data = await getVitals();
      setVitals(data);
      setPendingVitals(data);
      setErrorMessage(null);
    } catch (err) {
      console.error("Error fetching vitals:", err);
      setErrorMessage("Failed to load vitals. Please try again.");
    }
  };

  // Preset handler
  const handlePresetChange = (event: SelectChangeEvent) => {
    const newPreset = presetConfigs.find(
      (cfg) => cfg.name === event.target.value,
    );
    if (newPreset) {
      setVitals((prev) => ({ ...prev, ...newPreset.values }));
      if (updateMode === "push")
        setPendingVitals((prev) => ({
          ...(prev || vitals),
          ...newPreset.values,
        }));
      setSelectedPreset("");
    }
  };

  // Handler for vitals, adapts for live/push modes
  const handleVitalChange = (
    key: keyof Vitals,
    value: number,
    commit = false,
  ) => {
    let displayVal = value;
    if (key === "eTCO2") {
      displayVal = Math.round(value * 10) / 10;
    }

    const current = updateMode === "live" ? vitals : (pendingVitals ?? vitals);
    let updated = { ...uiVitals, [key]: displayVal };

    const min = 0,
      max = 250;
    if (key === "systolicBP") {
      if (current.diastolicBP !== 0) {
        const currentDiff = current.systolicBP - current.diastolicBP;
        updated.diastolicBP = Math.max(displayVal - currentDiff, min);
        if (updated.diastolicBP === 0) {
          setSavedDiff(currentDiff);
        }
      } else {
        if (savedDiff === null) {
          setSavedDiff(current.systolicBP - current.diastolicBP);
        }
        if (savedDiff !== null && displayVal > savedDiff) {
          updated.diastolicBP = Math.max(displayVal - savedDiff, min);
        } else {
          updated.diastolicBP = 0;
        }
      }
    }

    if (key === "diastolicBP") {
      if (displayVal >= updated.systolicBP) {
        updated.systolicBP = Math.min(displayVal + 1, max);
      }
      if (displayVal !== 0) {
        setSavedDiff(null);
      }
    }

    // Clamp both values between min and max
    updated.systolicBP = Math.min(Math.max(updated.systolicBP, min), max);
    updated.diastolicBP = Math.min(Math.max(updated.diastolicBP, min), max);

    setUiVitals(updated);

    if (commit) {
      if (updateMode === "live") {
        setVitals(updated);
        debouncedUpdateVitals(updated);
      } else {
        setPendingVitals(updated);
      }
    } else if (updateMode === "push") {
      setPendingVitals(updated);
    }
  };

  // Debouncing for sliders
  const debouncedUpdateVitals = useDebouncedCallback(
    useCallback(async (updated: Vitals) => {
      try {
        await updateVitals(updated);
        setSuccessMessage("Vitals updated successfully.");
        setErrorMessage(null);
      } catch (err) {
        console.error("Error updating vitals:", err);
        setErrorMessage("Failed to update vitals.");
      }
    }, []),
    500,
  );

  // Save handler for push mode
  const handleSaveClick = async () => {
    if (updateMode === "push" && pendingVitals) {
      try {
        await updateVitals(pendingVitals);
        setVitals(pendingVitals);
        setSuccessMessage("Vitals saved successfully.");
        setErrorMessage(null);
      } catch (err) {
        console.error("Error saving vitals:", err);
        setErrorMessage("Failed to save vitals. Please try again.");
      }
    }
  };
  const sliderValues = uiVitals;

  return (
    <Box sx={{ px: 4, py: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="left">
          New Values
        </Typography>

        <FormControl sx={{ minWidth: 250, maxWidth: 400, mx: "auto" }}>
          <InputLabel id="preset-select-label">
            Preset (applied immediately)
          </InputLabel>
          <Select
            labelId="preset-select-label"
            id="preset-select"
            value={selectedPreset}
            label="Preset (applied immediately)"
            onChange={handlePresetChange}
          >
            {presetConfigs.map((preset) => (
              <MenuItem key={preset.name} value={preset.name}>
                {preset.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" className="control-header-current">
          Current Values
        </Typography>
      </Box>

      {/* Vital Sliders */}
      <VitalControl
        title="Heart Rate"
        value={sliderValues.heartRate}
        onChange={(v) => handleVitalChange("heartRate", v)}
        onChangeCommitted={(v) => handleVitalChange("heartRate", v, true)}
        step={1}
        min={0}
        max={250}
      />
      <VitalControl
        title="Respiratory Rate"
        value={sliderValues.respRate}
        onChange={(v) => handleVitalChange("respRate", v)}
        onChangeCommitted={(v) => handleVitalChange("respRate", v, true)}
        step={1}
        min={0}
        max={60}
      />
      <VitalControl
        title="SpO2"
        value={sliderValues.o2Saturation}
        onChange={(v) => handleVitalChange("o2Saturation", v)}
        onChangeCommitted={(v) => handleVitalChange("o2Saturation", v, true)}
        step={1}
        min={0}
        max={100}
      />
      <VitalControl
        title="Systolic BP"
        value={sliderValues.systolicBP}
        onChange={(v) => handleVitalChange("systolicBP", v)}
        onChangeCommitted={(v) => handleVitalChange("systolicBP", v, true)}
        step={1}
        min={0}
        max={250}
      />
      <VitalControl
        title="Diastolic BP"
        value={sliderValues.diastolicBP}
        onChange={(v) => handleVitalChange("diastolicBP", v)}
        onChangeCommitted={(v) => handleVitalChange("diastolicBP", v, true)}
        step={1}
        min={0}
        max={250}
      />
      <VitalControl
        title={`ETCO2 (${etco2Unit})`}
        value={
          etco2Unit === "kPa"
            ? sliderValues.eTCO2
            : Math.round(sliderValues.eTCO2 * 7.5)
        }
        onChange={(value) => {
          const backendValue = etco2Unit === "kPa" ? value : value / 7.5;
          handleVitalChange("eTCO2", backendValue);
        }}
        onChangeCommitted={(value) => {
          const backendValue = etco2Unit === "kPa" ? value : value / 7.5;
          handleVitalChange("eTCO2", backendValue, true);
        }}
        step={etco2Unit === "kPa" ? 0.1 : 1}
        min={0}
        max={etco2Max}
      />

      {/* Toggle, Save Button, and Display Settings */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={updateMode}
          exclusive
          onChange={(_, v) => {
            if (v) {
              if (v === "push") {
                // When switching to push, reset pendingVitals to current live vitals
                setPendingVitals(vitals);
              }
              setUpdateMode(v);
            }
          }}
          aria-label="Update Mode"
        >
          <ToggleButton value="live" aria-label="Live updates">
            Live Updates
          </ToggleButton>
          <ToggleButton value="push" aria-label="Push updates">
            Push Updates
          </ToggleButton>
          <Button
            variant="contained"
            color="primary"
            disabled={updateMode === "live"}
            onClick={handleSaveClick}
            sx={{
              minWidth: 120,
              ml: 2,
              bgcolor: updateMode === "live" ? "grey.400" : "primary.main",
            }}
          >
            Save New Vitals
          </Button>
        </ToggleButtonGroup>

        {/* Display Menu button */}
        <Button
          variant="contained"
          sx={{ bgcolor: "grey.600", mt: 2, fontWeight: "bold" }}
          onClick={() => setDisplayMenuOpen(true)}
        >
          Open Display Settings
        </Button>

        {/* Backdrop (dimming layer) */}
        <Backdrop
          open={displayMenuOpen}
          sx={{ zIndex: (theme) => theme.zIndex.drawer - 1, color: "#fff" }}
          onClick={() => setDisplayMenuOpen(false)}
        />

        {/* Slide-in menu on the right */}
        <Drawer
          anchor="right"
          open={displayMenuOpen}
          onClose={() => setDisplayMenuOpen(false)}
          slotProps={{
            paper: {
              sx: { width: 300, p: 2, bgcolor: "background.paper" },
            },
          }}
        >
          <Typography variant="h6" mb={2}>
            Display Settings
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            ETCO₂ Units
          </Typography>
          <ToggleButtonGroup
            value={etco2Unit}
            exclusive
            onChange={(_, newVal) => {
              if (newVal) setEtco2Unit(newVal);
            }}
            aria-label="etco2-units"
            color="primary"
            size="small"
          >
            <ToggleButton value="kPa" aria-label="kPa">
              kPa
            </ToggleButton>
            <ToggleButton value="mmHg" aria-label="mmHg">
              mmHg
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            sx={{ mt: 3, bgcolor: "grey.300" }}
            onClick={() => setDisplayMenuOpen(false)}
          >
            Close Menu
          </Button>
        </Drawer>
      </Box>

      {errorMessage && (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
        >
          <Alert severity="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={() => setSuccessMessage(null)}
        >
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default ControlVitalsView;
