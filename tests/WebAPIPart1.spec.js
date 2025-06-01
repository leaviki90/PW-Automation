import { test, expect, request } from '@playwright/test'
let token;
let orderId;

const loginPayload = { userEmail: "whatever@gmail.com", userPassword: "Welcome123*" }
const orderPayload = {
   orders: [
      {
         country: "Cuba",
         productOrderedId: "67a8dde5c0d3e6622a297cc8"
      }
   ]
}


test.beforeAll(async () => {
   const APIContext = await request.newContext();
   const loginResponse = await APIContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', { data: loginPayload })
   expect((loginResponse).ok()).toBeTruthy();
   const loginResponseJson = await loginResponse.json()
   token = loginResponseJson.token
   console.log("Token: ", token)

   const orderResponse = await APIContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
      data: orderPayload, headers: {
         'Authorization': token,
         'Content-Type': 'application/json'
      }
   })
   const orderResponseJson = await orderResponse.json()
   console.log(orderResponseJson)
   orderId = orderResponseJson.orders[0];
})



test('Place the order', async ({ page }) => {

   await page.addInitScript(value => {
      window.localStorage.setItem('token', value)
   }, token)

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
      if (orderId.includes(rowOrderID)) {
         await rows.nth(i).locator('button').first().click();
         break
      }

   }

   const orderIdDeatils = await page.locator('.col-title + div').textContent();
   await page.pause();
   expect(orderId.includes(orderIdDeatils)).toBeTruthy();
})


//verify if order created is showing up in history page
//Precondition - create order - 
