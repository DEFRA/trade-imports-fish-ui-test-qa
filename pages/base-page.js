export class BasePage {
  constructor(page) {
    this.page = page
  }

  pageHeading() {
    return this.page.locator('h1')
  }

  errorSummary() {
    return this.page.locator('.govuk-error-summary')
  }

  fieldError() {
    return this.page.locator('.govuk-error-message')
  }

  async saveAndContinue() {
    await this.page.getByRole('button', { name: 'Save and continue' }).click()
  }

  async clickContinue() {
    await this.page.getByRole('button', { name: 'Continue' }).click()
  }

  async open(path) {
    await this.page.goto(path)
    await this.acceptAnalyticsCookiesIfVisible()
  }

  // The banner only shows until a choice is made, so it is not always present
  async acceptAnalyticsCookiesIfVisible() {
    const accept = this.page.getByRole('button', {
      name: 'Accept analytics cookies'
    })

    if (await accept.isVisible()) {
      await accept.click()
    }
  }
}
