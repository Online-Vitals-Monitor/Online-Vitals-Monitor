import React, {useState, useEffect} from 'react';

import VitalSlider from '../components/vitalSlider';

const ControlVitalsView: React.FC = () => {
  
  //use state to track slide variables
  const [heartRate, setHeartRate] = useState<number>(65);
  const [respRate, setRespRate] = useState<number>(10);

  useEffect(() => {
    document.title = 'Controller'
  }, []);

  return (
    <div className='slider-containers'>
      <VitalSlider title="Heart Rate" step={1} min={30} max={180} currentVal={heartRate} onChange={setHeartRate} />
      <VitalSlider title="Respiratory Rate" step={1} min={0} max={12} currentVal={respRate} onChange={setRespRate} />
    </div>
  );
};

export default ControlVitalsView;