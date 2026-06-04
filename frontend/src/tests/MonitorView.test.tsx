import { render, screen, waitFor } from "@testing-library/react";
import MonitorView from "@/pages/monitor/MonitorView";
import { vi } from "vitest";
import * as vitalsApi from "@/api/vitalsApi";

vi.mock("@/api/vitalsApi");

vi.mock("@/components/WaveformChart", () => ({
  default: () => <div data-testid="mock-waveform-chart" />,
}));

describe("MonitorView", () => {
  beforeEach(() => {
    vi.mocked(vitalsApi.getVitals).mockResolvedValue({
      heartRate: 80,
      respRate: 14,
      o2Saturation: 99,
      systolicBP: 120,
      diastolicBP: 80,
      eTCO2: 4.0,
    });
  });

  it("renders all waveform channel labels", () => {
    render(<MonitorView />);

    expect(screen.getByText("ECG")).toBeInTheDocument();
    expect(screen.getByText("RESP")).toBeInTheDocument();
    expect(screen.getByText("SpO2")).toBeInTheDocument();
    expect(screen.getByText("ETCO2")).toBeInTheDocument();
    expect(screen.getByText("NIBP")).toBeInTheDocument();
  });

  it("displays fetched heart rate value", async () => {
    render(<MonitorView />);

    await waitFor(() => {
      expect(screen.getByText("80")).toBeInTheDocument();
    });
  });
});
