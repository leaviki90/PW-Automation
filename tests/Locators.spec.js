import {test, expect} from '@playwright/test'


test('Playwright Special locators', async({page}) => {
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    await page.getByPlaceholder('Password').fill('abc123');
    await page.getByLabel('Check me out if you Love IceCreams!').click();
    await page.getByLabel('Gender').selectOption('Female')
    await page.getByLabel('Employed').check()
    await page.getByRole('button', {name: 'Submit'}).click()
    await page.getByText('Success! The Form has been submitted successfully!.').isVisible();
    await page.getByRole('Link', {name: "Shop"}).click()
    await page.locator('app-card').filter({hasText: 'Nokia Edge'}).getByRole('button').click();
    


    


});