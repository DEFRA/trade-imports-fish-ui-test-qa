import { BasePage } from '../base-page.js'
import { GuidancePage } from './guidance-page.js'

export class HomePage extends BasePage {
  async open() {
    await super.open('/')
  }

  async createNewImport() {
    await this.page
      .getByRole('button', { name: 'Create a new import notification' })
      .click()
    return new GuidancePage(this.page)
  }

  // The whole journey: home page, Create a new import notification, then Start now
  async startNewImport() {
    await this.open()
    const guidancePage = await this.createNewImport()
    return guidancePage.startNow()
  }
}
