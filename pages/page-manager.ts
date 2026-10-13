import type { Page } from '@playwright/test';
import { InventoryPage } from './inventory.page';
import { LoginPage } from './login.page';

export class PageManager {
  readonly login: LoginPage;
  readonly inventory: InventoryPage;

  constructor(page: Page) {
    this.login = new LoginPage(page);
    this.inventory = new InventoryPage(page);
  }
}
