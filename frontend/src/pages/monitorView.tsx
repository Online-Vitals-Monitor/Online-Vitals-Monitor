import React, {useEffect} from 'react';



const MonitorView: React.FC = () => {

  useEffect(() => {
    document.title = 'Monitor'
  }, []);

  // vital number display
  const heartRate = 70
  const respRate = 12

  return (
    <div className='container mt-4'>
      <div className='card mb-3'>
        <div className="card-body text-center">
          <h5 className="card-title">Heart Rate bpm</h5>
          <p className="card-text display-4">{heartRate}</p>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body text-center">
          <h5 className="card-title">Respiratory Rate</h5>
          <p className="card-text display-4">{respRate}</p>
        </div>
      </div>

    </div>
  )
};

export default MonitorView;