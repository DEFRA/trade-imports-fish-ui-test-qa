import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { GuidancePage } from '#pages/importer/notification/guidance-page.js'

const { Given, When, Then } = createBdd(test)

Given('I open the guidance page', async ({ page }) => {
  await new GuidancePage(page).open()
})

When('I start the notification', async ({ page }) => {
  await new GuidancePage(page).startNow()
})

Then('the page heading is {string}', async ({ page }, heading) => {
  await expect(new GuidancePage(page).pageHeading()).toHaveText(heading)
})

Then('I am on the guidance page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/guidance$/)
})
