import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { IdentityPage } from '#pages/importer/identity-page.js'

const { When } = createBdd(test)

When('I sign out', async ({ page }) => {
  const identityPage = new IdentityPage(page)
  await identityPage.open()
  await identityPage.signOut()
  await expect(page).toHaveURL(/\/auth\/sign-in/)
})
