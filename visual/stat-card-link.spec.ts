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

  for (const [value, target] of [
    ["1,284", "accounts"],
    ["3,902", "licenses"],
    ["7", "suspended"],
    ["12", "grace"]
  ]) {
    const text = grid.getByText(value, { exact: true });
    await text.scrollIntoViewIfNeeded();
    const cell = (await text.boundingBox())!;
    await page.mouse.click(cell.x + cell.width / 2, cell.y + cell.height / 2);
    await expect(page).toHaveURL(new RegExp(`#/stat-card-linked/${target}$`));
  }

  await grid.getByRole("link", { name: "12 new this week" }).click();
  await expect(page).toHaveURL(/#\/stat-card-linked\/new-accounts$/);
});
