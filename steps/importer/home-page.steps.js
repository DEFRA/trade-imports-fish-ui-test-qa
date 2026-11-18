import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { HomePage } from '#pages/importer/home-page.js'

const { Given, When, Then } = createBdd(test)

Given('I am on the importer home page', async ({ page }) => {
  await new HomePage(page).open()
})

When('I create a new import', async ({ page }) => {
  await new HomePage(page).createNewImport()
})

Then('the page title is {string}', async ({ page }, title) => {
  await expect(page).toHaveTitle(title)
})
