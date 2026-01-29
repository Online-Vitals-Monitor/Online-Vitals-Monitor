import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MonitorView from './pages/monitorView';
import ValuesView from './pages/controlVitalsView';
import SessionSelect from './pages/sessionSelect';
import Navbar from './components/Navbar';
import RequireSession from './components/RequireSession';
import { VitalsProvider } from './contexts/vitalsContext';
import { SessionProvider } from './contexts/sessionContext';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <SessionProvider>
          <VitalsProvider>
            <Router>
              <Navbar/>
              <Routes>
                <Route path="/session" element={<SessionSelect />} />
                <Route element={<RequireSession />}>
                  <Route path="/" element={<MonitorView />} />
                  <Route path="/values" element={<ValuesView />} />
                </Route>
              </Routes>
            </Router>
          </VitalsProvider>
        </SessionProvider>
      </header>
    </div>
  );
}

export default App;
