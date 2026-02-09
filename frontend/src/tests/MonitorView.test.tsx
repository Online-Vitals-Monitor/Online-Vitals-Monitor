import { render, screen, waitFor } from '@testing-library/react';
import MonitorView from '../pages/monitorView';
import { VitalsProvider } from '../contexts/vitalsContext';
import * as vitalsApi from '../api/vitalsApi';

// mock so we're not polling from the true API
jest.mock('../api/vitalsApi');

describe('MonitorView', () => {
  it('renders Heart Rate card with data', async () => {
    // fake data to try
    const mockVitals = {
      heartRate: 72,
      respRate: 18,
      o2Saturation: 98,
      systolicBP: 120,
      diastolicBP: 80,
      eTCO2: 35
    };

    (vitalsApi.getVitals as jest.Mock).mockResolvedValue(mockVitals);
    render(
      <VitalsProvider>
        <MonitorView />
      </VitalsProvider>
    );

    // verify heart rate card
    expect(screen.getByText(/Heart Rate/i)).toBeInTheDocument();
    await waitFor(() => { // for async load
      expect(screen.getByText('72')).toBeInTheDocument();
    });
  });
});