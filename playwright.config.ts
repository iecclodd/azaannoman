import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 60_000,
  workers: 2,
  use: { baseURL: process.env.BASE_URL || "http://127.0.0.1:3100", headless: true },
  webServer: process.env.BASE_URL ? undefined : {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100", reuseExistingServer: !process.env.CI, timeout: 60_000,
  },
});
