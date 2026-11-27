import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { SignInPage } from '#pages/importer/sign-in-page.js'

const { Step } = createBdd(test)

Step('I am signed in as {string}', async ({ page }, testUser) => {
  const signInPage = new SignInPage(page)
  await signInPage.open()
  await signInPage.signInAs(testUser)
  await expect(page).not.toHaveURL(/\/auth\/sign-in/)
})
