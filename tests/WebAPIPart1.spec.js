import { test, expect, request } from '@playwright/test'
import { APIUtils } from './utils/APIUtils';
const loginPayload = { userEmail: "whatever@gmail.com", userPassword: "Welcome123*" }
const orderPayload = {
   orders: [
      {
         country: "Cuba",
         productOrderedId: "67a8dde5c0d3e6622a297cc8"
      }
   ]
}
let response;




test.beforeAll(async () => {
   const APIContext = await request.newContext();
   const apiUtils = new APIUtils(APIContext, loginPayload);
   response = await apiUtils.createOrder(orderPayload)
})



test('Place the order', async ({ page }) => {

   await page.addInitScript(value => {
      window.localStorage.setItem('token', value)
   }, response.token)

   await page.goto('https://rahulshettyacademy.com/client')
   console.log('Token u localStorage:', await page.evaluate(() => localStorage.getItem('token')))

   //get title - assertion
   console.log(await page.title())
   await expect(page).toHaveTitle("Let's Shop")


   const ordersBtn = page.locator('[routerlink*="myorders"]');
   await ordersBtn.first().click();

   await page.locator('tbody').waitFor();
   const rows = page.locator('tbody tr');

   for (let i = 0; i < await rows.count(); i++) {
      const rowOrderID = await rows.nth(i).locator('th').textContent()
      if (response.orderId.includes(rowOrderID)) {
         await rows.nth(i).locator('button').first().click();
         break
      }

   }


   const orderIdDeatils = await page.locator('.col-title + div').textContent();
   expect(response.orderId.includes(orderIdDeatils)).toBeTruthy();
})


