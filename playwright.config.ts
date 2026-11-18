import { defineConfig } from "@playwright/test";

const url = process.env.VISUAL_URL;

export default defineConfig({
  testDir: "visual",
  testIgnore: "**/visual/rc/**",
  snapshotPathTemplate: `${process.env.VISUAL_SNAPSHOTS ?? "visual/baselines"}/{projectName}/{arg}{ext}`,
  outputDir: "visual/results",
  fullyParallel: true,
  workers: process.env.VISUAL_WORKERS
    ? Number(process.env.VISUAL_WORKERS)
    : process.env.CI
      ? 2
      : undefined,
  retries: 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 120_000,
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      stylePath: "visual/screenshot.css",
      scale: "device",
      threshold: 0.1,
      maxDiffPixels: 0
    }
  },
  use: {
    baseURL: url ?? "http://127.0.0.1:4173/",
    timezoneId: "UTC",
    locale: "en-US",
    deviceScaleFactor: 2,
    colorScheme: "light",
    launchOptions: {
      // Chrome picks subpixel or grayscale text per compositor layer, which shifts under load.
      args: ["--disable-lcd-text", "--disable-gpu", "--font-render-hinting=none"]
    }
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1706, height: 971 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } }
  ],
  webServer: url
    ? undefined
    : {
        command: "npm run visual:serve",
        url: "http://127.0.0.1:4173/visual.html",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000
      }
});
