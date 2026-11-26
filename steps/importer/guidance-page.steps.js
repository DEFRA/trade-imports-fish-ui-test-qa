import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { GuidancePage } from '#pages/importer/guidance-page.js'

const { When, Then, Step } = createBdd(test)

Step('I open the guidance page', async ({ page }) => {
  await new GuidancePage(page).open()
})

When('I click Start now', async ({ page }) => {
  await new GuidancePage(page).startNow()
})

Then('I am on the guidance page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/guidance$/)
})
