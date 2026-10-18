import { http, HttpResponse } from "msw";
import { testCategories, testProjects } from "../fixtures";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const OAUTH_TOKEN_URL = import.meta.env.VITE_OAUTH_TOKEN_URL;

export const handlers = [
  http.get(`${API_BASE_URL}/public/projects`, () => {
    return HttpResponse.json({ data: testProjects });
  }),

  http.get(`${API_BASE_URL}/public/projects/:slug`, ({ params }) => {
    const project = testProjects.find(
      (item) => item.slug === String(params.slug),
    );

    return project
      ? HttpResponse.json({ data: project })
      : new HttpResponse("Project not found", { status: 404 });
  }),

  http.get(`${API_BASE_URL}/public/categories`, () => {
    return HttpResponse.json({ data: testCategories });
  }),

  http.get(`${API_BASE_URL}/public/categories/:slug`, ({ params }) => {
    const category = testCategories.find(
      (item) => item.slug === String(params.slug),
    );

    return category
      ? HttpResponse.json({ data: category })
      : new HttpResponse("Category not found", { status: 404 });
  }),

  http.get(`${API_BASE_URL}/projects`, () => {
    return HttpResponse.json({ data: testProjects });
  }),

  http.post(OAUTH_TOKEN_URL, () => {
    return HttpResponse.json({
      access_token: "mock-access-token",
      token_type: "Bearer",
    });
  }),
];