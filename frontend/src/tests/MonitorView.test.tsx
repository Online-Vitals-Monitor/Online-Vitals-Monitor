import {render, screen} from "@testing-library/react";
import MonitorView from "../pages/monitorView";

test("renders Heart Rate card", () => {
  render(<MonitorView />);
  expect(screen.getByText(/Heart Rate bpm/i)).toBeInTheDocument();
});
