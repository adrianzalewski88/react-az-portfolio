import { http, HttpResponse, delay } from "msw";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import { server } from "./mocks/server";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

function getCardTitles() {
  return screen.getAllByRole("article").map((article) =>
    within(article).getByRole("heading", { level: 2 }).textContent,
  );
}

describe("HomePage", () => {
  it("shows loading and then renders projects and categories", async () => {
    server.use(
      http.get(`${API_BASE_URL}/public/projects`, async () => {
        await delay(80);
        return HttpResponse.json({
          data: [
            {
              id: 1,
              slug: "az-portfolio",
              title: "AZ Portfolio",
              shortDescription: "A modern React portfolio.",
              body: "A full-stack portfolio built with React and Laravel.",
              featuredImage: "/images/az-portfolio.jpg",
              category: "React",
            },
            {
              id: 2,
              slug: "react-analytics",
              title: "React Analytics",
              shortDescription: "A React dashboard for analytics.",
              body: "A dashboard project.",
              featuredImage: "/images/react-analytics.jpg",
              category: "React",
            },
            {
              id: 3,
              slug: "cms-platform",
              title: "CMS Platform",
              shortDescription: "A Drupal content management project.",
              body: "A CMS project.",
              featuredImage: "/images/cms-platform.jpg",
              category: "Drupal",
            },
            {
              id: 4,
              slug: "api-integration",
              title: "API Integration",
              shortDescription: "A project connecting external services.",
              body: "An API integration project.",
              featuredImage: "/images/api-integration.jpg",
              category: "Other",
            },
          ],
        });
      }),
    );

    renderHomePage();

    expect(screen.getByText("Loading portfolio data...")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "AZ Portfolio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        if (!element || element.tagName !== "SPAN") {
          return false;
        }

        return (
          element.textContent?.replace(/\s+/g, " ").trim() ===
          "Showing 4 of 4 projects"
        );
      }),
    ).toBeInTheDocument();
  });

  it("searches titles and descriptions without case sensitivity", async () => {
    const user = userEvent.setup();
    renderHomePage();

    const search = await screen.findByRole("searchbox", {
      name: "Search projects",
    });

    await user.type(search, " MODERN ");

    expect(
      screen.getByRole("heading", { name: "AZ Portfolio" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "React Analytics" }),
      ).not.toBeInTheDocument();
    });

    await user.clear(search);
    await user.type(search, "external services");

    expect(
      await screen.findByRole("heading", { name: "API Integration" }),
    ).toBeInTheDocument();
  });

  it("filters by category and displays category counts", async () => {
    const user = userEvent.setup();
    renderHomePage();

    const reactButton = await screen.findByRole("button", {
      name: "React2",
    });

    expect(
      screen.getByRole("button", { name: "All Projects4" }),
    ).toBeInTheDocument();

    await user.click(reactButton);

    expect(reactButton).toHaveAttribute("aria-pressed", "true");

    await waitFor(() => {
      expect(getCardTitles()).toEqual([
        "AZ Portfolio",
        "React Analytics",
      ]);
    });
  });

  it("sorts by title and category", async () => {
    const user = userEvent.setup();
    renderHomePage();

    const sort = await screen.findByLabelText("Sort");

    await user.selectOptions(sort, "title-asc");
    expect(getCardTitles()).toEqual([
      "API Integration",
      "AZ Portfolio",
      "CMS Platform",
      "React Analytics",
    ]);

    await user.selectOptions(sort, "title-desc");
    expect(getCardTitles()).toEqual([
      "React Analytics",
      "CMS Platform",
      "AZ Portfolio",
      "API Integration",
    ]);

    await user.selectOptions(sort, "category-asc");
    expect(getCardTitles()).toEqual([
      "CMS Platform",
      "API Integration",
      "AZ Portfolio",
      "React Analytics",
    ]);
  });

  it("switches between grid and list presentation", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await screen.findByRole("heading", { name: "AZ Portfolio" });

    await user.click(screen.getByRole("button", { name: "List view" }));

    expect(screen.getAllByRole("article")[0]).toHaveClass(
      "portfolio-card--list",
    );

    await user.click(screen.getByRole("button", { name: "Grid view" }));

    expect(screen.getAllByRole("article")[0]).toHaveClass(
      "portfolio-card--grid",
    );
  });

  it("shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();
    renderHomePage();

    const search = await screen.findByRole("searchbox", {
      name: "Search projects",
    });
    await user.type(search, "no matching project");

    expect(
      await screen.findByRole("heading", {
        name: "The portfolio came up empty.",
      }),
    ).toBeInTheDocument();
  });

  it("shows an API error when portfolio loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(
      http.get(`${API_BASE_URL}/public/projects`, () => {
        return new HttpResponse("API unavailable", { status: 503 });
      }),
    );

    renderHomePage();

    expect(
      await screen.findByText(
        "Laravel API request failed: 503 API unavailable",
      ),
    ).toBeInTheDocument();
  });
});