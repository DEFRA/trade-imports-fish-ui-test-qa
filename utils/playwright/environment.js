const PROD_ENVIRONMENT = 'prod'

export function getEnvironment() {
  return process.env.ENVIRONMENT ?? process.env.PLAYWRIGHT_ENVIRONMENT
}

export function throwIfProdEnvironment(environment = getEnvironment()) {
  if (environment?.toLowerCase() === PROD_ENVIRONMENT) {
    throw new Error(
      'Refusing to run Playwright tests against prod environment. Set ENVIRONMENT/PLAYWRIGHT_ENVIRONMENT to a non-prod value.'
    )
  }
}
