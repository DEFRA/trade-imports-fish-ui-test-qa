import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { HomePage } from '#pages/importer/home-page.js'

const { Given, When, Then } = createBdd(test)

Given('I am on the importer home page', async ({ page }) => {
  await new HomePage(page).open()
})

When('I start a new import notification', async ({ page }) => {
  await new HomePage(page).startNewNotification()
})

Then('the page title is {string}', async ({ page }, title) => {
  await expect(page).toHaveTitle(title)
})
