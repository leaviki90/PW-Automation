import {test} from '@playwright/test'


test('Browser Context Playwright test', async ({browser}) => {
   //playwright code
   //chrome - plugins, cookies
   const context = await browser.newContext() //otvara fresh incognito window, no cookies
   //da bi dodali cookies koji su nam naophodni da bi nasa app radila, npr proxy, plugin
   //mozemo da ih dodamo u context
   //sacuvamo cookies koji nam trebaju u newContext da ne bi morali za svaki test od pocetka da dodajemo
   //ovo samo otvara browser (koji mu mi prosledimo)
   const page = await context.newPage() //na ovoj stranici unosimo nas url i krecemo da automatizujemo
   await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
})


test('Page Playwright test', async ({page}) => {
    await page.goto('https://google.com')
 })
