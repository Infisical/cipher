import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

type Entry = { id: string; examples: { module: string }[] };

const catalog: Entry[] = JSON.parse(
  readFileSync(
    process.env.VISUAL_CATALOG ?? path.resolve(import.meta.dirname, "../site/src/catalog.json"),
    "utf8"
  )
);
const only = process.env.VISUAL_PAGES?.split(",");

for (const entry of catalog) {
  if (only && !only.includes(entry.id)) continue;
  for (const theme of ["light", "dark"]) {
    test(`${entry.id} ${theme}`, async ({ page }) => {
      await page.clock.setFixedTime(new Date("2026-06-15T17:00:00Z"));
      await page.goto(`visual.html?page=${entry.id}&theme=${theme}`);
      await page.waitForFunction(
        () => document.querySelector("main") && !document.querySelector("[data-visual-loading]"),
        undefined,
        { timeout: 30_000 }
      );
      await page.evaluate(() => document.fonts.ready);
      for (const example of await page.locator("[data-example]").all()) {
        const id = (await example.getAttribute("data-example"))!.replaceAll("/", "__");
        await expect.soft(example).toHaveScreenshot(`${id}--${theme}.png`);
      }
    });
  }
}
