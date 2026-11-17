import { test, expect } from '#fixtures'
import { HomePage } from '#pages/importer/home-page.js'

test.describe('Home page', { tag: '@importer' }, () => {
  test('should be on the home page', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.open()

    await expect(page).toHaveTitle(
      'Import fish and fishery products | trade-imports-fish-importer-fe'
    )
  })

  test('should go to the guidance page when starting a new import notification', async ({
    page
  }) => {
    const homePage = new HomePage(page)
    await homePage.open()

    await homePage.startNewNotification()

    await expect(page).toHaveURL(/\/notification\/guidance$/)
  })
})
