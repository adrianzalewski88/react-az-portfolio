import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthCallbackPage from "../src/pages/AuthCallbackPage";

const oauthMocks = vi.hoisted(() => ({
  exchangeCodeForToken: vi.fn(),
}));

vi.mock("../src/auth/oauth", () => oauthMocks);

function renderCallback(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="/developer/authentication"
          element={<p>Authentication destination</p>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AuthCallbackPage", () => {
  beforeEach(() => {
    oauthMocks.exchangeCodeForToken.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the OAuth provider error", () => {
    renderCallback("/auth/callback?error=access_denied");

    expect(
      screen.getByText("Authentication failed: access_denied"),
    ).toBeInTheDocument();
    expect(oauthMocks.exchangeCodeForToken).not.toHaveBeenCalled();
  });

  it("shows an error when the callback has no code", () => {
    renderCallback("/auth/callback");

    expect(
      screen.getByText(
        "Authentication failed: No authorization code received.",
      ),
    ).toBeInTheDocument();
    expect(oauthMocks.exchangeCodeForToken).not.toHaveBeenCalled();
  });

  it("exchanges the code and redirects after success", async () => {
    oauthMocks.exchangeCodeForToken.mockResolvedValue("access-token");

    vi.useFakeTimers();

    renderCallback("/auth/callback?code=valid-code");

    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByText("Authentication successful."),
    ).toBeInTheDocument();

    expect(
      oauthMocks.exchangeCodeForToken,
    ).toHaveBeenCalledWith("valid-code");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    expect(
      screen.getByText("Authentication destination"),
    ).toBeInTheDocument();
  });

  it("displays token exchange failures", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    oauthMocks.exchangeCodeForToken.mockRejectedValue(
      new Error("Token exchange failed"),
    );

    renderCallback("/auth/callback?code=bad-code");

    expect(
      await screen.findByText("Token exchange failed"),
    ).toBeInTheDocument();
  });
});