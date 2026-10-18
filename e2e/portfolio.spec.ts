import { expect, test } from "@playwright/test";
import { testCategories, testProjects } from "../tests/fixtures";

test.beforeEach(async ({ page }) => {
  await page.route("**/public/projects", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: testProjects }),
    }),
  );

  await page.route("**/public/categories", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: testCategories }),
    }),
  );
});

test("visitor can search, filter, and open a project", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "AZ Portfolio",
      exact: true,
    }),
  ).toBeVisible();

  const search = page.getByRole("searchbox", {
    name: "Search projects",
  });

  await search.fill("Analytics");
  await expect(
    page.getByRole("heading", { name: "React Analytics" }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(1);

  await search.fill("");
  await page.getByRole("button", { name: /React\s+2/ }).click();
  await expect(page.getByRole("article")).toHaveCount(2);

  
  await page.getByRole("link", { name: /AZ Portfolio/ }).click();

  await expect(page).toHaveURL(/\/projects\/az-portfolio$/);

  await expect(
    page.getByRole("heading", {
      name: "AZ Portfolio",
      exact: true,
    }),
  ).toBeVisible();

  await expect(page.getByText("Project overview")).toBeVisible();
});