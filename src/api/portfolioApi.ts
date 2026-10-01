import type {
  PortfolioCategory,
  PortfolioProject,
} from "../types/portfolio";

import { getAccessToken } from "../auth/oauth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

/*
|--------------------------------------------------------------------------
| Generic API request
|--------------------------------------------------------------------------
*/

async function publicApiRequest<T>(
  endpoint: string,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Laravel API request failed: ${response.status} ${error}`,
    );
  }

  return response.json();
}

/*
|--------------------------------------------------------------------------
| Protected OAuth API request
|--------------------------------------------------------------------------
*/

async function protectedApiRequest<T>(
  endpoint: string,
): Promise<T> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error(
      "No Laravel access token is available. Please authenticate first.",
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Laravel protected API request failed: ${response.status} ${error}`,
    );
  }

  return response.json();
}

/*
|--------------------------------------------------------------------------
| Public Portfolio API
|--------------------------------------------------------------------------
*/

export async function getPortfolioProjects(): Promise<
  PortfolioProject[]
> {
  const response =
    await publicApiRequest<{
      data: PortfolioProject[];
    }>("/public/projects");

  return response.data;
}

export async function getPortfolioProject(
  slug: string,
): Promise<PortfolioProject> {
  const response =
    await publicApiRequest<{
      data: PortfolioProject;
    }>(
      `/public/projects/${encodeURIComponent(slug)}`,
    );

  return response.data;
}

export async function getPortfolioCategories(): Promise<
  PortfolioCategory[]
> {
  const response =
    await publicApiRequest<{
      data: PortfolioCategory[];
    }>("/public/categories");

  return response.data;
}

export async function getPortfolioCategory(
  slug: string,
): Promise<PortfolioCategory> {
  const response =
    await publicApiRequest<{
      data: PortfolioCategory;
    }>(
      `/public/categories/${encodeURIComponent(slug)}`,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Protected OAuth Demonstration API
|--------------------------------------------------------------------------
*/

export async function getProtectedPortfolioProjects(): Promise<
  PortfolioProject[]
> {
  const response =
    await protectedApiRequest<{
      data: PortfolioProject[];
    }>("/projects");

  return response.data;
}