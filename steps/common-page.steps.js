import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { BasePage } from '#pages/base-page.js'

const { Then } = createBdd(test)

Then('the page heading is {string}', async ({ page }, heading) => {
  await expect(new BasePage(page).pageHeading()).toHaveText(heading)
})

Then('the error summary says {string}', async ({ page }, message) => {
  await expect(new BasePage(page).errorSummary()).toContainText(message)
})

// Only for pages with a single field error, because the check expects one matching element
Then('the field error says {string}', async ({ page }, message) => {
  await expect(new BasePage(page).fieldError()).toContainText(message)
})

Then(
  'the field errors say {string}, {string} and {string}',
  async ({ page }, first, second, third) => {
    await expect(new BasePage(page).fieldError()).toContainText([
      first,
      second,
      third
    ])
  }
)
