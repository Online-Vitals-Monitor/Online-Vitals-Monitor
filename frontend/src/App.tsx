import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MonitorView from './pages/monitorView';
import ValuesView from './pages/controlVitalsView';
import Navbar from './components/Navbar';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<MonitorView />} />
            <Route path="/values" element={<ValuesView />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
