import { test, expect } from '@playwright/test'


test('Browser Context Playwright test', async ({ browser }) => {


    //playwright code
    //chrome - plugins, cookies
    const context = await browser.newContext() //otvara fresh incognito window, no cookies
    //da bi dodali cookies koji su nam naophodni da bi nasa app radila, npr proxy, plugin
    //mozemo da ih dodamo u context
    //sacuvamo cookies koji nam trebaju u newContext da ne bi morali za svaki test od pocetka da dodajemo
    //ovo samo otvara browser (koji mu mi prosledimo)
    const page = await context.newPage() //na ovoj stranici unosimo nas url i krecemo da automatizujemo
   
    //locators
    const userName = page.locator('#username')
    const password = page.locator('#password')
    const signIn = page.locator('[type="submit"]')
    const cardTitles = page.locator('.card-body a')

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
    console.log(await page.title())
    await userName.fill('rahulshetty');
    await password.fill('learning');
    await signIn.click()
    console.log(await page.locator('[style*="block"]').textContent())
    await expect(page.locator('[style*="block"]')).toContainText('Incorrect')
    await userName.fill("")
    await userName.fill('rahulshettyacademy');
    await signIn.click()
    // console.log(await cardTitles.first().textContent())
    // console.log(await cardTitles.nth(1).textContent())
    const allTitles = await cardTitles.allTextContents()
    console.log(allTitles)
})


test('Page Playwright test', async ({ page }) => {
    await page.goto('https://google.com')
    //get title - assertion
    console.log(await page.title())
    await expect(page).toHaveTitle('Google')

})





