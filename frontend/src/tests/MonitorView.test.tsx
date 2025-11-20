import {render, screen} from "@testing-library/react";
import MonitorView from "../pages/monitorView";
import { VitalsProvider } from "../contexts/vitalsContext";

test("renders Heart Rate card", () => {
  render(
  <VitalsProvider>
    <MonitorView />
  </VitalsProvider>
  );
  
  expect(screen.getByText(/Heart Rate bpm/i)).toBeInTheDocument();
});
