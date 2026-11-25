import { BasePage } from '../base-page.js'

export class IdentityPage extends BasePage {
  async open() {
    await super.open('/dev/identity')
  }

  async signOut() {
    await this.page.getByRole('button', { name: 'Sign out' }).click()
  }
}
