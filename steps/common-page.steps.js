import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { BasePage } from '#pages/base-page.js'

const { Then } = createBdd(test)

Then('the page heading is {string}', async ({ page }, heading) => {
  await expect(new BasePage(page).pageHeading()).toHaveText(heading)
})
