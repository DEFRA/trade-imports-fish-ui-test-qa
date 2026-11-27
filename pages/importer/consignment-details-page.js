import { BasePage } from '../base-page.js'

export class ConsignmentDetailsPage extends BasePage {
  static path = '/notification/consignment-details'

  async open() {
    await super.open(ConsignmentDetailsPage.path)
  }

  async selectPort(port) {
    await this.page
      .getByRole('combobox', { name: 'What is the port of entry?' })
      .selectOption({ label: port })
  }

  selectedPort() {
    return this.page
      .getByRole('combobox', { name: 'What is the port of entry?' })
      .locator('option:checked')
  }

  // The first option is the empty "choose" entry, so only options with a value are the ports
  portOptions() {
    return this.page
      .getByRole('combobox', { name: 'What is the port of entry?' })
      .locator('option:not([value=""])')
  }

  async enterDate({ day, month, year }) {
    await this.field('Day').fill(day)
    await this.field('Month').fill(month)
    await this.field('Year').fill(year)
  }

  async enterTime(hour, minute) {
    await this.field('Hour').fill(hour)
    await this.field('Minute').fill(minute)
  }

  timeHint(hint) {
    return this.page.getByText(hint)
  }

  // Day, Month, Year, Hour and Minute are all plain text boxes with those labels
  field(label) {
    return this.page.getByRole('textbox', { name: label, exact: true })
  }
}
