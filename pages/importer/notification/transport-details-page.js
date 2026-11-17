import { BasePage } from '../../base-page.js'

export class TransportDetailsPage extends BasePage {
  async open() {
    await super.open('/notification/transport-details')
  }
}
