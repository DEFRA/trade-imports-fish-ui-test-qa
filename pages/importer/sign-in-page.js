import { BasePage } from '../base-page.js'

export class SignInPage extends BasePage {
  async open() {
    await super.open('/auth/sign-in')
  }

  async signInAs(testUser) {
    await this.page.getByRole('radio', { name: testUser }).check()
    await this.clickContinue()
  }
}
