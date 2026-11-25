import { expect, test, type Locator } from "@playwright/test";

const ringDrawn = (locator: Locator) =>
  locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.outlineStyle !== "none" && style.outlineWidth !== "0px";
  });

test("clicking a tab focuses it without drawing a focus ring, and the keyboard still draws one", async ({
  page
}) => {
  await page.goto("visual.html?page=tabs&theme=light");
  const lists = page.getByRole("tablist");
  await expect(lists.first()).toBeVisible();
  for (let index = 0; index < (await lists.count()); index += 1) {
    const list = lists.nth(index);
    if (!(await list.isVisible())) continue;
    const inactive = list.locator('[role="tab"][data-state="inactive"]:not([disabled])').first();
    if (!(await inactive.count())) continue;
    const target = page.locator(`[id="${await inactive.getAttribute("id")}"]`);
    await target.scrollIntoViewIfNeeded();
    await target.click();
    await expect(target).toBeFocused();
    expect(await ringDrawn(target), "tablist " + index + " after a click").toBe(false);
  }
  const firstList = lists.first().getByRole("tab");
  await firstList.nth(0).click();
  await page.keyboard.press("ArrowRight");
  await expect(firstList.nth(1)).toBeFocused();
  await expect.poll(() => ringDrawn(firstList.nth(1))).toBe(true);
});
