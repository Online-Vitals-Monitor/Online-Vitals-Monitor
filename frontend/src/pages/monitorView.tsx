import React, {useState} from 'react';
import VitalSlider from '../components/vitalSlider';

const MonitorView: React.FC = () => {
  //use state to track slide variables
  const [heartRate, setHeartRate] = useState<number>(65);
  const [respRate, setRespRate] = useState<number>(10);

  return (
    <div className='slider-containers'>
      <VitalSlider title="Heart Rate" step={1} min={30} max={180} currentVal={heartRate} onChange={setHeartRate} />
      <VitalSlider title="Respiratory Rate" step={1} min={0} max={12} currentVal={respRate} onChange={setRespRate} />
    </div>
  );
};

export default MonitorView;