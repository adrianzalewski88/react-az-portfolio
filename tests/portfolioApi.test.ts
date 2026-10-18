import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getPortfolioCategories,
  getPortfolioCategory,
  getPortfolioProject,
  getPortfolioProjects,
  getProtectedPortfolioProjects,
} from "../src/api/portfolioApi";
import { server } from "./mocks/server";
import { testCategories, testProjects } from "./fixtures";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe("portfolio API", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("returns the projects from the API data envelope", async () => {
    await expect(getPortfolioProjects()).resolves.toEqual(testProjects);
  });

  it("returns one project by slug", async () => {
    await expect(getPortfolioProject("az-portfolio")).resolves.toEqual(
      testProjects[0],
    );
  });

  it("URL-encodes project slugs", async () => {
    const slug = "folder/project & details";
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        HttpResponse.json({ data: testProjects[0] }),
      );

    await getPortfolioProject(slug);

    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/public/projects/${encodeURIComponent(slug)}`,
      expect.objectContaining({
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("returns the categories from the API data envelope", async () => {
    await expect(getPortfolioCategories()).resolves.toEqual(testCategories);
  });

  it("returns one category by slug", async () => {
    await expect(getPortfolioCategory("react")).resolves.toEqual(
      testCategories[0],
    );
  });

  it("rejects public requests with the HTTP status and response text", async () => {
    server.use(
      http.get(`${API_BASE_URL}/public/projects`, () => {
        return new HttpResponse("temporary outage", { status: 503 });
      }),
    );

    await expect(getPortfolioProjects()).rejects.toThrow(
      "Laravel API request failed: 503 temporary outage",
    );
  });

  it("does not call the protected endpoint when there is no token", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await expect(getProtectedPortfolioProjects()).rejects.toThrow(
      "No Laravel access token is available. Please authenticate first.",
    );

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends a bearer token to the protected endpoint", async () => {
    let authorizationHeader: string | null = null;

    sessionStorage.setItem("portfolio_access_token", "test-token");

    server.use(
      http.get(`${API_BASE_URL}/projects`, ({ request }) => {
        authorizationHeader = request.headers.get("Authorization");
        return HttpResponse.json({ data: testProjects });
      }),
    );

    await expect(getProtectedPortfolioProjects()).resolves.toEqual(
      testProjects,
    );
    expect(authorizationHeader).toBe("Bearer test-token");
  });

  it("surfaces protected endpoint errors", async () => {
    sessionStorage.setItem("portfolio_access_token", "expired-token");

    server.use(
      http.get(`${API_BASE_URL}/projects`, () => {
        return new HttpResponse("invalid token", { status: 401 });
      }),
    );

    await expect(getProtectedPortfolioProjects()).rejects.toThrow(
      "Laravel protected API request failed: 401 invalid token",
    );
  });
});