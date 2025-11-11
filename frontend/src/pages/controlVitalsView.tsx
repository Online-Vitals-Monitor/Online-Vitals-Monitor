import React, { useState, useEffect, useRef } from 'react';
import { getVitals, updateVitals, Vitals } from '../api/vitalsApi';
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import VitalSlider from '../components/vitalSlider';

/* Styling */
const valueStyle = {
  width: 70,
  textAlign: 'center',
  userSelect: 'none',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ml: 3,
  minHeight: 50,
};

const valueBoxStyle = {
  minWidth: 120,
  bgcolor: 'grey.300',
  ml: 2,
  mb: 1,
  px: 1,
  py: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  pointerEvents: 'auto',
};

const ControlVitalsView: React.FC = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0,
    respRate: 0,
    o2Saturation: 0,
    systolicBP: 0,
    diastolicBP: 0,
    eTCO2: 0,
  });

  // Mode state 'live' or 'push'
  const [updateMode, setUpdateMode] = useState<'live' | 'push'>('live');
  // Local pending state for push updates
  const [pendingVitals, setPendingVitals] = useState<Vitals | null>(null);
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  // Preset values
  const presetConfigs = [
    { name: 'Reset Defaults', values: { heartRate: 60, respRate: 14, o2Saturation: 100, systolicBP: 120, diastolicBP: 80, eTCO2: 4.0 } },
    { name: 'Shock', values: { heartRate: 140, respRate: 25, systolicBP: 80, diastolicBP: 60 } },
    { name: 'Hypoxia', values: { respRate: 25, o2Saturation: 86 } },
    { name: 'Increased ICP', values: { heartRate: 50, respRate: 10, systolicBP: 190, diastolicBP: 100 } },
  ];
  const [selectedPreset, setSelectedPreset] = useState('');

  useEffect(() => {
    document.title = 'Controller';
    fetchVitals();
  }, []);

  // fetch vitals from API
  const fetchVitals = async () => {
    try {
      const data = await getVitals();
      setVitals(data);
      // Sync pendingVitals with API values if entering push mode
      setPendingVitals(data);
    } catch (err) {
      console.error('Error fetching vitals:', err);
    }
  };

  // Preset handler
  const handlePresetChange = (event: SelectChangeEvent) => {
    const newPreset = presetConfigs.find(cfg => cfg.name === event.target.value);
    if (newPreset) {
      // Merge only the preset fields into the current vitals
      setVitals(prev => ({ ...prev, ...newPreset.values }));
      if (updateMode === 'push') setPendingVitals(prev => ({ ...(prev || vitals), ...newPreset.values }));
      setSelectedPreset('');
    }
  };

  // handlers for each vital, adapts for both modes
  const handleVitalChange = (key: keyof Vitals, value: number) => {
    if (key === 'eTCO2') {
    value = Math.round(value * 10) / 10; // Ensures one decimal digit
    }
    if (updateMode === 'live') {
      setVitals(prev => ({ ...prev, [key]: value }));
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
      updateTimeout.current = setTimeout(() => {
        updateVitals({ [key]: value });
      }, 400);
    } else {
      setPendingVitals(prev => prev ? { ...prev, [key]: value } : { ...vitals, [key]: value });
    }
  };

  // Save handler for push mode
  const handleSaveClick = async () => {
    if (updateMode === 'push' && pendingVitals) {
      await updateVitals(pendingVitals);
      setVitals(pendingVitals); // show updated values
    }
  };

  const CurrentValueDisplay = ({ value }: { value: number }) => (
    <Box sx={valueBoxStyle}>
      <Paper sx={valueStyle}>{value}</Paper>
    </Box>
  );

  // values displayed depend on mode
  const sliderValues = updateMode === 'live' ? vitals : (pendingVitals || vitals);

  return (
    <Box sx={{ px: 4, py: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="left">New Values</Typography>

        <FormControl sx={{ minWidth: 250, maxWidth: 400, mx: 'auto' }}>
          <InputLabel id="preset-select-label">Preset (applied immediately)</InputLabel>
          <Select
            labelId="preset-select-label"
            id="preset-select"
            value={selectedPreset}
            label="Preset (applied immediately)"
            onChange={handlePresetChange}
          >
            {presetConfigs.map(preset => (
              <MenuItem key={preset.name} value={preset.name}>{preset.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" fontWeight="bold" textAlign="right">Current Values</Typography>
      </Box>

      {/* Vital sliders - inefficient code but the sliders break when using other methods*/}
      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <VitalSlider title="Heart Rate" step={1} min={0} max={250} currentVal={sliderValues.heartRate} onChange={(v) => handleVitalChange('heartRate', v)} />
        <CurrentValueDisplay value={vitals.heartRate} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <VitalSlider title="Respiratory Rate" step={1} min={0} max={60} currentVal={sliderValues.respRate} onChange={(v) => handleVitalChange('respRate', v)} />
        <CurrentValueDisplay value={vitals.respRate} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <VitalSlider title="SpO2" step={1} min={0} max={100} currentVal={sliderValues.o2Saturation} onChange={(v) => handleVitalChange('o2Saturation', v)} />
        <CurrentValueDisplay value={vitals.o2Saturation} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <VitalSlider title="Systolic BP" step={1} min={0} max={250} currentVal={sliderValues.systolicBP} onChange={(v) => handleVitalChange('systolicBP', v)} />
        <CurrentValueDisplay value={vitals.systolicBP} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <VitalSlider title="Diastolic BP" step={1} min={0} max={250} currentVal={sliderValues.diastolicBP} onChange={(v) => handleVitalChange('diastolicBP', v)} />
        <CurrentValueDisplay value={vitals.diastolicBP} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <VitalSlider title="ETCO2" step={0.1} min={0} max={20} currentVal={sliderValues.eTCO2} onChange={(v) => handleVitalChange('eTCO2', v)} />
        <CurrentValueDisplay value={vitals.eTCO2} />
      </Box>

      {/* Toggle and Save Button Section */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <ToggleButtonGroup
          color="primary"
          value={updateMode}
          exclusive
          onChange={(_, v) => {
            if (v) {
              if (v === 'push') {
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
        </ToggleButtonGroup>
        <Button
          variant="contained"
          color="primary"
          disabled={updateMode === "live"}
          onClick={handleSaveClick}
          sx={{ minWidth: 120, bgcolor: updateMode === 'live' ? 'grey.400' : 'primary.main' }}
        >
          Save New Vitals 
        </Button>
      </Box>
    </Box>
  );
};


export default ControlVitalsView;