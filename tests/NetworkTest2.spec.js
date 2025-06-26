import { test, expect } from "@playwright/test";

test("Security test request intercept", async ({ page }) => {
  //login and reach orders page
  await page.goto("https://rahulshettyacademy.com/client");

  //locators
  const email = "whatever@gmail.com";
  const userEmail = page.locator("#userEmail");
  const userPassword = page.locator("#userPassword");
  const login = page.locator("#login");
  const products = page.locator(".card-body");
  const productTitles = page.locator(".card-body b");

  console.log(productTitles);

  //actions
  await userEmail.fill(email);
  await userPassword.fill("Welcome123*");
  await login.click();
  await productTitles.first().waitFor();
  await page.locator('button[routerlink*="myorders"]').click();


  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6854158d0e7068d3981et00l",
      })
  );
  await page.locator('button:has-text("View")').first().click();
  await expect(page.locator('p').last()).toHaveText("You are not authorize to view this order");
});
