import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { ConsignmentDetailsPage } from '#pages/importer/consignment-details-page.js'
import { arrivalDate, arrivalDateTimeFromNow } from '../../utils/dates.js'

const { Given, When, Then } = createBdd(test)

Given('I reopen the consignment details page', async ({ page }) => {
  await new ConsignmentDetailsPage(page).open()
})

When('I select the port of entry {string}', async ({ page }, port) => {
  await new ConsignmentDetailsPage(page).selectPort(port)
})

// For dates that depend on today, use the step below instead
When(
  'I enter the arrival date day {string} month {string} year {string}',
  async ({ page }, day, month, year) => {
    await new ConsignmentDetailsPage(page).enterDate({ day, month, year })
  }
)

// when is yesterday, today or tomorrow
When('I enter the arrival date of {string}', async ({ page }, when) => {
  await new ConsignmentDetailsPage(page).enterDate(arrivalDate(when))
})

async function enterArrivalFromNow(page, minutes) {
  const { hour, minute, ...date } = arrivalDateTimeFromNow(minutes)
  const consignmentDetailsPage = new ConsignmentDetailsPage(page)
  await consignmentDetailsPage.enterDate(date)
  await consignmentDetailsPage.enterTime(hour, minute)
  return date
}

When(
  'I enter an arrival date and time {int} minutes from now',
  async ({ page }, minutes) => {
    await enterArrivalFromNow(page, minutes)
  }
)

// Skipped late in the evening, when 3 hours from now is already tomorrow
When(
  'I enter today as the arrival date with a time 3 hours from now',
  async ({ page }) => {
    const date = await enterArrivalFromNow(page, 180)
    const today = arrivalDate('today')
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(
      date.day !== today.day || date.month !== today.month,
      'Three hours from now is not today'
    )
  }
)

When(
  'I enter the arrival time hour {string} minute {string}',
  async ({ page }, hour, minute) => {
    await new ConsignmentDetailsPage(page).enterTime(hour, minute)
  }
)

When('I save and continue', async ({ page }) => {
  await new ConsignmentDetailsPage(page).saveAndContinue()
})

Then('I am on the consignment details page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/consignment-details$/)
})

Then('I am on the next step page', async ({ page }) => {
  await expect(page).toHaveURL(/\/notification\/next-step$/)
})

Then('the arrival time hint says {string}', async ({ page }, hint) => {
  await expect(new ConsignmentDetailsPage(page).timeHint(hint)).toBeVisible()
})

Then('the port of entry is {string}', async ({ page }, port) => {
  await expect(new ConsignmentDetailsPage(page).selectedPort()).toHaveText(port)
})

Then('the port of entry options are {string}', async ({ page }, ports) => {
  await expect(new ConsignmentDetailsPage(page).portOptions()).toHaveText(
    ports.split(', ')
  )
})

Then('the arrival date is {string}', async ({ page }, when) => {
  const consignmentDetailsPage = new ConsignmentDetailsPage(page)
  const { day, month, year } = arrivalDate(when)
  await expect(consignmentDetailsPage.field('Day')).toHaveValue(day)
  await expect(consignmentDetailsPage.field('Month')).toHaveValue(month)
  await expect(consignmentDetailsPage.field('Year')).toHaveValue(year)
})

Then(
  'the arrival time is hour {string} minute {string}',
  async ({ page }, hour, minute) => {
    const consignmentDetailsPage = new ConsignmentDetailsPage(page)
    await expect(consignmentDetailsPage.field('Hour')).toHaveValue(hour)
    await expect(consignmentDetailsPage.field('Minute')).toHaveValue(minute)
  }
)
