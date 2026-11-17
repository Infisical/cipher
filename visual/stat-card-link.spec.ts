import { expect, test } from "@playwright/test";

test("a linked StatCard keeps its link inside the card", async ({ page }) => {
  await page.goto("visual.html?page=stat-card&theme=light");
  const grid = page.getByTestId("linked-stat-cards");
  await expect(grid.locator('[data-slot="stat-card"]')).toHaveCount(4);
  const start = page.url();

  const box = (await grid.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height + 12);
  await page.getByRole("heading", { name: "Linked, framed and plain" }).click();
  expect(page.url()).toBe(start);

  await grid.getByRole("link", { name: "Total accounts" }).locator("..").click();
  await expect(page).toHaveURL(/#\/stat-card-linked\/accounts$/);
});
