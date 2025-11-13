describe('Sweet Shop - About Content Integrity', () => {
  before(() => {
    cy.visit('https://sweetshop.netlify.app/about');
  });

  it('matches key text snippets', () => {
    cy.contains('Sweet Shop Project').should('exist');
    cy.contains('An intentionally broken web application').should('exist');
    cy.contains('Chrome DevTools').should('exist');
    cy.contains('Sweet Shop Project 2018').should('exist');
  });
});
