import { expect, test, type Page } from "@playwright/test";

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

const triggerSelector =
  'main :is(button, [role="button"]):is([aria-haspopup], [aria-expanded="false"]), main [data-example] button:not([aria-pressed]), main input[role="combobox"]';
const overlaySelector =
  '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper] > *';

async function load(page: Page, id: string) {
  await page.goto(`visual.html?page=${id}&theme=light`);
  await expect(page.locator("main")).toBeAttached({ timeout: 30_000 });
  await expect(page.locator("[data-visual-loading]")).toHaveCount(0, { timeout: 30_000 });
}

test.use({ launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] } });

for (const id of pages) {
  test(`${id} overlays fit their scroll box with classic scrollbars`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    test.setTimeout(300_000);
    await load(page, id);
    const triggers = page.locator(triggerSelector);
    const overlays = page.locator(overlaySelector);
    const count = await triggers.count();
    expect(count, `${id} has overlay triggers`).toBeGreaterThan(0);
    let opened = 0;
    for (let index = 0; index < count; index += 1) {
      if (index > 0) await load(page, id);
      const trigger = triggers.nth(index);
      if (!(await trigger.isVisible()) || !(await trigger.isEnabled())) continue;
      await overlays.evaluateAll((elements) =>
        elements.forEach((element) => element.setAttribute("data-seen", ""))
      );
      await trigger
        .click({ timeout: 2_000, button: id === "context-menu" ? "right" : "left" })
        .catch(() => undefined);
      await page.waitForTimeout(400);
      if (
        (await page
          .locator(overlaySelector.replaceAll(",", ":not([data-seen]),") + ":not([data-seen])")
          .count()) > 0
      )
        opened += 1;
      const overflow = await overlays.evaluateAll((elements) =>
        elements.flatMap((overlay) =>
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
    }
    expect(opened, `${id} opened an overlay`).toBeGreaterThan(0);
  });
}
