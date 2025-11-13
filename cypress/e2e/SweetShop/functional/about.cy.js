// Sweet Shop - About Page Functional Tests
describe('Sweet Shop - About Page', () => {
  const BASE = 'https://sweetshop.netlify.app/about';

  beforeEach(() => {
    cy.visit(BASE);
  });

  it('page loads successfully with correct title', () => {
    cy.title().should('include', 'Sweet Shop');
    cy.url().should('include', '/about');
  });

  it('navbar is visible with expected links', () => {
    cy.get('nav').should('be.visible');
    cy.get('nav a:visible').should('contain', 'Sweets')
      .and('contain', 'About')
      .and('contain', 'Login')
      .and('contain', 'Basket');
  });

  it('displays header with correct text', () => {
    cy.get('h1.display-3')
      .should('be.visible')
      .and('contain', 'Sweet Shop Project');
  });


  it('contains descriptive paragraphs', () => {
    cy.get('p.lead').should('have.length.at.least', 2);
    cy.get('p.lead').first()
      .should('contain', 'Chrome DevTools')
      .and('contain', 'demonstrate');
  });

  it('footer displays correct project info', () => {
    cy.get('footer').should('be.visible');
    cy.get('footer p').should('contain', 'Sweet Shop Project 2018');
  });

  it('basic responsive layout works (mobile)', () => {
    cy.viewport(375, 667);
    cy.get('h1.display-3').should('be.visible');
    cy.get('footer').should('be.visible');
  });
});
