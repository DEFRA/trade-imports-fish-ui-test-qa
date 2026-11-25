import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { HomePage } from '#pages/importer/home-page.js'
import { TransportDetailsPage } from '#pages/importer/transport-details-page.js'

const { Given, When, Then } = createBdd(test)

async function startNewImport(page) {
  const homePage = new HomePage(page)
  await homePage.open()
  const guidancePage = await homePage.createNewImport()
  await guidancePage.startNow()
}

Given('I start a new import', async ({ page }) => {
  await startNewImport(page)
})

When('I start another new import', async ({ page }) => {
  await startNewImport(page)
})

When('I clear my cookies', async ({ context }) => {
  await context.clearCookies()
})

// Both tabs share one browser context, so they share the same session cookies
When('I start a new import in another tab', async ({ context }) => {
  await startNewImport(await context.newPage())
})

When(
  'I select the transport method {string} and save and continue in the other tab',
  async ({ context }, method) => {
    const transportDetailsPage = new TransportDetailsPage(context.pages()[1])
    await transportDetailsPage.select(method)
    await transportDetailsPage.saveAndContinue()
  }
)

When('I reopen the transport details page', async ({ page }) => {
  await new TransportDetailsPage(page).open()
})

When(
  'I select the transport method {string} and save and continue',
  async ({ page }, method) => {
    const transportDetailsPage = new TransportDetailsPage(page)
    await transportDetailsPage.select(method)
    await transportDetailsPage.saveAndContinue()
  }
)

When(
  'I save and continue without selecting a transport method',
  async ({ page }) => {
    await new TransportDetailsPage(page).saveAndContinue()
  }
)

Then('I am on the transport details page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/transport-details$/)
})

Then('I am on the consignment arrival details page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/consignment-arrival-details$/)
})

Then('the transport method {string} is selected', async ({ page }, method) => {
  await expect(new TransportDetailsPage(page).selected(method)).toBeChecked()
})

Then('no transport method is selected', async ({ page }) => {
  await expect(new TransportDetailsPage(page).selectedMethods()).toHaveCount(0)
})

Then('the field error says {string}', async ({ page }, message) => {
  await expect(new TransportDetailsPage(page).fieldError()).toContainText(
    message
  )
})

Then('the error summary says {string}', async ({ page }, message) => {
  await expect(new TransportDetailsPage(page).errorSummary()).toContainText(
    message
  )
})
