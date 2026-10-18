import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 15_000,
  expect: {
    timeout: 15_000,
  },
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_API_BASE_URL: "http://127.0.0.1:8000/api/v1",
      VITE_OAUTH_AUTHORIZE_URL:
        "http://127.0.0.1:8000/oauth/authorize",
      VITE_OAUTH_TOKEN_URL: "http://127.0.0.1:8000/oauth/token",
      VITE_OAUTH_CLIENT_ID: "az-portfolio-test",
      VITE_OAUTH_REDIRECT_URI:
        "http://127.0.0.1:4173/auth/callback",
    },
  },
});