import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly heading: Locator;

  constructor(page: Page) {
    this.heading = page.getByText('Products', { exact: true });
  }
}
