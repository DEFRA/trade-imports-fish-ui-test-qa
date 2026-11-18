import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { HomePage } from '#pages/inspector/home-page.js'

const { Given, Then } = createBdd(test)

Given('I am on the inspector home page', async ({ page }) => {
  await new HomePage(page).open()
})

Then('the inspector home page URL is shown', async ({ page }) => {
  await expect(page).toHaveURL(/\/$/)
})
