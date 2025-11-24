import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MonitorView from './pages/monitorView';
import ValuesView from './pages/controlVitalsView';
import Navbar from './components/Navbar';
import { VitalsProvider } from './contexts/vitalsContext';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <VitalsProvider>
          <Router>
            <Navbar/>
            <Routes>
              <Route path="/" element={<MonitorView />} />
              <Route path="/values" element={<ValuesView />} />
            </Routes>
          </Router>
        </VitalsProvider>
      </header>
    </div>
  );
}

export default App;
