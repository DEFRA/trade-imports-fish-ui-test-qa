# trade-imports-fish-ui-test-qa

End-to-end tests for the fish **importer** and **inspector** services. They use [Playwright](https://playwright.dev) with JavaScript, and run in the Defra Core Delivery Platform (CDP) or on your own machine.

The setup follows [DEFRA/trade-imports-ins-tests](https://github.com/DEFRA/trade-imports-ins-tests) as closely as possible. That repo uses TypeScript, and this one uses plain JavaScript.

- [Status](#status)
- [Quick start](#quick-start)
- [How the tests are organised](#how-the-tests-are-organised)
- [Running tests](#running-tests)
- [Adding a test](#adding-a-test)
- [Reports and failures](#reports-and-failures)
- [Running in CDP](#running-in-cdp)
- [Code quality](#code-quality)
- [Licence](#licence)

## Status

| Area                                                  | State                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Tests (importer and inspector)                        | Working. They run against the CDP `test` environment.                                 |
| Playwright config, reports and the `FAILED` marker    | Working and checked locally.                                                          |
| `entrypoint.sh` and the `PROFILE` setting             | Working locally and in a local Docker container. Not yet run in the CDP Portal.       |
| Dockerfile                                            | Working. Built and run locally on the Playwright image, and the tests pass inside it. |
| **CDP Portal run and S3 publishing**                  | **Not tested.** It needs the suite registered in the portal and a merge to `main`.    |
| **Running against local services**                    | **Not tested.** The inspector's local port (`3001`) is a guess and needs confirming.  |
| Checks on pull requests                               | Format and lint only. The tests do not run on GitHub.                                 |
| Extra suites (accessibility, cross-browser, security) | Not included. The reference repo has them.                                            |

## Quick start

You need [Node.js](https://nodejs.org) `>= 24` (see `.nvmrc`; with [nvm](https://github.com/nvm-sh/nvm) run `nvm use`).

```bash
npm install
npx playwright install chromium
ENVIRONMENT=test npm test
```

On Windows PowerShell:

```powershell
$env:ENVIRONMENT='test'; npm test
```

`ENVIRONMENT=test` points the tests at the CDP `test` environment, which is reachable without a VPN. All the variables the tests read are listed in `.env.example`.

## How the tests are organised

**The folder a test is in decides which service it tests.**

| Folder             | Service                            | Address when `ENVIRONMENT=test`                                     |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------- |
| `tests/importer/`  | `trade-imports-fish-importer-fe`   | `https://trade-imports-fish-importer-fe.test.cdp-int.defra.cloud`   |
| `tests/inspector/` | `trade-imports-fish-inspection-fe` | `https://trade-imports-fish-inspection-fe.test.cdp-int.defra.cloud` |

This lets the importer and inspector teams share one repo without their tests interfering with each other.

```text
tests/                   the tests, written in Gherkin (*.feature), one folder per service
  importer/
    home-page.feature
    guidance-page.feature
    transport-details-page.feature
  inspector/
steps/                   step definitions (Given / When / Then), one file per page, mirroring tests/
pages/                   page objects: one class per page, mirroring tests/
  base-page.js           shared actions (open a page, cookie banner, heading)
fixtures/index.js        the `test` every step file imports; sets the base address from the folder
utils/playwright/        config helpers and the CDP FAILED-file reporter
playwright.config.js     Playwright settings: browser, timeouts, retries, reporters
.features-gen/           generated Playwright specs (git-ignored, made by `bddgen`)
entrypoint.sh            what CDP runs in the container
bin/publish-tests.sh     uploads the report to S3 (CDP)
```

Tests are written as plain-English scenarios (BDD) using [playwright-bdd](https://github.com/vitalets/playwright-bdd). `bddgen` turns each `.feature` file into a Playwright spec in `.features-gen/`, keeping the same folders, and Playwright runs those. `npm test` does this for you.

Under each service folder there is one file per page, named after the page (`home-page`, `guidance-page`, `transport-details-page`).

## Running tests

| Command                                  | What it does                                          |
| ---------------------------------------- | ----------------------------------------------------- |
| `npm test`                               | Runs every test (importer and inspector)              |
| `npm run test:importer`                  | Runs only the importer tests                          |
| `npm run test:inspector`                 | Runs only the inspector tests                         |
| `npm run test:headed`                    | Runs with a visible browser, so you can watch         |
| `npx playwright test --ui`               | Opens Playwright's interactive UI, good for debugging |
| `npx playwright test --grep "@importer"` | Runs only tests with that tag                         |

Set `ENVIRONMENT` first for all of these (see [Quick start](#quick-start)).

- **Without `ENVIRONMENT`,** the tests expect the services running locally: importer on `http://localhost:3000` and inspector on `http://localhost:3001`. The inspector port is unconfirmed and this mode is untested.
- **`prod` is refused.** The tests never run against production.

### Running just some tests

| Want to run            | Command                                              |
| ---------------------- | ---------------------------------------------------- |
| One scenario, by title | `npx bddgen; npx playwright test -g "Guidance page"` |
| A group, by tag        | `npx bddgen; npx playwright test --grep "@importer"` |
| One feature            | `npx bddgen; npx playwright test importer/home-page` |
| One folder (one team)  | `npm run test:importer` or `npm run test:inspector`  |
| Everything             | `npm test`                                           |

Run `npx bddgen` before `npx playwright test`, so the generated specs match your `.feature` files. `npm test` does it for you. On Mac or Linux use `&&` in place of `;`.

Tags in use are `@importer` and `@inspector`. They are written at the top of a `.feature` file.

Add `--headed` to any command to watch the browser, or `--debug` to step through.

`npm test` generates the specs and clears old results first, so the report is clean. `npx playwright test` does neither.

To see the result, the terminal shows a tick or cross per test. For the full report run `npx playwright show-report` (press `Ctrl+C` to stop it).

### Running tests from VS Code

1. Install the **Playwright Test for VS Code** extension (publisher Microsoft, `ms-playwright.playwright`).
2. Create `.vscode/settings.json` so the extension knows the environment. It does not see variables you set in a terminal. `.vscode` is git-ignored, so each person creates their own:

   ```json
   {
     "playwright.env": {
       "ENVIRONMENT": "test"
     }
   }
   ```

3. Open the **Testing** panel (flask icon). Click the ▶ next to a test, a file or a folder to run it.

**The panel runs the generated specs in `.features-gen/`.** After you edit a `.feature` file or a step, the panel runs the old version until the specs are regenerated. Either run `npx bddgen` after each edit, or start `npm run bddgen:watch` in a terminal once and leave it running. It regenerates whenever you save a file in `tests/`, `steps/` or `pages/`.

If a test fails with `ERR_CONNECTION_REFUSED` on `localhost:3000`, `ENVIRONMENT` is not set. Check step 2, then run **Developer: Reload Window**.

### Jumping from a step to its code

1. Install the **Cucumber** extension (publisher Cucumber, `CucumberOpen.cucumber-official`).
2. Add these to `.vscode/settings.json`, next to `playwright.env`:

   ```json
   {
     "cucumber.features": ["tests/**/*.feature"],
     "cucumber.glue": ["steps/**/*.js"]
   }
   ```

3. In a `.feature` file, `Ctrl+click` a step (or press `F12`) to open its definition in `steps/`.

## Adding a test

1. Write the scenario in the folder for its service, named `<page>.feature`, such as `tests/importer/guidance-page.feature`. Put a tag such as `@importer` or `@inspector` on the first line.
2. Write each new step in `steps/`. Import `test` and `expect` from `#fixtures`, not from `@playwright/test`, and create the steps with `createBdd(test)`. This is what sets the right base address.
3. Put page locators and actions in a class in `pages/`, mirroring the same folder. It extends `BasePage`. Steps call these classes and should not hold locators.
4. Run `npx bddgen`, then the test.

```gherkin
@importer
Feature: Guidance page

  Scenario: Guidance page shows its heading
    Given I open the guidance page
    Then the page heading is "Submit your seafood import notification"
```

```js
import { createBdd } from 'playwright-bdd'
import { test, expect } from '#fixtures'
import { GuidancePage } from '#pages/importer/guidance-page.js'

const { Given, Then } = createBdd(test)

Given('I open the guidance page', async ({ page }) => {
  await new GuidancePage(page).open()
})

Then('the page heading is {string}', async ({ page }, heading) => {
  await expect(new GuidancePage(page).pageHeading()).toHaveText(heading)
})
```

Reuse an existing step where the wording matches. Some scenarios only check the URL, because the page they reach is still being built. Each says so in a comment, and should be extended when the page is ready.

## Reports and failures

After a run:

- `npx playwright show-report` opens the Playwright report.
- `npm run report` builds the Allure report into `allure-report/`.
- `npm run clean` deletes the old results, reports and `FAILED` file.

**The `FAILED` file** is how CDP knows a run failed. Our reporter in `utils/playwright/failed-suite-reporter.js` writes it when a test fails. A test that fails and then passes on its retry counts as flaky and does not fail the run. Each test is retried once.

## Running in CDP

> **Not finished.** See [Status](#status). The steps below describe how it is meant to work.

CDP builds a Docker image from this repo, and the portal runs it as a test suite. `entrypoint.sh` is what runs inside the container:

1. Cleans old results.
2. Runs the tests chosen by `PROFILE`.
3. Builds the Allure report, with a fallback page if that fails.
4. Uploads the report to S3 using `bin/publish-tests.sh`.
5. Exits with 1 if a `FAILED` file exists, otherwise 0.

The `FAILED` file is written when a test fails, no results were recorded, the profile is unknown, or the report cannot be built.

### Choosing what runs: `PROFILE`

The CDP Portal sets `PROFILE` to choose a suite:

| `PROFILE`                      | Runs                                         |
| ------------------------------ | -------------------------------------------- |
| not set, or `default`          | All tests (importer and inspector)           |
| `importer` or `importer:e2e`   | Only `tests/importer/`                       |
| `inspector` or `inspector:e2e` | Only `tests/inspector/`                      |
| anything else                  | Fails, writes `FAILED`, still gives a report |

**If `PROFILE` is not set, both teams' tests run,** so a failure in one team's tests fails the other team's run. Set a profile to run only your own.

### What CDP requires

1. The service builds as a Docker image through `.github/workflows/publish.yml`, which only runs when something is merged to `main`.
2. The entrypoint exits 0 when the suite passes and non-zero when it fails.
3. The report is published to S3 using `./bin/publish-tests.sh`.

### Running the Docker image locally

```bash
docker build --platform=linux/amd64 -t fish-ui-tests .
docker run --rm -e ENVIRONMENT=test -e PROFILE=importer fish-ui-tests
```

`--platform=linux/amd64` is needed because the AWS CLI in the image is amd64 only. Locally the container exits with 1 even when the tests pass, because `RESULTS_OUTPUT_S3_PATH` is not set and the report cannot be uploaded. On Windows, `entrypoint.sh` and `bin/publish-tests.sh` must have LF line endings, or the container fails with `no such file or directory`.

### Still to do

- Check with the platform team that the suite is registered in the portal, and how profiles are set up for it.
- Decide how to test the image before merging. `publish.yml` only builds on `main`, while the reference repo also has a branch-publish workflow.

## Code quality

| Command                | What it does                        |
| ---------------------- | ----------------------------------- |
| `npm run lint`         | Checks the code with ESLint         |
| `npm run format:check` | Checks the formatting with Prettier |
| `npm run format`       | Fixes the formatting                |

Both run on every pull request. The repo also has a Husky pre-commit hook that runs them before each commit, but it is **not installed automatically**, because `.npmrc` sets `ignore-scripts=true`. Install it once with `npm run setup:husky`.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
