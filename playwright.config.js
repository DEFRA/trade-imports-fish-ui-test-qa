import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'
import {
  getEnvironment,
  throwIfProdEnvironment
} from './utils/playwright/environment.js'
import {
  applyDomainBaseUrls,
  resolveDomainBaseUrls
} from './utils/playwright/domain-base-urls.js'

throwIfProdEnvironment()
applyDomainBaseUrls(resolveDomainBaseUrls(getEnvironment()))

const TEST_TIMEOUT_MS = 60_000
const EXPECT_TIMEOUT_MS = 15_000
const viewport = { width: 1280, height: 1000 }

/**
 * Gherkin features (tests/<domain>/*.feature) are turned into Playwright specs
 * by `bddgen`. featuresRoot keeps the generated tree mirroring tests/, so the
 * first folder is still the domain.
 */
const bddTestDir = defineBddConfig({
  features: 'tests/**/*.feature',
  steps: ['steps/**/*.js', 'fixtures/index.js'],
  featuresRoot: 'tests',
  outputDir: '.features-gen'
})

/**
 * e2e against the deployed CDP environment (ENVIRONMENT), or the local
 * services when it is unset. Each spec's baseURL comes from its domain
 * (tests/<domain>/), see fixtures/index.js. A project is browser config only;
 * suites are selected by path, e.g. `playwright test tests/importer/`.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: bddTestDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  timeout: TEST_TIMEOUT_MS,
  expect: { timeout: EXPECT_TIMEOUT_MS },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ['./utils/playwright/failed-suite-reporter.js']
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
    proxy: process.env.HTTP_PROXY
      ? { server: process.env.HTTP_PROXY }
      : undefined
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport }
    }
  ]
})
