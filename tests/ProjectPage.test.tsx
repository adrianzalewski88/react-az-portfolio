import { http, HttpResponse } from "msw";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectPage from "../src/pages/ProjectPage";
import { server } from "./mocks/server";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function renderProjectPage(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/projects/${slug}`]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProjectPage", () => {
  it("renders project details and same-category related projects", async () => {
    renderProjectPage("az-portfolio");

    expect(
      await screen.findByRole("heading", { name: "AZ Portfolio" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Project overview")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /React Analytics/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /CMS Platform/ }),
    ).not.toBeInTheDocument();
  });

  it("shows a not-found state for an unknown slug", async () => {
    renderProjectPage("unknown-project");

    expect(
      await screen.findByRole("heading", { name: "Project not found." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Back to portfolio/ }),
    ).toHaveAttribute("href", "/#projects");
  });

  it("shows the not-found state when the API fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(
      http.get(`${API_BASE_URL}/public/projects`, () => {
        return new HttpResponse("API unavailable", { status: 503 });
      }),
    );

    renderProjectPage("az-portfolio");

    expect(
      await screen.findByRole("heading", { name: "Project not found." }),
    ).toBeInTheDocument();
  });
});