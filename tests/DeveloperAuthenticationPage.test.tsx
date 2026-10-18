import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DeveloperAuthenticationPage from "../src/pages/DeveloperAuthenticationPage";
import { testProjects } from "./fixtures";

const mocks = vi.hoisted(() => ({
  clearAccessToken: vi.fn(),
  getAccessToken: vi.fn(),
  startOAuthLogin: vi.fn(),
  getProtectedPortfolioProjects: vi.fn(),
}));

vi.mock("../src/auth/oauth", () => ({
  clearAccessToken: mocks.clearAccessToken,
  getAccessToken: mocks.getAccessToken,
  startOAuthLogin: mocks.startOAuthLogin,
}));

vi.mock("../src/api/portfolioApi", () => ({
  getProtectedPortfolioProjects: mocks.getProtectedPortfolioProjects,
}));

function renderAuthenticationPage() {
  return render(
    <MemoryRouter>
      <DeveloperAuthenticationPage />
    </MemoryRouter>,
  );
}

describe("DeveloperAuthenticationPage", () => {
  beforeEach(() => {
    mocks.getAccessToken.mockReturnValue(null);
    mocks.getProtectedPortfolioProjects.mockResolvedValue(testProjects);
  });

  it("shows login and disables the protected request when unauthenticated", () => {
    renderAuthenticationPage();

    expect(screen.getByText("Not authenticated")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Authenticate with Laravel/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Test protected endpoint/ }),
    ).toBeDisabled();
  });

  it("starts OAuth when the user chooses to authenticate", async () => {
    const user = userEvent.setup();
    renderAuthenticationPage();

    await user.click(
      screen.getByRole("button", { name: /Authenticate with Laravel/ }),
    );

    expect(mocks.startOAuthLogin).toHaveBeenCalledTimes(1);
  });

  it("shows the protected API loading state and result", async () => {
    const user = userEvent.setup();
    mocks.getAccessToken.mockReturnValue("valid-token");

    let resolveRequest!: (projects: typeof testProjects) => void;
    mocks.getProtectedPortfolioProjects.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    renderAuthenticationPage();

    const requestButton = screen.getByRole("button", {
      name: /Test protected endpoint/,
    });
    await user.click(requestButton);

    expect(
      screen.getByRole("button", { name: /Requesting/ }),
    ).toBeDisabled();

    resolveRequest(testProjects);

    expect(
      await screen.findByText("4 projects returned"),
    ).toBeInTheDocument();
  });

  it("shows protected API errors", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.getAccessToken.mockReturnValue("valid-token");
    mocks.getProtectedPortfolioProjects.mockRejectedValue(
      new Error("Protected request failed"),
    );

    renderAuthenticationPage();

    await user.click(
      screen.getByRole("button", { name: /Test protected endpoint/ }),
    );

    expect(
      await screen.findByText("Protected request failed"),
    ).toBeInTheDocument();
  });

  it("signs out and resets the API result", async () => {
    const user = userEvent.setup();
    mocks.getAccessToken.mockReturnValue("valid-token");
    renderAuthenticationPage();

    await user.click(
      screen.getByRole("button", { name: /Test protected endpoint/ }),
    );
    expect(
      await screen.findByText("4 projects returned"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(mocks.clearAccessToken).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Not authenticated")).toBeInTheDocument();
    expect(screen.queryByText("4 projects returned")).not.toBeInTheDocument();
  });
});