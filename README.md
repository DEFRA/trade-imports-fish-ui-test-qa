trade-imports-fish-ui-test-qa

End-to-end tests for the fish importer and inspector services, written with [Playwright](https://playwright.dev) and JavaScript. They run against a CDP environment from the CDP Portal, or against services running locally.

- [Local](#local-development)
  - [Requirements](#requirements)
    - [Node.js](#nodejs)
  - [Setup](#setup)
  - [Running tests](#running-tests)
  - [Importer and inspector suites](#importer-and-inspector-suites)
  - [Debugging tests](#debugging-tests)
- [Production](#production)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Local Development

### Requirements

#### Node.js

Please install [Node.js](http://nodejs.org/) `>= v24` and [npm](https://nodejs.org/) `>= v11`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
nvm use
```

### Setup

Install application dependencies and the Playwright browser:

```bash
npm install
npx playwright install chromium
```

### Running tests

Set `ENVIRONMENT` to run against a deployed CDP environment, for example `test`. The services are then reached at `https://<service>.<environment>.cdp-int.defra.cloud`. If it is not set, the tests run against local services (importer on `http://localhost:3000`, inspector on `http://localhost:3001`). Running against `prod` is refused.

```bash
ENVIRONMENT=test npm test
```

On Windows PowerShell, set the variable first: `$env:ENVIRONMENT='test'; npm test`.

### Importer and inspector suites

The repository is shared by the importer and inspector teams. The folder a spec lives in decides which service it tests, and so its base URL:

| Folder             | Service                            |
| ------------------ | ---------------------------------- |
| `tests/importer/`  | `trade-imports-fish-importer-fe`   |
| `tests/inspector/` | `trade-imports-fish-inspection-fe` |

Page objects are in `pages/`, mirroring the same folders. Specs import `test` and `expect` from `#fixtures`, which sets the `baseURL` for the spec's folder. Specs are also tagged `@importer` or `@inspector`.

```bash
npm run test:importer
npm run test:inspector
```

The CDP entrypoint selects a suite with the `TEST_SUITE` environment variable: `importer`, `inspector` or `all` (the default).

### Debugging tests

```bash
npm run test:headed
npx playwright test --ui
```

After a run, open the Playwright report with `npx playwright show-report`.

## Production

### Running the tests

Tests are run from the CDP-Portal under the Test Suites section. Before any changes can be run, a new docker image must be built, this will happen automatically when a pull request is merged into the `main` branch.
You can check the progress of the build under the actions section of this repository. Builds typically take around 1-2 minutes.

The results of the test run are made available in the portal.

The entrypoint, `entrypoint.sh`, runs the suite selected by `TEST_SUITE`, generates the Allure report and publishes it. A `FAILED` file is written when any test fails, no results are recorded, or the report cannot be generated, and the entrypoint then exits 1.

## Requirements of CDP Environment Tests

1. Your service builds as a docker container using the `.github/workflows/publish.yml`
   The workflow tags the docker images allowing the CDP Portal to identify how the container should be run on the platform.
   It also ensures its published to the correct docker repository.

2. The Dockerfile's entrypoint script should return exit code of 0 if the test suite passes or 1/>0 if it fails

3. Test reports should be published to S3 using the script in `./bin/publish-tests.sh`

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
