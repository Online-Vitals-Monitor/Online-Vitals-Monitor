import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ControlVitalsView from "../pages/controlVitalsView/controlVitalsView";
import * as vitalsApi from "../api/vitalsApi";

jest.mock("../api/vitalsApi");

const getVitalsMock = vitalsApi.getVitals as jest.Mock;
const updateVitalsMock = vitalsApi.updateVitals as jest.Mock;

const defaultVitals = {
  heartRate: 60,
  respRate: 16,
  o2Saturation: 98,
  systolicBP: 120,
  diastolicBP: 80,
  eTCO2: 5,
};

const renderView = () => render(<ControlVitalsView />);

const setupWithVitals = async () => {
  const utils = renderView();
  await waitFor(() => expect(getVitalsMock).toHaveBeenCalled());
  return utils;
};

const switchToPushMode = () => {
  const pushButton = screen.getByRole("button", { name: /Push Updates/i });
  fireEvent.click(pushButton);
};

describe("ControlVitalsView", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getVitalsMock.mockResolvedValue(defaultVitals);
    updateVitalsMock.mockResolvedValue({});
  });

  it("renders received vitals correctly", async () => {
    await setupWithVitals();

    const expectations: Array<{ label: RegExp; value: string }> = [
      { label: /Heart Rate/i, value: String(defaultVitals.heartRate) },
      { label: /Respiratory Rate/i, value: String(defaultVitals.respRate) },
      { label: /SpO2/i, value: String(defaultVitals.o2Saturation) },
      { label: /Systolic BP/i, value: String(defaultVitals.systolicBP) },
      { label: /Diastolic BP/i, value: String(defaultVitals.diastolicBP) },
      { label: /ETCO2/i, value: String(defaultVitals.eTCO2) },
    ];

    for (const { label, value } of expectations) {
      const slider = await screen.findByRole("slider", { name: label });
      await waitFor(() => expect(slider).toHaveValue(value));
    }
  });

  it("calls updateVitals with correct value when slider changes", async () => {
    await setupWithVitals();

    const heartRateSlider = screen.getByRole("slider", { name: /Heart Rate/i });

    await act(async () => {
      fireEvent.change(heartRateSlider, { target: { value: "70" } });
    });

    await waitFor(() =>
      expect(updateVitalsMock).toHaveBeenCalledWith(
        expect.objectContaining({ heartRate: 70 })
      )
    );
  });

  it("renders Save button only in push mode", async () => {
    await setupWithVitals();

    expect(
      screen.queryByRole("button", { name: /Save New Vitals/i })
    ).not.toBeInTheDocument();

    switchToPushMode();

    expect(
      screen.getByRole("button", { name: /Save New Vitals/i })
    ).toBeInTheDocument();

    const liveButton = screen.getByRole("button", { name: /Live Updates/i });
    fireEvent.click(liveButton);

    expect(
      screen.queryByRole("button", { name: /Save New Vitals/i })
    ).not.toBeInTheDocument();
  });

  describe.each([
    { mode: "live", expectImmediateSave: true },
    { mode: "push", expectImmediateSave: false },
  ])("Heart Rate spike in %s mode", ({ mode, expectImmediateSave }) => {
    it(`spikes HR and updates ${expectImmediateSave ? "immediately" : "on save"}`, async () => {
      await setupWithVitals();

      if (mode === "push") {
        switchToPushMode();
      }

      const heartRateSlider = screen.getByRole("slider", { name: /Heart Rate/i });

      await act(async () => {
        fireEvent.change(heartRateSlider, { target: { value: "140" } });
      });

      await waitFor(() => expect(heartRateSlider).toHaveValue("140"));

      if (expectImmediateSave) {
        await waitFor(() =>
          expect(updateVitalsMock).toHaveBeenCalledWith(
            expect.objectContaining({ heartRate: 140 })
          )
        );
      } else {
        expect(updateVitalsMock).not.toHaveBeenCalledWith(
          expect.objectContaining({ heartRate: 140 })
        );

        const saveButton = screen.getByRole("button", { name: /Save New Vitals/i });
        fireEvent.click(saveButton);

        await waitFor(() =>
          expect(updateVitalsMock).toHaveBeenCalledWith(
            expect.objectContaining({ heartRate: 140 })
          )
        );
      }
    });
  });
});