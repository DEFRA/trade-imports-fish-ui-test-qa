import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { SignInPage } from '#pages/importer/sign-in-page.js'
import { IdentityPage } from '#pages/importer/identity-page.js'

const { Given, When } = createBdd(test)

When('I sign out', async ({ page }) => {
  const identityPage = new IdentityPage(page)
  await identityPage.open()
  await identityPage.signOut()
  await expect(page).toHaveURL(/\/auth\/sign-in/)
})

Given('I am signed in as {string}', async ({ page }, testUser) => {
  const signInPage = new SignInPage(page)
  await signInPage.open()
  await signInPage.signInAs(testUser)
  await expect(page).not.toHaveURL(/\/auth\/sign-in/)
})
