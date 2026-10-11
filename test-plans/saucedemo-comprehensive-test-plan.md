# SauceDemo Comprehensive Functional Test Plan

## Application Overview

Comprehensive black-box functional, negative, and exploratory plan for https://www.saucedemo.com. Each test starts from a fresh app state unless the test explicitly creates its own prerequisite state. Publicly displayed test credentials are standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, and visual_user; the displayed shared password is secret_sauce. Cover login, inventory sorting and details, cart behavior, checkout validation and completion, navigation/state reset, account-specific behavior, dynamic-catalog menu options, and route/error resilience.

## Test Scenarios

### 1. Authentication and session access

**Seed:** ``

#### 1.1. Successful login with standard account

**File:** `test-plans/tests/auth/valid-login.spec.ts`

**Steps:**
  1. Starting from a fresh browser context at https://www.saucedemo.com, enter standard_user and secret_sauce, then select Login.
    - expect: The user is routed to the Products inventory page.
    - expect: The inventory displays six products with names, descriptions, prices, and images.
    - expect: The cart starts empty and the default sort is Name (A to Z).
  2. Use browser Back and Forward after authentication.
    - expect: Navigation behaves consistently without exposing an authenticated page as an error or losing the active session unexpectedly.

#### 1.2. Login rejects missing credentials

**File:** `test-plans/tests/auth/required-login-fields.spec.ts`

**Steps:**
  1. Starting fresh, leave both Username and Password blank and select Login.
    - expect: The user remains on the login page and sees a clear Username is required error.
  2. Dismiss the error, enter a username but leave Password blank, and submit.
    - expect: The user remains on the login page and sees a clear Password is required error.
  3. Dismiss the error, leave Username blank, enter a password, and submit.
    - expect: The user remains on the login page and sees a clear Username is required error.

#### 1.3. Login rejects invalid credentials

**File:** `test-plans/tests/auth/invalid-login.spec.ts`

**Steps:**
  1. Starting fresh, submit an unknown username with a non-empty password.
    - expect: Authentication is rejected with a clear error and no inventory is shown.
  2. Submit standard_user with an incorrect password.
    - expect: Authentication is rejected with a clear error and the user stays on the login page.
  3. Submit whitespace-only username or password values.
    - expect: Whitespace does not authenticate; validation or an invalid-credentials error is shown without granting access.

#### 1.4. Locked-out account is blocked

**File:** `test-plans/tests/auth/locked-account.spec.ts`

**Steps:**
  1. Starting fresh, log in with locked_out_user and secret_sauce.
    - expect: Login is rejected with the locked-account message and the user remains on the login page.
  2. Dismiss the message and retry with the same credentials.
    - expect: The account remains blocked and an authenticated route is not opened.

#### 1.5. Logout ends access to authenticated pages

**File:** `test-plans/tests/auth/logout-protected-routes.spec.ts`

**Steps:**
  1. Starting fresh, log in as standard_user, open the menu, and select Logout.
    - expect: The browser returns to the login page and login inputs are available.
  2. Use browser Back or navigate directly to /inventory.html, /cart.html, or a checkout URL after logout.
    - expect: Protected content is not accessible as an authenticated user; the app returns to login or otherwise denies access safely.

#### 1.6. Other documented accounts remain usable and predictable

**File:** `test-plans/tests/auth/supported-user-accounts.spec.ts`

**Steps:**
  1. Starting fresh, log in separately with performance_glitch_user, error_user, problem_user, and visual_user, using secret_sauce for each.
    - expect: Each account is either admitted or rejected in accordance with its documented account behavior; the app does not hang indefinitely or leak another session's state.
  2. For every account that reaches inventory, verify the product list, item detail, add/remove, cart, and checkout interactions; record account-specific errors or layout/data differences.
    - expect: Common flows remain operable where supported; any expected test-account defect is reproducible and isolated to that account.

### 2. Inventory and product discovery

**Seed:** ``

#### 2.1. Inventory renders complete catalog

**File:** `test-plans/tests/inventory/catalog-rendering.spec.ts`

**Steps:**
  1. Starting fresh, log in as standard_user and inspect the Products page.
    - expect: All six catalog items are visible with matching names, non-empty descriptions, prices, and product images.
    - expect: The default sort is Name (A to Z) and the cart is empty.
  2. Open each product using its name and image affordances, then return using Back to products.
    - expect: The selected item's name, description, price, and image are shown consistently on the detail page.
    - expect: Back to products returns to inventory without losing cart state.

