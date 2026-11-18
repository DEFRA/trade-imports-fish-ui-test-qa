import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { TransportDetailsPage } from '#pages/importer/transport-details-page.js'

const { Given, Then } = createBdd(test)

Given('I open the transport details page', async ({ page }) => {
  await new TransportDetailsPage(page).open()
})

Then('I am on the transport details page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/transport-details$/)
})
