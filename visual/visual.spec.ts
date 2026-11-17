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
      await page.clock.install({ time: new Date("2026-06-15T17:00:00Z") });
      await page.goto(`visual.html?page=${entry.id}&theme=${theme}`);
      await expect(page.locator("main")).toBeAttached({ timeout: 30_000 });
      await expect(page.locator("[data-visual-loading]")).toHaveCount(0, { timeout: 30_000 });
      const settle = () =>
        page.evaluate(async () => {
          for (let turn = 0; turn < 3; turn += 1)
            await new Promise((resolve) => {
              const channel = new MessageChannel();
              channel.port1.onmessage = resolve;
              channel.port2.postMessage(null);
            });
        });
      const markup = () => page.evaluate(() => document.querySelector("main")!.innerHTML);
      // Fake time only moves in fixed steps, so timer-driven demos land on the same frame every run.
      // Real-time work (fonts, ResizeObserver) can still arrive late, so step again until the page
      // stops changing or the cap is reached.
      let previous = "";
      for (let round = 0; round < 6; round += 1) {
        await page.waitForTimeout(round === 0 ? 500 : 250);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.fonts]
              .filter((font) => font.status === "loading")
              .map((font) => font.loaded.catch(() => undefined))
          );
        });
        await settle();
        for (let elapsed = 0; elapsed < 2_000; elapsed += 100) {
          await page.clock.runFor(100);
          await settle();
        }
        const current = await markup();
        if (current === previous) break;
        previous = current;
      }
      for (const example of await page.locator("[data-example]").all()) {
        const id = (await example.getAttribute("data-example"))!.replaceAll("/", "__");
        await expect.soft(example).toHaveScreenshot(`${id}--${theme}.png`);
      }
    });
  }
}
