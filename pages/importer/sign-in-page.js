import { BasePage } from '../base-page.js'

export class SignInPage extends BasePage {
  static path = '/auth/sign-in'

  async open() {
    await super.open(SignInPage.path)
  }

  async signInAs(testUser) {
    await this.page.getByRole('radio', { name: testUser }).check()
    await this.clickContinue()
  }
}
