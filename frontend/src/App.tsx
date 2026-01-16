import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MonitorView from './pages/monitorView';
import ValuesView from './pages/controlVitalsView';
import Navbar from './components/Navbar';
import './App.css';

const App: React.FC = () => {
  return (
    <div style= {{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <Router>
        <Navbar/>
        <main style={{ 
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          position: 'relative', 
          overflow: 'hidden',
          minHeight: 0
        }}>
        <Routes>
          <Route path="/" element={<MonitorView />} />
          <Route path="/values" element={<ValuesView />} />
        </Routes>
        </main>
      </Router> 
    </div>
  );
}

export default App;
