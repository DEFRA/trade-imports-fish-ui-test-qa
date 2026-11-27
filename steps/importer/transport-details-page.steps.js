import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { HomePage } from '#pages/importer/home-page.js'
import { TransportDetailsPage } from '#pages/importer/transport-details-page.js'

const { Given, When, Then } = createBdd(test)

// playwright-bdd ignores the keyword, so Given steps also work after When, Then or And
Given('I start a new import', async ({ page }) => {
  await new HomePage(page).startNewImport()
})

When('I clear my cookies', async ({ context }) => {
  await context.clearCookies()
})

// Both tabs share one browser context, so they share the same session cookies
When('I start a new import in another tab', async ({ context, tabs }) => {
  tabs.other = await context.newPage()
  await new HomePage(tabs.other).startNewImport()
})

When(
  'I select the transport method {string} and save and continue in the other tab',
  async ({ tabs }, method) => {
    await new TransportDetailsPage(tabs.other).selectAndSave(method)
  }
)

Given('I reopen the transport details page', async ({ page }) => {
  await new TransportDetailsPage(page).open()
})

When('I select the transport method {string}', async ({ page }, method) => {
  await new TransportDetailsPage(page).select(method)
})

Given(
  'I select the transport method {string} and save and continue',
  async ({ page }, method) => {
    await new TransportDetailsPage(page).selectAndSave(method)
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

Then('the page explains {string}', async ({ page }, text) => {
  await expect(new TransportDetailsPage(page).explanation(text)).toBeVisible()
})

Then(
  'only the transport method {string} is selected',
  async ({ page }, method) => {
    const transportDetailsPage = new TransportDetailsPage(page)
    await expect(transportDetailsPage.selected(method)).toBeChecked()
    await expect(transportDetailsPage.selectedMethods()).toHaveCount(1)
  }
)

Then('the transport method {string} is selected', async ({ page }, method) => {
  await expect(new TransportDetailsPage(page).selected(method)).toBeChecked()
})

Then('no transport method is selected', async ({ page }) => {
  const transportDetailsPage = new TransportDetailsPage(page)
  await expect(page).toHaveURL(/\/notification\/transport-details$/)
  await expect(transportDetailsPage.selected('Ship or vessel')).toBeVisible()
  await expect(transportDetailsPage.selectedMethods()).toHaveCount(0)
})
