import { defineConfig, devices } from "@playwright/test";

/* Only tests/brand-regression.spec.ts lives here today — a real-browser
   check that a CSS var() fallback chain resolves the way it's supposed to.
   jsdom (the vitest suite in this repo) cannot cascade custom properties or
   resolve var(), so this is the only thing that can catch a regression of
   the --ib-light-* shadowing bug fixed in 1.0.1. See that test file's header
   comment for the bug this exists to keep fixed. */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
