// cypress/e2e/SweetShop/content/login-content.cy.js
// Sweet Shop - Login (content & semantics)
describe('Sweet Shop - Login (content)', () => {
  const BASE = 'https://sweetshop.netlify.app/login';

  beforeEach(() => {
    cy.visit(BASE);
  });

  it('has correct header and helper text', () => {
    cy.get('h1.display-3').should('have.text', 'Login');

    // Login page has a single lead paragraph describing email/password entry
    cy.get('header p.lead')
      .should('have.length.at.least', 1)
      .first()
      .should('contain.text', 'email address')
      .and('contain.text', 'password');
  });

  it('abbr tooltips are present for demo creds', () => {
    cy.get('abbr[title="test@user.com"]').should('exist');
    cy.get('abbr[title="qwerty"]').should('exist');
  });

  it('navbar contains the expected items', () => {
    cy.get('nav').should('be.visible');
    cy.get('nav a:visible').then($links => {
      const texts = [...$links].map(a => a.textContent.trim()).join(' | ');
      expect(texts).to.include('Sweets');
      expect(texts).to.include('About');
      expect(texts).to.include('Login');
      expect(texts).to.include('Basket');
    });
  });

  it('social icons present with alt text (warn if missing)', () => {
    cy.get('.social a img').each(($img) => {
      const alt = $img.attr('alt');
      const href = $img.parent('a').attr('href');

      if (!alt || !alt.trim()) {
        cy.log(`⚠️  WARN: social icon missing alt for href=${href || '(no href)'}`);
      } else {
        expect(alt.trim()).to.match(/\S/);
      }
      expect(href, 'social link href exists').to.match(/\S/);
    });
  });

  it('footer is rendered', () => {
    cy.get('footer').should('be.visible');
    cy.get('footer .container').should('contain.text', 'Sweet Shop Project 2018');
  });
});
