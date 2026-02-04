import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MonitorView from "./pages/monitorView";
import ValuesView from "./pages/controlVitalsView";
import NavbarNew from "./components/navbar/NavbarNew";
import { VitalsProvider } from "./contexts/vitalsContext";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <div className="app-header">
        <VitalsProvider>
          <Router>
            <NavbarNew isSessionActive={false} />

            <Routes>
              <Route path="/" element={<MonitorView />} />
              <Route path="/values" element={<ValuesView />} />
            </Routes>
          </Router>
        </VitalsProvider>
      </div>
    </div>
  );
};

export default App;
