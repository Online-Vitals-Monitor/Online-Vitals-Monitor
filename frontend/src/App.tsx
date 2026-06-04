import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SessionProvider } from "@/contexts/sessionContext";
import ControlVitalsView from "@/pages/controlVitals/ControlVitalsView";
import NavbarNew from "@/components/navbar/NavbarNew";
import Homepage from "@/pages/homepage/Homepage";
import About from "@/pages/about/About";
import RequireSession from "@/components/RequireSession";
import { VitalsProvider } from "@/contexts/vitalsContext";
import MonitorView from "@/pages/monitor/MonitorView";
import "./App.css";

const App = () => {
  // const [sessionActive, setSessionActive] = useState(false);
  return (
    <>
      <div className="app">
        <div className="app-header">
          <VitalsProvider>
            <SessionProvider>
              <Router>
                {/* <NavbarNew
                  isSessionActive={sessionActive}
                  setIsSessionActive={setSessionActive}
                /> */}
                <NavbarNew />
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/about" element={<About />} />
                  <Route element={<RequireSession />}>
                    <Route path="/monitor" element={<MonitorView />} />
                    <Route
                      path="/monitortest"
                      element={<Navigate to="/monitor" replace />}
                    />
                    <Route path="/values" element={<ControlVitalsView />} />
                  </Route>
                </Routes>
              </Router>
            </SessionProvider>
          </VitalsProvider>
        </div>
      </div>
    </>
  );
};

export default App;
