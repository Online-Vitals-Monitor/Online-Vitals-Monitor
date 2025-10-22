import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MonitorView from './pages/monitorView';
import ValuesView from './pages/controlVitalsView';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <nav>
            <Link to="/">Monitor</Link> | <Link to="/values">Control Vitals</Link>
          </nav>
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
