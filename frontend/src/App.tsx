import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MonitorView from "./pages/monitorView";
import ValuesView from "./pages/controlVitalsView";
import NavbarNew from "./components/navbar/NavbarNew";
import Homepage from "./pages/homepage/Homepage";
import { VitalsProvider } from "./contexts/vitalsContext";

import MonitorViewNew from "./pages/monitorViewNew";

import "./App.css";

const App = () => {
  const [sessionActive, setSessionActive] = useState(false);
  return (
    <>
      <div className="app">
        <div className="app-header">
          <VitalsProvider>
            <Router>
              <NavbarNew
                isSessionActive={sessionActive}
                setIsSessionActive={setSessionActive}
              />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/monitor" element={<MonitorView />} />
                <Route path="/values" element={<ValuesView />} />

                <Route path="/monitortest" element={<MonitorViewNew />} />
              </Routes>
            </Router>
          </VitalsProvider>
        </div>
      </div>
    </>
  );
};

export default App;
