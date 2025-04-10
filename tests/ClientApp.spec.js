import { test, expect } from '@playwright/test'


test.only('Login test', async ({ page }) => {
   await page.goto('https://rahulshettyacademy.com/client')

   //locators
   const email = 'whatever@gmail.com';
   const userEmail = page.locator('#userEmail')
   const userPassword = page.locator('#userPassword')
   const login = page.locator('#login')
   const products = page.locator('.card-body');
   const productTitles = page.locator('.card-body b')
   const productName = 'ZARA COAT 3';
   console.log(productTitles)

   //actions
   await userEmail.fill(email);
   await userPassword.fill('Welcome123*')
   await login.click()
   //await page.waitForLoadState('networkidle') //can be flaky (networkidle)
   //wait for network to be idle (stable)


   //get title - assertion
   console.log(await page.title())
   await expect(page).toHaveTitle("Let's Shop")

   //get first element title
   //console.log(await productTitles.first().textContent())
   await productTitles.first().waitFor()
   console.log(await productTitles.allTextContents()) //if we use this method before textContent()
   //it will not fail but will return []
   //can be overrided with waitForLoadState('networkidle') before
   //another way: add waitFor() for locator (works only for single loc)

   //Zara Coat 3

   //count elements
   const count = await products.count()
   for (let i = 0; i < count; i++) {
      if (await products.nth(i).locator('b').textContent() === productName) {
         //add to cart
         await products.nth(i).locator('text=Add To Cart').click()
         break;
      }
   }
   await page.locator('[routerlink*="cart"]').click();
   await page.locator('.cart ul').waitFor();
   const bool = await page.locator('h3:has-text("ZARA COAT 3")').isVisible();
   expect(bool).toBeTruthy();
   await page.locator('text=Checkout').click();

   //fill the personal info
   await page.locator('.input.txt').nth(2).fill('1234');
   await page.locator('.input.txt').nth(2).fill('Leki Zmaj');

   //Shipping info
   await page.locator('[placeholder="Select Country"]').pressSequentially('yug')
   const dropdown = page.locator('section.ta-results');
   await dropdown.waitFor();
   const optionsCount = await dropdown.locator('button').count()
   for (let i = 0; i < optionsCount; i++) {
      const text = await dropdown.locator("button").nth(i).textContent()
      if (text === ' Yugoslavia') {
         //click on that option
         await dropdown.locator('button').nth(i).click();
         break;
      }
   }
   await expect(page.locator('.user__name label')).toHaveText(email);
   await page.locator('.action__submit').click()
   await expect(page.locator('.hero-primary')).toHaveText(" Thankyou for the order. ")
   const orderId = await page.locator('label.ng-star-inserted').textContent()
   console.log(orderId);


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
   expect(orderId.includes(orderIdDeatils)).toBeTruthy();
})