import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CategoryFilter from "../src/components/CategoryFilter";
import PortfolioCard from "../src/components/PortfolioCard";
import PortfolioGrid from "../src/components/PortfolioGrid";
import { testCategories, testProjects } from "./fixtures";

describe("CategoryFilter", () => {
  it("reports selected categories and exposes the active state", async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();

    render(
      <CategoryFilter
        categories={testCategories}
        activeCategory="all"
        onCategoryChange={onCategoryChange}
        counts={{ react: 2, drupal: 1, other: 1 }}
        totalCount={4}
      />,
    );

    const reactButton = screen.getByRole("button", { name: "React2" });

    expect(
      screen.getByRole("button", { name: "All Projects4" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(reactButton);

    expect(onCategoryChange).toHaveBeenCalledWith("react");
    expect(reactButton).toHaveAttribute("aria-pressed", "false");
  });
});

describe("PortfolioGrid", () => {
  it("shows an empty state when there are no matching projects", () => {
    render(<PortfolioGrid projects={[]} />);

    expect(
      screen.getByRole("heading", {
        name: "The portfolio came up empty.",
      }),
    ).toBeInTheDocument();
  });

  it("renders cards that link to the matching project route", () => {
    render(
      <MemoryRouter>
        <PortfolioGrid projects={[testProjects[0]]} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /AZ Portfolio/ }),
    ).toHaveAttribute("href", "/projects/az-portfolio");
  });

  it("uses the placeholder image after an image load error", () => {
    render(
      <MemoryRouter>
        <PortfolioCard project={testProjects[0]} />
      </MemoryRouter>,
    );

    const image = screen.getByRole("img", { name: "AZ Portfolio" });
    fireEvent.error(image);

    expect(image).toHaveAttribute(
      "src",
      "/images/project-placeholder.jpg",
    );
  });
});