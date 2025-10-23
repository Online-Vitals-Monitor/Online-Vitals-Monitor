import React, {useState, useEffect} from 'react';
import { getVitals, updateVitals, Vitals } from '../api/vitalsApi';

import VitalSlider from '../components/vitalSlider';

const ControlVitalsView: React.FC = () => {
  const [vitals, setVitals] = useState<Vitals>({ heartRate: 0, respRate: 0 });

  useEffect(() => {
    document.title = 'Controller'

  fetchVitals();
  }, []);

  // gets vitals from back end
  const fetchVitals = async () => {
    const data = await getVitals();
    setVitals(data);
  };

  // works with slider values
  const handleHeartRateChange = async (value: number) => {
    setVitals((prev) => ({ ...prev, heartRate: value }));
    await updateVitals({ heartRate: value }); // send update to backend
  };

  const handleRespRateChange = async (value: number) => {
    setVitals((prev) => ({ ...prev, respRate: value }));
    await updateVitals({ respRate: value }); // send update to backend
  };


  return (
    <div className='slider-containers'>
      <VitalSlider title="Heart Rate" step={1} min={30} max={180} currentVal={vitals.heartRate} onChange={handleHeartRateChange} />
      <VitalSlider title="Respiratory Rate" step={1} min={0} max={12} currentVal={vitals.respRate} onChange={handleRespRateChange} />
    </div>
  );
};

export default ControlVitalsView;