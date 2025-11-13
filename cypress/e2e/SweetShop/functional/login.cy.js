// cypress/e2e/SweetShop/functional/login.cy.js

// Sweet Shop - Login (functional & flows)
describe('Sweet Shop - Login (functional)', () => {
  const BASE = 'https://sweetshop.netlify.app/login';

  const els = {
    email: '#exampleInputEmail',
    password: '#exampleInputPassword',
    submitBtn: 'form .btn.btn-primary', // button id is randomized, so use classes
    form: 'form.needs-validation',
    navbar: 'nav.navbar',
  };

  beforeEach(() => {
    cy.visit(BASE);
  });

  it('renders header and helper text', () => {
    cy.get('h1.display-3').should('have.text', 'Login');

    // The login page has a single lead paragraph that mentions email + password
    cy.get('header p.lead')
      .should('have.length.at.least', 1)
      .first()
      .should('contain.text', 'email address')
      .and('contain.text', 'password');
  });

  it('email input semantics are correct', () => {
    cy.get(els.email).should(($el) => {
      expect($el).to.have.attr('type', 'email');
      expect($el).to.have.attr('maxlength', '255');
      expect($el).to.have.attr('placeholder', 'you@example.com');
      // boolean attributes are best verified via .prop
      expect($el).to.have.prop('required', true);
      // tabindex is set to 1 in the markup
      expect($el).to.have.attr('tabindex', '1');
    });
  });

  it('password input semantics are correct', () => {
    cy.get(els.password).should(($el) => {
      expect($el).to.have.attr('type', 'password');
      expect($el).to.have.attr('maxlength', '30');
      // paste is blocked via inline handler; just check it exists
      expect($el).to.have.attr('onpaste');
      expect($el).to.have.prop('required', true);
      // tabindex is set to 0 in the markup
      expect($el).to.have.attr('tabindex', '0');
    });
  });

  it('abbr tooltips for demo creds exist', () => {
    cy.get('abbr[title="test@user.com"]').should('exist');
    cy.get('abbr[title="qwerty"]').should('exist');
  });

  it('wrong path: empty submit keeps you on /login and triggers validation', () => {
    cy.location('pathname').should('include', '/login');
    cy.get(els.submitBtn).click();

    // Form should have Bootstrap validation class added
    cy.get(els.form).should('have.class', 'was-validated');

    // Native validity API shows the form is invalid
    cy.get(els.form).should(($form) => {
      const formEl = $form[0];
      expect(formEl.checkValidity()).to.eq(false);
    });

    // Inputs should be invalid
    cy.get(els.email).then(($el) => {
      expect($el[0].checkValidity(), 'email validity').to.eq(false);
    });
    cy.get(els.password).then(($el) => {
      expect($el[0].checkValidity(), 'password validity').to.eq(false);
    });

    // Still on /login
    cy.location('pathname').should('include', '/login');
  });

  it('wrong path: bad email but some password still fails', () => {
    cy.get(els.email).clear().type('not-an-email');
    cy.get(els.password).clear().type('x');
    cy.get(els.submitBtn).click();

    cy.get(els.form).should('have.class', 'was-validated');
    cy.get(els.email).then(($el) => {
      expect($el[0].checkValidity(), 'email validity').to.eq(false);
    });
    cy.location('pathname').should('include', '/login');
  });

  it('happy path: valid creds redirect away from /login to a .html receipt page', () => {
    // Per page hint, these demo creds are valid
    cy.get(els.email).clear().type('test@user.com');
    cy.get(els.password).clear().type('qwerty');

    // Click login — site sets window.location to a specific .html file
    cy.get(els.submitBtn).click();

    // Assert we left /login and landed on an html page (UUID-like filename)
    cy.location('pathname').should((p) => {
      expect(p, 'left /login').to.not.include('/login');
      expect(p, 'landed on .html').to.match(/\.html$/);
    });
  });

  it('navbar renders and has expected items', () => {
    cy.get(els.navbar).should('be.visible');
    cy.get(`${els.navbar} a:visible`).then(($links) => {
      const texts = [...$links].map(a => a.textContent.trim()).join(' | ');
      expect(texts).to.include('Sweets');
      expect(texts).to.include('About');
      expect(texts).to.include('Login');
      expect(texts).to.include('Basket');
    });
  });

  it('social icons exist and have links (warn if alt missing)', () => {
    cy.get('.social a img').each(($img) => {
      const alt = $img.attr('alt');
      const href = $img.parent('a').attr('href');

      // Looser alt check: warn instead of fail
      if (!alt || !alt.trim()) {
        cy.log(`⚠️  WARN: social icon missing alt for href=${href || '(no href)'}`);
      } else {
        expect(alt.trim()).to.match(/\S/);
      }

      expect(href, 'social link href exists').to.match(/\S/);
    });
  });
});
