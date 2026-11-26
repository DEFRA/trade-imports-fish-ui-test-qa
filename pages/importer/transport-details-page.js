import { BasePage } from '../base-page.js'

export class TransportDetailsPage extends BasePage {
  static path = '/notification/transport-details'

  async open() {
    await super.open(TransportDetailsPage.path)
  }

  async select(method) {
    await this.page.getByRole('radio', { name: method }).check()
  }

  async selectAndSave(method) {
    await this.select(method)
    await this.saveAndContinue()
  }

  async saveAndContinue() {
    await this.page.getByRole('button', { name: 'Save and continue' }).click()
  }

  selected(method) {
    return this.page.getByRole('radio', { name: method })
  }

  selectedMethods() {
    return this.page.getByRole('radio', { checked: true })
  }

  fieldError() {
    return this.page.locator('.govuk-error-message')
  }

  explanation(text) {
    return this.page.getByText(text)
  }
}
