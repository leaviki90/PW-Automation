import { test, expect } from '@playwright/test'


test.only('Browser Context Playwright test', async ({ browser }) => {


    //playwright code
    //chrome - plugins, cookies
    const context = await browser.newContext() //otvara fresh incognito window, no cookies
    //da bi dodali cookies koji su nam naophodni da bi nasa app radila, npr proxy, plugin
    //mozemo da ih dodamo u context
    //sacuvamo cookies koji nam trebaju u newContext da ne bi morali za svaki test od pocetka da dodajemo
    //ovo samo otvara browser (koji mu mi prosledimo)
    const page = await context.newPage() //na ovoj stranici unosimo nas url i krecemo da automatizujemo
   
    //await page.route('**/*.css', route => route.abort()); //will stop the call to reach the browser


    //locators
    const userName = page.locator('#username')
    const password = page.locator('#password')
    const signIn = page.locator('[type="submit"]')
    const cardTitles = page.locator('.card-body a')

    page.on('request', request=> console.log(request.url()))
    //how to catch failed requests
    page.on('response', response => console.log(response.url(), response.status()))
    //to see response and status
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

test('UI Controls', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
    //Locators
    const userName = page.locator('#username')
    const password = page.locator('#password')
    
    //radio buttons
    await page.locator('.checkmark').last().click();
    await expect(page.locator('.checkmark').last()).toBeChecked();
    console.log(await page.locator('.checkmark').last().isChecked());
    //popup
    //await page.locator('#okayBtn').click()
    //select el
    const dropdown = page.locator('select.form-control')
    await dropdown.selectOption('consult')

    //checkbox
    await page.locator('#terms').click()
    await expect(page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck();
    //one way
    await expect(page.locator('#terms')).not.toBeChecked();
    //second way
    expect(await page.locator('#terms').isChecked()).toBeFalsy();
    //await is inside cause we perform action under locator
    
    const documentLink = page.locator('[href*="documents-request"]');
    //check attribute
    await expect(documentLink).toHaveAttribute('class', 'blinkingText')

    //page.pause();
    const signIn = page.locator('[type="submit"]')
   

})


test('Child windows handling', async ({ browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage()
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
    const documentLink = page.locator('[href*="documents-request"]');

   const [newPage] = await Promise.all( //to be asynhronic
        [ //how to handle new page
            context.waitForEvent('page'), //this listens for new page
            //so we write it before clicking on new page link 
        
            documentLink.click()
        ]
    ) //kad treba neki koraci da se paralelno izvrse

    
    const text = await newPage.locator('[class="im-para red"]').textContent()
    //Please email us at mentor@rahulshettyacademy.com with below template to receive response 
    const textArray = text.split('@') //deli string na 2 dela od ovog znaka
    textArray[1] //we are taking second element, drugi deo stringa
    //rahulshettyacademy.com with below template to receive response
    const domain = textArray[1].split(' ')[0] //podeli na prvi prazan space i uzmi prvi deo
    //rahulshettyacademy.com
    console.log(domain);
    
    const userName = page.locator('#username')
    await page.locator('#username').fill(domain)
    console.log(await page.locator('#username').inputValue())
    await page.pause()
    

  

})






