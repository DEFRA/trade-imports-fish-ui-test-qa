import { BasePage } from '../base-page.js'

export class TransportDetailsPage extends BasePage {
  async open() {
    await super.open('/notification/transport-details')
  }

  async select(method) {
    await this.page.getByRole('radio', { name: method }).check()
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
}
