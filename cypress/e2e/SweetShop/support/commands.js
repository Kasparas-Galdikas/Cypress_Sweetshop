// cypress/e2e/SweetShop/support/commands.js
// -----------------------------------------------------------------------------
// Reusable custom commands for Sweet Shop tests.
// -----------------------------------------------------------------------------

/**
 * Logs in with the demo credentials and asserts we land on the account page.
 */
Cypress.Commands.add('loginDemoUser', (opts = {}) => {
  const BASE_ROOT = 'https://sweetshop.netlify.app';
  const SELECTORS = {
    email: '#exampleInputEmail',
    password: '#exampleInputPassword',
    submitBtn: 'form .btn.btn-primary',
  };

  cy.visit(`${BASE_ROOT}/login`);
  cy.get('h1.display-3').should('have.text', 'Login');
  cy.get(SELECTORS.email).clear().type(opts.email || 'test@user.com');
  cy.get(SELECTORS.password).clear().type(opts.password || 'qwerty');
  cy.get(SELECTORS.submitBtn).click();

  cy.location('pathname').should((p) => {
    expect(p, 'left /login').to.not.include('/login');
    expect(p, 'landed on .html').to.match(/\.html$/);
  });

  cy.get('h1.display-3', { timeout: 10000 }).should('have.text', 'Your Account');
  cy.get('header p.lead').should('contain.text', 'Welcome back');
});

/**
 * Add an item to basket by the product card title on /sweets.
 * Example: cy.addItemByName('Chocolate Cups')
 */
Cypress.Commands.add('addItemByName', (name) => {
  cy.contains('.card .card-title', new RegExp(`^${Cypress._.escapeRegExp(name)}$`, 'i'))
    .should('be.visible')
    .parents('.card')
    .within(() => {
      cy.get('.card-footer .addItem').click();
    });
});

/**
 * Reads the navbar Basket badge count as a number. Resolves to Number.
 */
Cypress.Commands.add('readNavbarBasketCount', () => {
  return cy.get('nav a[href="/basket"] .badge').invoke('text').then((t) => Number(t.trim()));
});

/**
 * Reads the sidebar basket pill (#basketCount) as a number on /basket.
 */
Cypress.Commands.add('readSidebarBasketCount', () => {
  return cy.get('#basketCount').invoke('text').then((t) => Number(t.trim()));
});

/**
 * Empties basket on /basket page if link present.
 * Returns chainable that resolves after counts settle (best-effort).
 */
Cypress.Commands.add('emptyBasketIfPresent', () => {
  cy.get('body').then(($b) => {
    const hasEmpty = $b.find('a:contains("Empty Basket")').length > 0;
    if (hasEmpty) {
      cy.contains('a', 'Empty Basket').click({ force: true });
      // Let custom.js update UI if it’s async
      cy.wait(300);
    } else {
      cy.log(' Empty Basket link not present — nothing to do.');
    }
  });
});
