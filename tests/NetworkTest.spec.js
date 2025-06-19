import { test, expect, request } from "@playwright/test";
import { APIUtils } from "./utils/APIUtils";
const loginPayload = {
  userEmail: "whatever@gmail.com",
  userPassword: "Welcome123*",
};
const orderPayload = {
  orders: [
    {
      country: "Cuba",
      productOrderedId: "67a8dde5c0d3e6622a297cc8",
    },
  ],
};
const fakePayloadOrders = { data: [], message: "No Orders" };
let response;

test.beforeAll(async () => {
  const APIContext = await request.newContext();
  const apiUtils = new APIUtils(APIContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test("Place the order", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client");
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      //intercepting the response - API response -> {pw fake response} browser -> render data on front end
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayloadOrders);
      route.fulfill({
        //send response back to browser

        response,
        body,
      });
    }
  );

  //get title - assertion
  await expect(page).toHaveTitle("Let's Shop");

  const ordersBtn = page.locator('button[routerlink*="myorders"]').click();

  await page.pause();

  console.log(await page.locator(".mt-4").textContent());
});
