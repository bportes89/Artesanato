import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_WEB_SERVER
    ? undefined
    : {
        command: "npm run dev -- --port 3000",
        port: 3000,
        reuseExistingServer: !process.env.CI,
      },
});

