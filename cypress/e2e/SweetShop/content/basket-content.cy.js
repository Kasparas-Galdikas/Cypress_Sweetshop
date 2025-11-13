// cypress/e2e/SweetShop/content/basket-content.cy.js
// Sweet Shop - Basket (content & semantics)

require('../support/commands');

describe('Sweet Shop - Basket (content)', () => {
  const BASE = 'https://sweetshop.netlify.app/basket';

  beforeEach(() => {
    cy.visit(BASE);
  });

  it('renders correct header and helper text', () => {
    cy.get('h1.display-3').should('have.text', 'Your Basket');
    cy.get('header p.lead').should('contain.text', 'Please check your order details');
  });

  it('navbar has expected items; About href warnings allowed', () => {
    cy.get('nav.navbar').should('be.visible');
    cy.get('nav.navbar a:visible').then(($links) => {
      const texts = [...$links].map(a => a.textContent.trim()).join(' | ');
      expect(texts).to.include('Sweets');
      expect(texts).to.include('About');
      expect(texts).to.include('Login');
      expect(texts).to.include('Basket');
    });

    // Soft warning if About link is broken (e.g., "bout")
    cy.get('nav.navbar a').contains(/^About$/)
      .should('have.attr', 'href')
      .then((href) => {
        if (href !== '/about') {
          cy.log(`⚠️ WARN: About link href is "${href}", expected "/about"`);
        }
      });
  });

  it('basket counts visible in navbar and sidebar', () => {
    cy.get('nav a[href="/basket"] .badge').should('be.visible');
    cy.get('#basketCount').should('be.visible');
  });

  it('basket list & total block are present', () => {
    cy.get('#basketItems').should('exist');
    // When fixture shows a prepopulated item, assert the row structure exists
    cy.get('#basketItems .list-group-item').should('have.length.at.least', 1);
    cy.get('#basketItems .list-group-item').last().should('contain.text', 'Total (GBP)');
  });

  it('delivery radio options exist (Collect default, Standard available)', () => {
    cy.get('input#exampleRadios1[type="radio"]').should('have.value', '0.00').and('be.checked');
    cy.get('label[for="exampleRadios1"]').should('contain.text', 'Collect');
    cy.get('input#exampleRadios2[type="radio"]').should('have.value', '1.99');
    cy.get('label[for="exampleRadios2"]').should('contain.text', 'Standard Shipping');
  });

  it('promo code input group + Empty Basket link exist', () => {
    cy.get('.input-group input[placeholder="Promo code"]').should('exist');
    cy.contains('button', 'Redeem').should('exist');
    cy.contains('a', 'Empty Basket').should('exist');
  });

  it('billing & payment fields have correct semantics (warn on duplicate ids)', () => {
    cy.get('input#email[type="email"]').should('have.attr', 'placeholder', 'you@example.com').and('have.prop', 'required', true);
    cy.get('input#address').should('have.prop', 'required', true);
    cy.get('#country').should('have.prop', 'required', true).and('contain.text', 'United Kingdom');
    cy.get('#city').should('have.prop', 'required', true).and('contain.text', 'Bristol');
    cy.get('#zip').should('have.prop', 'required', true);

    // Payment fields
    cy.get('#cc-name').should('have.prop', 'required', true);
    cy.get('#cc-number').should('have.attr', 'maxlength', '19').and('have.prop', 'required', true);
    cy.get('#cc-expiration').should('have.prop', 'required', true);
    cy.get('#cc-cvv').should('have.attr', 'type', 'number').and('have.prop', 'required', true);

    // Duplicate id="name" for first/last — warn, don’t fail
    cy.get('input#name').then(($els) => {
      if ($els.length > 1) {
        cy.log(`⚠️ WARN: Found ${$els.length} inputs with id="name" (first/last name). Consider unique ids.`);
      }
    });
  });

  it('footer is visible with expected text', () => {
    cy.get('footer').should('be.visible');
    cy.get('footer .container').should('contain.text', 'Sweet Shop Project 2018');
  });
});
