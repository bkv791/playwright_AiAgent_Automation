# Playwright Authentication Automation

Playwright and TypeScript page-object framework for authentication testing against SauceDemo.

## Project structure

```text
tests/       Authentication test cases
pages/       Page objects and page manager
testdata/    JSON test data
fixture/     Shared Playwright fixtures
test-results/Generated test output
docs/        Framework and setup documentation
```

All framework folders are at the repository root; page objects and fixtures are not nested under `tests`.

## Setup

Requirements: Node.js 20.12 or newer and npm.

```sh
npm ci
npx playwright install
cp .env.example .env
```

Set `BASE_URL` in `.env` to the target application URL. The framework defaults to SauceDemo when the variable is unset. Keep credentials and other secrets out of source control.

## Run tests

```sh
npm test
npm run test:chromium
npm run test:headed
npm run test:report
```

The tests exercise successful login, invalid credentials, locked accounts, and missing username or password validation. Authentication scenarios are stored in [testdata/authentication.json](./testdata/authentication.json).
