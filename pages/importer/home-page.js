import { BasePage } from '../base-page.js'
import { GuidancePage } from './notification/guidance-page.js'

export class HomePage extends BasePage {
  async open() {
    await super.open('/')
  }

  async startNewNotification() {
    await this.page
      .getByRole('button', { name: 'Create a new import notification' })
      .click()
    return new GuidancePage(this.page)
  }
}
