import { relative, sep } from 'node:path'

/** One domain per deployable app; each owns every spec under tests/<domain>/. */
export const DOMAINS = ['importer', 'inspector']

const DOMAIN_ENV_VARS = {
  importer: 'TRADE_IMPORTS_FISH_IMPORTER_BASE_URL',
  inspector: 'TRADE_IMPORTS_FISH_INSPECTION_BASE_URL'
}

const CDP_SERVICE_NAMES = {
  importer: 'trade-imports-fish-importer-fe',
  inspector: 'trade-imports-fish-inspection-fe'
}

const LOCAL_BASE_URLS = {
  importer: 'http://localhost:3000',
  inspector: 'http://localhost:3001'
}

const isDomain = (name) => DOMAINS.includes(name)

/** Base URLs for every domain: the deployed CDP environment, or the local services when unset. */
export function resolveDomainBaseUrls(environment) {
  return Object.fromEntries(
    DOMAINS.map((domain) => [
      domain,
      environment
        ? `https://${CDP_SERVICE_NAMES[domain]}.${environment}.cdp-int.defra.cloud`
        : LOCAL_BASE_URLS[domain]
    ])
  )
}

/**
 * Sets the per-domain base URL environment variables from a lookup map, so specs get their
 * domain's baseURL (see baseUrlForDomain). Workers load the config too, so they see the same values.
 */
export function applyDomainBaseUrls(domainBaseUrls) {
  for (const domain of DOMAINS) {
    const baseURL = domainBaseUrls[domain]
    if (!baseURL) {
      throw new Error(`No baseURL configured for domain: ${domain}`)
    }
    process.env[DOMAIN_ENV_VARS[domain]] = baseURL
  }
}

/** The domain a spec belongs to: the first directory under the test directory. */
export function domainFromSpecPath(file, testDir) {
  const [domain] = relative(testDir, file).split(sep)
  if (!isDomain(domain)) {
    throw new Error(
      `Spec ${file} is not under tests/<domain>/ for a known domain (${DOMAINS.join(', ')}).`
    )
  }
  return domain
}

export function baseUrlForDomain(domain) {
  const baseURL = process.env[DOMAIN_ENV_VARS[domain]]
  if (!baseURL) {
    throw new Error(
      `${DOMAIN_ENV_VARS[domain]} is not set. Ensure the Playwright config applies it before running tests.`
    )
  }
  return baseURL
}
