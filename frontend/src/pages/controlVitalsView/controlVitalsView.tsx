import React, { useState, useEffect, useRef, useCallback } from "react";
import { getVitals, updateVitals, Vitals } from "../../api/vitalsApi";
import { useDebouncedCallback, useApiErrorHandler } from "./cvvHooks";
import { presetConfigs, vitalsConfig } from "./vitalsConfigs";
import VitalControl from "./vitalControl";
import "./controlVitalsView.css";
import {
  Box,
  Typography,
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

const ControlVitalsView: React.FC = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0,
    respRate: 0,
    o2Saturation: 0,
    systolicBP: 0,
    diastolicBP: 0,
    eTCO2: 0,
    sessionID: "",
  });

  const [updateMode, setUpdateMode] = useState<"live" | "push">("live");
  const [pendingVitals, setPendingVitals] = useState<Vitals | null>(null);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [etco2Unit, setEtco2Unit] = useState<"kPa" | "mmHg">("kPa");
  const etco2Max = etco2Unit === "kPa" ? 20 : 150;
  const [uiVitals, setUiVitals] = useState<Vitals>(vitals);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const vitalsRef = useRef(vitals);
  const pendingVitalsRef = useRef(pendingVitals);
  const updateModeRef = useRef(updateMode);

  const handleError = useApiErrorHandler(setErrorMessage);

  useEffect(() => {
    vitalsRef.current = vitals;
  }, [vitals]);

  useEffect(() => {
    pendingVitalsRef.current = pendingVitals;
  }, [pendingVitals]);

  useEffect(() => {
    updateModeRef.current = updateMode;
  }, [updateMode]);

  // fetch vitals from API
  const fetchVitals = useCallback(async () => {
    try {
      const data = await getVitals();
      setVitals(data);
      setPendingVitals(data);
      setErrorMessage(null);
    } catch (err) {
      handleError(err, "Failed to load vitals. Please try again.");
    }
  }, [handleError]);

  useEffect(() => {
    document.title = "Controller";
    fetchVitals();
  }, [fetchVitals]);

  useEffect(() => {
    // Ensure UI vitals mirror whatever set from API on mount
    setUiVitals(updateMode === "live" ? vitals : pendingVitals || vitals);
  }, [vitals, pendingVitals, updateMode]);

  // Preset handler
  const handlePresetChange = (event: SelectChangeEvent) => {
    const newPreset = presetConfigs.find(
      (cfg) => cfg.name === event.target.value,
    );
    if (!newPreset) return;

    setSelectedPreset("");

    setVitals((prev) => {
      const merged = { ...prev, ...newPreset.values };

      if (updateMode === "push") {
        setPendingVitals((prevPending) => ({
          ...(prevPending ?? prev),
          ...newPreset.values,
        }));
      } else {
        debouncedUpdateVitals(merged);
      }

      return merged;
    });
  };

  // Handler for onChange (during dragging) - only updates UI
  const handleVitalChange = useCallback((key: keyof Vitals, value: number) => {
    let displayVal = value;
    if (key === "eTCO2") {
      displayVal = Math.round(value * 10) / 10;
    }

    // During dragging, only update the single value being changed
    setUiVitals((prev) => ({ ...prev, [key]: displayVal }));
  }, []);

  // Debouncing for API calls
  const debouncedUpdateVitals = useDebouncedCallback(
    async (updated: Vitals) => {
      try {
        await updateVitals(updated);
        setErrorMessage(null);
      } catch (err) {
        handleError(err, "Failed to update vitals.");
      }
    },
    500,
  );

  // Handler for committed values (onChangeCommitted) - runs complex logic
  const handleVitalChangeCommitted = useCallback(
    (key: keyof Vitals, value: number) => {
      let displayVal = value;
      if (key === "eTCO2") {
        displayVal = Math.round(value * 10) / 10;
      }

      const currentMode = updateModeRef.current;
      const base =
        currentMode === "live"
          ? vitalsRef.current
          : (pendingVitalsRef.current ?? vitalsRef.current);

      let updated: Vitals = { ...base, [key]: displayVal };

      const min = 0;
      const max = 250;

      if (key === "systolicBP") {
        if (displayVal < base.diastolicBP) {
          updated.diastolicBP = displayVal;
        }
      } else if (key === "diastolicBP") {
        if (displayVal >= updated.systolicBP) {
          updated.systolicBP = Math.min(displayVal + 1, max);
        }
      }

      if (key === "systolicBP" || key === "diastolicBP") {
        updated.systolicBP = Math.min(Math.max(updated.systolicBP, min), max);
        updated.diastolicBP = Math.min(Math.max(updated.diastolicBP, min), max);
      }

      setUiVitals(updated);

      if (currentMode === "live") {
        setVitals(updated);
        debouncedUpdateVitals(updated);
      } else {
        setPendingVitals(updated);
      }
    },
    [debouncedUpdateVitals],
  );

  // Save handler for push mode
  const handleSaveClick = async () => {
    if (updateMode !== "push" || !pendingVitals) return;
    try {
      await updateVitals(pendingVitals);
      setVitals(pendingVitals);
      setErrorMessage(null);
    } catch (err) {
      handleError(err, "Failed to save vitals. Please try again.");
    }
  };

  const sliderValues = uiVitals;

  return (
    <Box className="control-vitals-root">
      {/* Header */}
      <Box className="control-vitals-header">
        <Typography variant="h5" className="control-vitals-header-title">
          New Values
        </Typography>

        <FormControl className="control-vitals-preset-form">
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

        <Typography variant="h6" className="control-vitals-header-current">
          Current Values
        </Typography>
      </Box>

      {/* Vital Sliders */}
      {vitalsConfig.map(
        ({ key, title, step, min, max, unitConverter, unitDeconverter }) => (
          <VitalControl
            key={key}
            title={`${title}${key === "eTCO2" ? ` (${etco2Unit})` : ""}`}
            value={
              unitConverter
                ? unitConverter(
                    sliderValues[key as keyof Vitals] as number,
                    etco2Unit,
                  )
                : (sliderValues[key as keyof Vitals] as number)
            }
            onChange={(value) =>
              handleVitalChange(
                key,
                unitDeconverter ? unitDeconverter(value, etco2Unit) : value,
              )
            }
            onChangeCommitted={(value) =>
              handleVitalChangeCommitted(
                key,
                unitDeconverter ? unitDeconverter(value, etco2Unit) : value,
              )
            }
            step={key === "eTCO2" ? (etco2Unit === "kPa" ? 0.1 : 1) : step}
            min={min}
            max={key === "eTCO2" ? etco2Max : max}
          />
        ),
      )}

      {/* Toggle, Save Button, and Display Settings */}
      <Box className="control-vitals-bottom">
        <div className="toggle-save-row">
          <ToggleButtonGroup
            color="primary"
            value={updateMode}
            exclusive
            onChange={(_, v) => {
              if (v) {
                if (v === "push") {
                  setPendingVitals(vitals);
                }
                setUpdateMode(v);
              }
            }}
            aria-label="Update Mode"
          >
            <ToggleButton value="live">Live Updates</ToggleButton>
            <ToggleButton value="push">Push Updates</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            color="primary"
            disabled={updateMode === "live"}
            onClick={handleSaveClick}
            className="control-vitals-save-btn"
          >
            Save New Vitals
          </Button>
        </div>

        <Button
          variant="contained"
          className="control-vitals-display-btn"
          onClick={() => setDisplayMenuOpen(true)}
        >
          Open Display Settings
        </Button>

        <Backdrop
          open={displayMenuOpen}
          sx={{ zIndex: (theme) => theme.zIndex.drawer - 1, color: "#fff" }}
          onClick={() => setDisplayMenuOpen(false)}
        />

        <Drawer
          anchor="right"
          open={displayMenuOpen}
          onClose={() => setDisplayMenuOpen(false)}
          slotProps={{
            paper: {
              className: "control-vitals-drawer-paper",
            },
          }}
        >
          <Typography variant="h6" className="control-vitals-drawer-title">
            Display Settings
          </Typography>

          <Typography
            variant="subtitle1"
            className="control-vitals-drawer-subtitle"
          >
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
            className="control-vitals-close-menu-btn"
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
    </Box>
  );
};

export default ControlVitalsView;