#### 2.2. All inventory sort choices order products correctly

**File:** `test-plans/tests/inventory/sorting.spec.ts`

**Steps:**
  1. Starting fresh, log in as standard_user and select each option in Sort products: Name (A to Z), Name (Z to A), Price (low to high), and Price (high to low).
    - expect: Each selection updates the displayed ordering accordingly.
    - expect: Name sorts are alphabetically correct in both directions; price sorts are numerically correct in both directions, including equal-priced products.
    - expect: Changing sort does not change product content or cart contents.

#### 2.3. Add and remove products from inventory and details

**File:** `test-plans/tests/inventory/add-remove-items.spec.ts`

**Steps:**
  1. Starting fresh, log in, add one product from inventory, then add a different product.
    - expect: Each add action changes to Remove for that product and updates the cart badge to the number of distinct items added.
  2. Remove one item from inventory, open another product detail, add it there, then remove it there.
    - expect: The appropriate item is removed each time, its action returns to Add to cart, and the badge accurately reflects the remaining contents.
  3. Refresh the page and navigate between inventory and product details.
    - expect: Cart state remains consistent through ordinary in-session navigation and refresh.

#### 2.4. Invalid product detail routes are handled safely

**File:** `test-plans/tests/inventory/product-detail-routing.spec.ts`

**Steps:**
  1. Starting fresh, log in and directly open inventory-item.html with a nonexistent, missing, malformed, or non-numeric id query value.
    - expect: The app does not crash or show another product's details; it presents a safe not-found/return-to-products outcome.
  2. Use Back to products when available and reopen a valid product.
    - expect: The inventory and valid product details remain accessible.

#### 2.5. Dynamic Catalog menu options behave reliably

**File:** `test-plans/tests/inventory/dynamic-catalog.spec.ts`

**Steps:**
  1. Starting fresh, log in, open the menu, expand Dynamic Catalog, then activate Lazy Load, Spinner, and Slider separately.
    - expect: Each option reaches its intended dynamic-catalog experience or a clear, recoverable state; interaction does not freeze the app or corrupt cart/session state.
  2. For each option, wait for any loading indicator, attempt the relevant content interaction, and return to All Items.
    - expect: Loading indicators resolve or report a recoverable failure; All Items returns to the standard inventory.

### 3. Cart and checkout

**Seed:** ``

#### 3.1. Cart content and removal stay synchronized

**File:** `test-plans/tests/cart/cart-content-removal.spec.ts`

**Steps:**
  1. Starting fresh, log in and open the cart without adding products.
    - expect: The cart is empty, has no product rows, and Continue Shopping remains available.
  2. Add two different products, open the cart, and verify each row's quantity, name, description, and price.
    - expect: Each selected product appears once with the correct details and the cart badge agrees with the cart contents.
  3. Remove one item from the cart and then remove the remaining item.
    - expect: Each row disappears after removal, badge state updates, and the empty cart has no stale product rows.

#### 3.2. Continue Shopping preserves cart state

**File:** `test-plans/tests/cart/continue-shopping.spec.ts`

**Steps:**
  1. Starting fresh, log in, add an item, open the cart, and choose Continue Shopping.
    - expect: The user returns to inventory and the cart retains the added item and correct badge.

#### 3.3. Checkout behavior with an empty cart

**File:** `test-plans/tests/cart/checkout-empty-cart.spec.ts`

**Steps:**
  1. Starting fresh, log in and navigate directly to /checkout-step-one.html with no cart items, then try to proceed.
    - expect: The app does not allow an order to be completed without items or present a misleading successful order; any checkout page handles empty state safely.

#### 3.4. Checkout validates every required customer field

**File:** `test-plans/tests/checkout/required-information.spec.ts`

**Steps:**
  1. Starting fresh, log in, add one item, open the cart, select Checkout, and submit the information form with all fields blank.
    - expect: Checkout remains on the information step and reports First Name is required.
  2. Enter only a first name and submit; then enter a last name but leave postal code blank and submit.
    - expect: The form reports Last Name is required, then Zip/Postal Code is required, without advancing until all required fields are supplied.
  3. Enter values in all three fields and continue.
    - expect: The user advances to Checkout: Overview and the form does not lose valid values unexpectedly.

