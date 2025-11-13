// cypress/e2e/SweetShop/content/profile-content.cy.js
// Sweet Shop - Profile/Account (content & semantics)

// Ensure our custom command is loaded (relative path from /content to /support)
require('../support/commands');

describe('Sweet Shop - Profile (content)', () => {
  beforeEach(() => {
    // Log in with demo creds and land on the account page
    cy.loginDemoUser();
  });

  it('renders the correct header and greeting', () => {
    cy.get('h1.display-3').should('have.text', 'Your Account');
    cy.get('header p.lead')
      .should('contain.text', 'Welcome back')
      .and('contain.text', 'test@user.com');
  });

  it('navbar is visible and contains expected items (with Basket)', () => {
    cy.get('nav.navbar').should('be.visible');
    cy.get('nav.navbar a:visible').then(($links) => {
      const texts = [...$links].map((a) => a.textContent.trim()).join(' | ');
      expect(texts).to.include('Sweets');
      expect(texts).to.include('About');
      expect(texts).to.include('Login');
      expect(texts).to.include('Basket');
    });

    // Basket badge in navbar
    cy.get('nav.navbar a[href="/basket"] .badge').should('contain.text', '0');
  });

  it('basket sidebar shows correct heading and count', () => {
    cy.contains('h4', 'Your Basket').should('be.visible');
    cy.get('.badge.badge-secondary.badge-pill').should('contain.text', '0');
    cy.get('#basketItems').should('exist');
  });

  it('previous orders table is present with the correct headers and rows', () => {
    cy.get('table#transactions').should('be.visible');

    // Headers exist
    cy.get('#transactions thead th .order-number').should('contain.text', 'Order Number');
    cy.get('#transactions thead th .order-date').should('contain.text', 'Date Ordered');
    cy.get('#transactions thead th .order-description').should('contain.text', 'Order Description');
    cy.get('#transactions thead th .order-total').should('contain.text', 'Order Total');

    // Exactly 3 data rows
    cy.get('#transactions tbody tr').should('have.length', 3);

    // Expected row content (loose contains for robustness)
    cy.get('#transactions tbody tr').eq(0).within(() => {
      cy.contains('#1');
      cy.contains('11th Feb 2019');
      cy.contains('Swansea Mixture');
      cy.contains('1.50');
    });
    cy.get('#transactions tbody tr').eq(1).within(() => {
      cy.contains('#2');
      cy.contains('11th July 2019');
      cy.contains('Sherbert Straws');
      cy.contains('0.75');
    });
    cy.get('#transactions tbody tr').eq(2).within(() => {
      cy.contains('#3');
      cy.contains('1st December 2019');
      cy.contains('Chocolate Cups');
      cy.contains('8.00');
    });
  });

  it('sorting links exist with javascript:SortTable(...) hrefs', () => {
    cy.get('#transactions thead .order-number')
      .should('have.attr', 'href')
      .and('match', /^javascript:SortTable\(/);

    cy.get('#transactions thead .order-date')
      .should('have.attr', 'href')
      .and('include', 'SortTable(')
      .and('include', "'D'"); // date sort flag present

    cy.get('#transactions thead .order-description')
      .should('have.attr', 'href')
      .and('include', 'SortTable(');

    cy.get('#transactions thead .order-total')
      .should('have.attr', 'href')
      .and('include', 'SortTable(')
      .and('include', "'N'"); // numeric sort flag present
  });

  it('chart canvas is rendered and Chart.js is available', () => {
    cy.get('#transactionChart').should('be.visible');
    cy.window().its('Chart').should('be.a', 'function');
  });

  it('footer is visible with expected text', () => {
    cy.get('footer').should('be.visible');
    cy.get('footer .container').should('contain.text', 'Sweet Shop Project 2018');
  });
});
