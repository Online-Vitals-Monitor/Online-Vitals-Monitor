import React, {useState, useEffect} from 'react';



const MonitorView: React.FC = () => {

  useEffect(() => {
    document.title = 'Monitor'
  }, []);

  
  return <h1>Monitor Vitals</h1>;
};

export default MonitorView;