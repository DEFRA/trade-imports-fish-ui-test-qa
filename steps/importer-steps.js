import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { HomePage } from '#pages/importer/home-page.js'
import { GuidancePage } from '#pages/importer/notification/guidance-page.js'
import { TransportDetailsPage } from '#pages/importer/notification/transport-details-page.js'

const { Given, When, Then } = createBdd(test)

Given('I am on the importer home page', async ({ page }) => {
  await new HomePage(page).open()
})

Given('I open the guidance page', async ({ page }) => {
  await new GuidancePage(page).open()
})

Given('I open the transport details page', async ({ page }) => {
  await new TransportDetailsPage(page).open()
})

When('I start a new import notification', async ({ page }) => {
  await new HomePage(page).startNewNotification()
})

When('I start the notification', async ({ page }) => {
  await new GuidancePage(page).startNow()
})

Then('the page title is {string}', async ({ page }, title) => {
  await expect(page).toHaveTitle(title)
})

Then('the page heading is {string}', async ({ page }, heading) => {
  await expect(new GuidancePage(page).pageHeading()).toHaveText(heading)
})

Then('I am on the guidance page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/guidance$/)
})

Then('I am on the transport details page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/transport-details$/)
})
