import { test, expect } from "@playwright/test";

test("Visual Test", async ({ page }) => {
  await page.goto("https://google.com/");
  expect(await page.screenshot()).toMatchSnapshot(
    "landing.png"  //on first will fail cause there is no stored landing scsch
  );
});
