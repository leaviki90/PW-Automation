import { test, expect } from '@playwright/test'


test.only('Login test', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client')
   
      //locators
      const userEmail = page.locator('#userEmail')
      const userPassword = page.locator('#userPassword')
      const login = page.locator('#login')
      const productTitles = page.locator('.card-body b')
      console.log(productTitles)

      //actions
      await userEmail.fill('whatever@gmail.com');
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

})