import { expect, test } from "@playwright/test";

const pages = [
  "announcements",
  "dialog",
  "alert-dialog",
  "sheet",
  "popover",
  "dropdown-menu",
  "context-menu",
  "command-menu",
  "combobox",
  "select",
  "multi-select",
  "date-picker",
  "date-range-picker",
  "color-picker"
];

test.use({ launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] } });

for (const id of pages) {
  test(`${id} overlays fit their scroll box with classic scrollbars`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.goto(`visual.html?page=${id}&theme=light`);
    await expect(page.locator("[data-visual-loading]")).toHaveCount(0, { timeout: 30_000 });
    const triggers = page.locator(
      'main :is(button, [role="button"]):is([aria-haspopup], [aria-expanded="false"]), main [data-example] button:not([aria-pressed])'
    );
    const count = Math.min(await triggers.count(), 12);
    for (let index = 0; index < count; index += 1) {
      const trigger = triggers.nth(index);
      if (!(await trigger.isVisible()) || !(await trigger.isEnabled())) continue;
      await trigger.click({ timeout: 2_000 }).catch(() => undefined);
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper] > *'
          )
        ].flatMap((overlay) =>
          [overlay, ...overlay.querySelectorAll("*")].flatMap((element) => {
            const style = getComputedStyle(element);
            const x = element.scrollWidth - element.clientWidth;
            const y = element.scrollHeight - element.clientHeight;
            const scrolls = (value: string) => value === "auto" || value === "scroll";
            return (scrolls(style.overflowX) && x > 0 && x <= 12) ||
              (scrolls(style.overflowY) && y > 0 && y <= 12)
              ? [
                  `${(element as HTMLElement).dataset.slot ?? element.tagName} overflows by ${x}x${y}`
                ]
              : [];
          })
        )
      );
      expect.soft(overflow, `${id}, trigger ${index}`).toEqual([]);
      await page.keyboard.press("Escape");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
    }
  });
}
