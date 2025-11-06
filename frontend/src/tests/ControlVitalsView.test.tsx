import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ControlVitalsView from "../pages/controlVitalsView";
import * as vitalsApi from "../api/vitalsApi";

jest.mock("../api/vitalsApi");

const getVitalsMock = vitalsApi.getVitals as jest.Mock;
const updateVitalsMock = vitalsApi.updateVitals as jest.Mock;

describe("ControlVitalsView", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Mock getVitals to return initial vitals data
    getVitalsMock.mockResolvedValue({
      heartRate: 60,
      respRate: 16,
      o2Saturation: 98,
      systolicBP: 120,
      diastolicBP: 80,
      eTCO2: 5,
    });

    // Mock updateVitals to resolve immediately
    updateVitalsMock.mockResolvedValue({});
  });

  it("renders received vitals correctly", async () => {
    render(<ControlVitalsView />);

    const heartRateSlider = await screen.findByRole("slider", { name: /Heart Rate/i });
    await waitFor(() => expect(heartRateSlider).toHaveValue("60"));

    const respRateSlider = await screen.findByRole("slider", { name: /Respiratory Rate/i });
    await waitFor(() => expect(respRateSlider).toHaveValue("16"));  // use the mocked value as string

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
      expect(updateVitalsMock).toHaveBeenCalledWith({ heartRate: 70 })
    );
  });

  // Optional: Add more tests for error handling, debounce timing, or other vitals similarly
});