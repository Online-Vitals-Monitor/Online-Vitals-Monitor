import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./contexts/sessionContext";
import MonitorView from "./pages/monitorView";
import ValuesView from "./pages/controlVitalsView/controlVitalsView";
import NavbarNew from "./components/navbar/NavbarNew";
import Homepage from "./pages/homepage/Homepage";
import RequireSession from "./components/RequireSession";
import { VitalsProvider } from "./contexts/vitalsContext";

import MonitorViewNew from "./pages/monitor/monitorViewNew";

import "./App.css";

const App = () => {
  const [sessionActive, setSessionActive] = useState(false);
  return (
    <>
      <div className="app">
        <div className="app-header">
          <SessionProvider>
            <VitalsProvider>
              <Router>
                <NavbarNew
                  isSessionActive={sessionActive}
                  setIsSessionActive={setSessionActive}
                />
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route element={<RequireSession />}>
                    <Route path="/monitor" element={<MonitorView />} />
                    <Route path="/monitortest" element={<MonitorViewNew />} />
                    <Route path="/values" element={<ValuesView />} />
                  </Route>
                </Routes>
              </Router>
            </VitalsProvider>
          </SessionProvider>
        </div>
      </div>
    </>
  );
};

export default App;