#### 3.5. Checkout accepts reasonable customer input and rejects invalid input safely

**File:** `test-plans/tests/checkout/customer-input-boundaries.spec.ts`

**Steps:**
  1. Starting fresh, create a cart and attempt checkout with boundary inputs: leading/trailing spaces, punctuation, accented letters, long names, and postal codes containing letters, spaces, or punctuation.
    - expect: Inputs are handled consistently without script execution, UI corruption, or silent data loss; required fields remain enforced and valid postal-code formats supported by the app are accepted.
  2. Attempt extremely long values and values containing markup-like or script-like text in name fields.
    - expect: The app remains stable and treats input as text; no markup or script is executed.

#### 3.6. Order overview and totals are accurate

**File:** `test-plans/tests/checkout/order-review-totals.spec.ts`

**Steps:**
  1. Starting fresh, add products with different prices, proceed through checkout using valid customer details, and inspect the Overview.
    - expect: Overview lists exactly the cart items with correct prices and quantities.
    - expect: Item total equals the sum of item prices; tax and final total are mathematically consistent with the displayed tax policy and currency rounding.
  2. Cancel from overview.
    - expect: The order is not completed and the app returns to inventory without incorrectly confirming an order.

#### 3.7. Successful checkout completes and clears the cart

**File:** `test-plans/tests/checkout/order-completion.spec.ts`

**Steps:**
  1. Starting fresh, log in, add one or more products, submit valid first name, last name, and postal code, verify overview amounts, and select Finish.
    - expect: Checkout Complete is displayed with a clear order confirmation message.
    - expect: The cart is empty after completion and Back Home returns to inventory.
  2. Use Generate PDF order if available.
    - expect: A valid order document is generated or downloaded; the action does not alter the completed order state.

#### 3.8. Checkout routes cannot bypass required steps

**File:** `test-plans/tests/checkout/checkout-route-guard.spec.ts`

**Steps:**
  1. Starting fresh, log in and directly navigate to checkout overview or completion routes without completing preceding steps.
    - expect: The app does not falsely confirm an order or expose a fabricated summary; it redirects or presents a safe route/state error.
  2. Attempt to refresh during the information and overview steps, and use browser Back/Forward.
    - expect: The checkout state remains coherent and no duplicate order is created.

### 4. Navigation, session state, and resilience

**Seed:** ``

#### 4.1. Menu navigation and Reset App State work correctly

**File:** `test-plans/tests/navigation/menu-and-reset.spec.ts`

**Steps:**
  1. Starting fresh, log in, open and close the menu, and use All Items.
    - expect: Menu opens/closes reliably; All Items returns to inventory.
  2. Add an item, open menu, select Reset App State, then inspect inventory and cart.
    - expect: Cart contents and cart badge are cleared, product buttons return to Add to cart, and the authenticated session remains usable.

#### 4.2. Direct route access handles unauthenticated and malformed routes

**File:** `test-plans/tests/navigation/direct-routes.spec.ts`

**Steps:**
  1. Starting fresh and logged out, directly navigate to inventory, cart, product detail, and checkout routes.
    - expect: Protected pages require a valid session and do not reveal stale user data.
  2. Try unknown paths and malformed route/query values while logged out and logged in.
    - expect: The app renders a safe fallback or returns to a valid route without a blank broken page or uncaught application failure.

#### 4.3. Core flows remain usable across viewport and keyboard navigation

**File:** `test-plans/tests/navigation/responsive-accessibility.spec.ts`

**Steps:**
  1. Starting fresh, run login, add-to-cart, cart, and checkout flows at desktop, tablet, and narrow mobile viewport widths.
    - expect: Controls and product details remain visible and usable without unintended overlap, clipping, or horizontal overflow that blocks completion.
  2. Navigate login, inventory sort, menu, cart, and checkout using keyboard only; inspect accessible names and focus behavior.
    - expect: Interactive elements are reachable with keyboard, focus is visible and logical, and form errors/actions are announced clearly to assistive technology.

#### 4.4. Footer links open intended destinations

**File:** `test-plans/tests/navigation/footer-links.spec.ts`

**Steps:**
  1. Starting fresh, inspect the footer links for X, Facebook, and LinkedIn and activate each in a controlled test browser.
    - expect: Each link targets the corresponding Sauce Labs social destination and does not unexpectedly replace the shopping session.
