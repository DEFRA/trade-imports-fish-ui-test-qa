import { test, expect } from '#fixtures'
import { HomePage } from '#pages/inspector/home-page.js'

test.describe('Inspector home page', { tag: '@inspector' }, () => {
  test('should be on the inspector home page', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.open()

    // Only the URL is checked until the inspector service has content to assert on
    await expect(page).toHaveURL(/\/$/)
  })
})
