import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider } from "../contexts/sessionContext";
import * as sessionApiModule from "../api/sessionApi";
import { vi } from "vitest";
import HeroSection from "@/pages/homepage/HeroSection";
vi.mock("@/pages/monitor/MonitorView", () => () => (
  <div data-testid="mock-monitor">Mock Monitor</div>
));

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("Frontend Sessions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedNavigate.mockReset();
  });

  const renderHero = () =>
    render(
      <MemoryRouter>
        <SessionProvider>
          <HeroSection />
        </SessionProvider>
      </MemoryRouter>,
    );

  it("creates a new session and shows session banner", async () => {
    const mockCreate = vi
      .spyOn(sessionApiModule.sessionApi, "createSession")
      .mockResolvedValue({ id: "TEST_SESSION_001" });

    renderHero();

    const createButton = screen.getByRole("button", {
      name: /create monitor session/i,
    });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText(/current session:/i)).toBeInTheDocument();
    expect(screen.getByText(/TEST_SESSION_001/i)).toBeInTheDocument();
    expect(mockedNavigate).toHaveBeenCalled();
  });

  it("shows validation error if trying to join without an ID", async () => {
    renderHero();

    fireEvent.click(
      screen.getByRole("button", { name: /join existing session/i }),
    );

    expect(
      await screen.findByText(/Please enter a session ID/i),
    ).toBeInTheDocument();
  });

  it("shows error when joining a session fails with API error", async () => {
    const mockJoin = vi
      .spyOn(sessionApiModule.sessionApi, "joinSession")
      .mockRejectedValue(new Error("Backend unavailable"));

    renderHero();

    fireEvent.change(screen.getByPlaceholderText(/existing session id/i), {
      target: { value: "ABC123" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /join existing session/i }),
    );

    expect(await screen.findByText(/Backend unavailable/i)).toBeInTheDocument();
    expect(mockJoin).toHaveBeenCalledWith("ABC123");
  });

  it("uses existing session context value if pre-set", async () => {
    renderHero();

    expect(await screen.findByText(/Current session:/i)).toBeInTheDocument();
    expect(screen.getByText(/test-session-123/i)).toBeInTheDocument();
  });
});
