import { BasePage } from '../base-page.js'
import { TransportDetailsPage } from './transport-details-page.js'

export class GuidancePage extends BasePage {
  async open() {
    await super.open('/notification/guidance')
  }

  async startNow() {
    await this.page.getByRole('button', { name: 'Start now' }).click()
    return new TransportDetailsPage(this.page)
  }
}
