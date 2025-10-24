import React, {useState, useEffect} from 'react';
import { getVitals, Vitals } from '../api/vitalsApi';

const MonitorView: React.FC = () => {
  const [vitals, setVitals] = useState<Vitals>({ heartRate: 0, respRate: 0 });

  useEffect(() => {
    document.title = 'Monitor'
    fetchVitals();
    const interval = setInterval(fetchVitals, 5000); // 5 secodns
    return () => clearInterval(interval);
  }, []);

  const fetchVitals = async () => {
    const data = await getVitals();
    setVitals(data);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Heart Rate bpm</h5>
              <p className="card-text display-4">{vitals.heartRate}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Respiratory Rate</h5>
              <p className="card-text display-4">{vitals.respRate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorView;