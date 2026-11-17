import { test, expect } from '#fixtures'
import { TransportDetailsPage } from '#pages/importer/notification/transport-details-page.js'

test.describe(
  'Transport details page',
  { tag: ['@importer', '@notification'] },
  () => {
    test('should be on the transport details page', async ({ page }) => {
      const transportDetailsPage = new TransportDetailsPage(page)

      await transportDetailsPage.open()

      // Only the URL is checked while the transport details page is still being built
      await expect(page).toHaveURL(/\/notification\/transport-details$/)
    })
  }
)
