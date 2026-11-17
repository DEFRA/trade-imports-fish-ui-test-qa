import { test, expect } from '#fixtures'
import { GuidancePage } from '#pages/importer/notification/guidance-page.js'

test.describe('Guidance page', { tag: ['@importer', '@notification'] }, () => {
  test('should show the guidance heading', async ({ page }) => {
    const guidancePage = new GuidancePage(page)

    await guidancePage.open()

    await expect(page).toHaveURL(/\/notification\/guidance$/)
    await expect(guidancePage.pageHeading()).toHaveText(
      'Submit your seafood import notification'
    )
  })

  test('should go to the transport details page when starting', async ({
    page
  }) => {
    const guidancePage = new GuidancePage(page)
    await guidancePage.open()

    await guidancePage.startNow()

    // Only the URL is checked while the transport details page is still being built
    await expect(page).toHaveURL(/\/notification\/transport-details$/)
  })
})
