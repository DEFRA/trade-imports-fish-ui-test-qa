import { expect } from '@playwright/test'
import { test as base } from 'playwright-bdd'
import {
  baseUrlForDomain,
  domainFromSpecPath
} from '../utils/playwright/domain-base-urls.js'

/**
 * Playwright's test with each spec's baseURL set from its domain: the first
 * folder under tests/ (tests/importer/ or tests/inspector/).
 */
export const test = base.extend({
  baseURL: async ({}, use, testInfo) => {
    const domain = domainFromSpecPath(testInfo.file, testInfo.project.testDir)
    await use(baseUrlForDomain(domain))
  }
})

export { expect }
