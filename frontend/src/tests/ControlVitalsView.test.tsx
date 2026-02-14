import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ControlVitalsView from "../pages/controlVitalsView/controlVitalsView";
import * as vitalsApi from "../api/vitalsApi";

jest.mock("../api/vitalsApi");

const getVitalsMock = vitalsApi.getVitals as jest.Mock;
const updateVitalsMock = vitalsApi.updateVitals as jest.Mock;

const renderView = () => render(<ControlVitalsView />);

describe("ControlVitalsView", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    getVitalsMock.mockResolvedValue({
      heartRate: 60,
      respRate: 16,
      o2Saturation: 98,
      systolicBP: 120,
      diastolicBP: 80,
      eTCO2: 5,
    });

    updateVitalsMock.mockResolvedValue({});
  });

  it("renders received vitals correctly", async () => {
    render(<ControlVitalsView />);

    const heartRateSlider = await screen.findByRole("slider", { name: /Heart Rate/i });
    await waitFor(() => expect(heartRateSlider).toHaveValue("60"));

    const respRateSlider = await screen.findByRole("slider", { name: /Respiratory Rate/i });
    await waitFor(() => expect(respRateSlider).toHaveValue("16"));

    const spo2Slider = await screen.findByRole("slider", { name: /SpO2/i });
    await waitFor(() => expect(spo2Slider).toHaveValue("98"));

    const systolicBPslider = await screen.findByRole("slider", { name: /Systolic BP/i });
    await waitFor(() => expect(systolicBPslider).toHaveValue("120"));

    const diastolicBPslider = await screen.findByRole("slider", { name: /Diastolic BP/i });
    await waitFor(() => expect(diastolicBPslider).toHaveValue("80"));

    const etco2Slider = await screen.findByRole("slider", { name: /ETCO2/i });
    await waitFor(() => expect(etco2Slider).toHaveValue("5"));
  });

  it("calls updateVitals with correct value when slider changes", async () => {
    render(<ControlVitalsView />);

    // Wait for initial getVitals API call to complete
    await waitFor(() => expect(getVitalsMock).toHaveBeenCalled());

    // Find the Heart Rate slider (role="slider" with accessible label)
    const heartRateSlider = screen.getByRole("slider", { name: /Heart Rate/i });

    // Use act to handle state updates with debounce delay in your component
    await act(async () => {
      fireEvent.change(heartRateSlider, { target: { value: "70" } });
    });

    // Wait for updateVitals to be called with the correct argument
    await waitFor(() =>
      expect(updateVitalsMock).toHaveBeenCalledWith(expect.objectContaining({ heartRate: 70 }))
    );
  });

  it("enables and disables Save button as mode is toggled", async () => {
    render(<ControlVitalsView />);

    await waitFor(() => expect(getVitalsMock).toHaveBeenCalled());

    const saveButton = screen.getByRole("button", { name: /Save New Vitals/i });
    // Save should be disabled by default (live mode)
    expect(saveButton).toBeDisabled();

    // Switch to Push mode: Save should become enabled
    const pushButton = screen.getByRole("button", { name: /Push Updates/i });
    fireEvent.click(pushButton);
    expect(saveButton).toBeEnabled();

    // Toggle back to Live mode: Save should become disabled again
    const liveButton = screen.getByRole("button", { name: /Live Updates/i });
    fireEvent.click(liveButton);
    expect(saveButton).toBeDisabled();
  });

  // Parameterized test: HR spike in both modes (live/push)
  describe.each([
    { mode: "live", expectImmediateSave: true },
    { mode: "push", expectImmediateSave: false }
  ])("Heart Rate spike in %s mode", ({ mode, expectImmediateSave }) => {
    it(`spikes HR and updates ${expectImmediateSave ? "immediately" : "on save"}`, async () => {
      render(<ControlVitalsView />);

      await waitFor(() => expect(getVitalsMock).toHaveBeenCalled());

      // Switch to push
      if (mode === "push") {
        const pushButton = screen.getByRole("button", { name: /Push Updates/i });
        fireEvent.click(pushButton);
      }

      // Simulate spike: move Heart Rate slider to 140
      const heartRateSlider = screen.getByRole("slider", { name: /Heart Rate/i });
      await act(async () => {
        fireEvent.change(heartRateSlider, { target: { value: "140" } });
      });

      // New UI value should be present
      await waitFor(() => expect(heartRateSlider).toHaveValue("140"));

      if (expectImmediateSave) {
        // In live mode, API should be called immediately with HR 140
        await waitFor(() =>
          expect(updateVitalsMock).toHaveBeenCalledWith(expect.objectContaining({ heartRate: 140 }))
        );
      } else {
        // In push mode, not called yet
        expect(updateVitalsMock).not.toHaveBeenCalledWith(expect.objectContaining({ heartRate: 140 }));

        // Now save
        const saveButton = screen.getByRole("button", { name: /Save New Vitals/i });
        fireEvent.click(saveButton);

        // API now called with HR 140
        await waitFor(() =>
          expect(updateVitalsMock).toHaveBeenCalledWith(expect.objectContaining({ heartRate: 140 }))
        );
      }
    });
  });

});