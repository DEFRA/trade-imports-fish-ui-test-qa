import { BasePage } from '../base-page.js'

export class IdentityPage extends BasePage {
  static path = '/dev/identity'

  async open() {
    await super.open(IdentityPage.path)
  }

  async signOut() {
    await this.page.getByRole('button', { name: 'Sign out' }).click()
  }
}
