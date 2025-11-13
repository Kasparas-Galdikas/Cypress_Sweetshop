// Master test runner – runs ALL SweetShop tests

// CONTENT tests
import './SweetShop/content/about-content.cy'
import './SweetShop/content/basket-content.cy'
import './SweetShop/content/catalog.cy'
import './SweetShop/content/login-content.cy'
import './SweetShop/content/profile-content.cy'

// FUNCTIONAL tests
import './SweetShop/functional/about.cy'
import './SweetShop/functional/basket-flows.cy'
import './SweetShop/functional/basket.cy'
import './SweetShop/functional/login.cy'
import './SweetShop/functional/profile.cy'
import './SweetShop/functional/SweetShopMainPage.cy'

describe("Run ALL Cypress tests", () => {
  it("Running all test suites...", () => {
    // This test does nothing.
    // Cypress will automatically run all imported test files.
  });
});
