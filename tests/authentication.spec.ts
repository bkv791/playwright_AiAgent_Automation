import { test, expect } from '../fixture/test.fixture';
import authenticationData from '../testdata/authentication.json';

test.describe('Authentication', () => {
  test('allows a valid user to sign in', async ({ page, pageManager }) => {
    await pageManager.login.goto();
    await pageManager.login.login(
      authenticationData.validUser.username,
      authenticationData.validUser.password,
    );

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(pageManager.inventory.heading).toBeVisible();
  });

  test('rejects invalid credentials', async ({ pageManager }) => {
    await pageManager.login.goto();
    await pageManager.login.login(
      authenticationData.invalidCredentials.username,
      authenticationData.invalidCredentials.password,
    );

    await expect(pageManager.login.errorMessage).toHaveText(
      authenticationData.invalidCredentials.expectedError,
    );
  });

  test('rejects a locked account', async ({ pageManager }) => {
    await pageManager.login.goto();
    await pageManager.login.login(
      authenticationData.lockedUser.username,
      authenticationData.lockedUser.password,
    );

    await expect(pageManager.login.errorMessage).toHaveText(
      authenticationData.lockedUser.expectedError,
    );
  });

  test('requires a username', async ({ pageManager }) => {
    await pageManager.login.goto();
    await pageManager.login.login(
      authenticationData.missingUsername.username,
      authenticationData.missingUsername.password,
    );

    await expect(pageManager.login.errorMessage).toHaveText(
      authenticationData.missingUsername.expectedError,
    );
  });

  test('requires a password', async ({ pageManager }) => {
    await pageManager.login.goto();
    await pageManager.login.login(
      authenticationData.missingPassword.username,
      authenticationData.missingPassword.password,
    );

    await expect(pageManager.login.errorMessage).toHaveText(
      authenticationData.missingPassword.expectedError,
    );
  });
});
