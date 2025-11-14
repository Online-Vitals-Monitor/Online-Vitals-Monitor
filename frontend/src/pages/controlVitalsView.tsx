import React, { useState, useEffect } from 'react';
import { getVitals, updateVitals, Vitals } from '../api/vitalsApi';
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Backdrop, Drawer } from '@mui/material';
import VitalSlider from '../components/vitalSlider';

// Styling
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

interface VitalControlProps {
  title: string; value: number; onChange: (value: number) => void; step: number; min: number; max: number;
}

const VitalControl: React.FC<VitalControlProps> = ({
  title, value, onChange, step, min, max, }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
    <VitalSlider
      title={title} step={step} min={min} max={max} currentVal={value} onChange={onChange}
    />
    <CurrentValueDisplay value={value} />
  </Box>
);

const CurrentValueDisplay = ({ value }: { value: number }) => (
  <Box sx={valueBoxStyle}>
    <Paper sx={valueStyle}>{value}</Paper>
  </Box>
);

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

  // Preset values
  const presetConfigs = [
    { name: 'Reset Defaults', values: { heartRate: 60, respRate: 14, o2Saturation: 100, systolicBP: 120, diastolicBP: 80, eTCO2: 4.0 } },
    { name: 'Shock', values: { heartRate: 140, respRate: 25, systolicBP: 80, diastolicBP: 60 } },
    { name: 'Hypoxia', values: { respRate: 25, o2Saturation: 86 } },
    { name: 'Increased ICP', values: { heartRate: 50, respRate: 10, systolicBP: 190, diastolicBP: 100 } },
    { name: 'Zero', values: { heartRate: 0, respRate: 0, o2Saturation: 0, systolicBP: 0, diastolicBP: 0, eTCO2: 0 } },
  ];
  const [selectedPreset, setSelectedPreset] = useState('');

  // Display menu
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);

  // BP difference
  const [savedDiff, setSavedDiff] = useState<number>(0);

  // ETCO2 units
  const [etco2Unit, setEtco2Unit] = useState<'kPa' | 'mmHg'>('kPa');
  const etco2Max = etco2Unit === 'kPa' ? 20 : 150;
  const etco2DisplayValue = etco2Unit === 'kPa' ? vitals.eTCO2 : Math.round(vitals.eTCO2 * 7.5);

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
      setVitals(prev => ({ ...prev, ...newPreset.values }));
      if (updateMode === 'push') setPendingVitals(prev => ({ ...(prev || vitals), ...newPreset.values }));
      setSelectedPreset('');
    }
  };

  // Handler for vitals, adapts for live/push modes
  const handleVitalChange = (key: keyof Vitals, value: number) => {
    if (key === 'eTCO2') {
    value = Math.round(value * 10) / 10; // Ensures one decimal digit
    }

    const current = updateMode === 'live' ? vitals : (pendingVitals ?? vitals);
    let updated = { ...current, [key]: value };

    const min = 0, max = 250
    if (key === 'systolicBP'){
      if (current.diastolicBP !== 0) {
        const currentDiff = current.systolicBP - current.diastolicBP;
        updated.diastolicBP = Math.max(value - currentDiff, min);
        if (updated.diastolicBP === 0) {
          setSavedDiff(currentDiff);
        }
      } else {
        if (savedDiff !== null && value > savedDiff) {
          updated.diastolicBP = Math.max(value - savedDiff, min);
        }
      }
    }

    if (key === 'diastolicBP'){
       if (value >= updated.systolicBP) {
        updated.systolicBP = Math.min(value + 1, max);
       }
    }

    if (updateMode === 'live') {
      setVitals(updated);
      updateVitals(updated);
    } else {
      setPendingVitals(updated);
    }
  };

  // Save handler for push mode
  const handleSaveClick = async () => {
    if (updateMode === 'push' && pendingVitals) {
      await updateVitals(pendingVitals);
      setVitals(pendingVitals);
    }
  };

  // values displayed depend on mode
  const sliderValues = updateMode === 'live' ? vitals : (pendingVitals || vitals);

  return (
    <Box sx={{ px: 4, py: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="left">
          New Values
        </Typography>

        <FormControl sx={{ minWidth: 250, maxWidth: 400, mx: 'auto' }}>
          <InputLabel id="preset-select-label">Preset (applied immediately)</InputLabel>
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

        <Typography variant="h6" fontWeight="bold" textAlign="right">
          Current Values
        </Typography>
      </Box>

      {/* Vital Sliders */}
      <VitalControl title="Heart Rate" value={sliderValues.heartRate} onChange={(v) => handleVitalChange('heartRate', v)} step={1} min={0} max={250} />
      <VitalControl title="Respiratory Rate" value={sliderValues.respRate} onChange={(v) => handleVitalChange('respRate', v)} step={1} min={0} max={60} />
      <VitalControl title="SpO2" value={sliderValues.o2Saturation} onChange={(v) => handleVitalChange('o2Saturation', v)} step={1} min={0} max={100} />
      <VitalControl title="Systolic BP" value={sliderValues.systolicBP} onChange={(v) => handleVitalChange('systolicBP', v)} step={1} min={0} max={250} />
      <VitalControl title="Diastolic BP" value={sliderValues.diastolicBP} onChange={(v) => handleVitalChange('diastolicBP', v)} step={1} min={0} max={250} />
      <VitalControl
        title={`ETCO2 (${etco2Unit})`}
        value={etco2DisplayValue}
        onChange={(value) => {
          const backendValue = etco2Unit === 'kPa' ? value : value / 7.5;
          handleVitalChange('eTCO2', backendValue);
        }}
        step={etco2Unit === 'kPa' ? 0.1 : 1}
        min={0}
        max={etco2Max}
      />

      {/* Toggle, Save Button, and Display Settings */}
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
          <Button
            variant="contained"
            color="primary"
            disabled={updateMode === 'live'}
            onClick={handleSaveClick}
            sx={{ minWidth: 120, ml: 2, bgcolor: updateMode === 'live' ? 'grey.400' : 'primary.main' }}
          >
            Save New Vitals
          </Button>
        </ToggleButtonGroup>

        {/* Display Menu button */}
        <Button
          variant="contained"
          sx={{ bgcolor: 'grey.600', mt: 2, fontWeight: 'bold' }}
          onClick={() => setDisplayMenuOpen(true)}
        >
          Open Display Settings
        </Button>

        {/* Backdrop (dimming layer) */}
        <Backdrop
          open={displayMenuOpen}
          sx={{ zIndex: (theme) => theme.zIndex.drawer - 1, color: '#fff' }}
          onClick={() => setDisplayMenuOpen(false)}
        />

        {/* Slide-in menu on the right */}
        <Drawer
          anchor="right"
          open={displayMenuOpen}
          onClose={() => setDisplayMenuOpen(false)}
          slotProps={{
            paper: {
              sx: { width: 300, p: 2, bgcolor: 'background.paper' },
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
          <Button sx={{ mt: 3, bgcolor: 'grey.300' }} onClick={() => setDisplayMenuOpen(false)}>
            Close Menu
          </Button>
        </Drawer>
      </Box>
    </Box>
  );
};



export default ControlVitalsView;