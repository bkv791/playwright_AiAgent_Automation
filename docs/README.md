# Authentication framework

## Design

- `tests/` contains the authentication scenarios.
- `pages/` contains page objects and `PageManager`, which exposes the page objects for the current browser page.
- `testdata/authentication.json` contains the valid and invalid login scenarios used by the tests.
- `fixture/test.fixture.ts` injects a `PageManager` into each test without placing framework code under `tests/`.
- `playwright.config.ts` loads the root `.env` file and uses `BASE_URL` as the Playwright base URL.

## Configure a target application

Copy `.env.example` to `.env`, then set `BASE_URL` to the application under test. The current page objects and authentication assertions use SauceDemo's login selectors, messages, and inventory page. Update those locators and expected values when targeting a different application.

The sample credentials in the JSON data are public SauceDemo demonstration accounts, not credentials for a private system. Keep real credentials in an ignored `.env` file or a CI secret store; do not commit them.

## Adding a page

Create a page object in the root `pages/` directory and expose it from `PageManager`. Tests obtain the manager from the shared fixture.
