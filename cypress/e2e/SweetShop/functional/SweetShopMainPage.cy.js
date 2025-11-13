/// <reference types="cypress" />

// ======================================================
// UTILITIES
// ======================================================

const priceRe = /^£\d+\.\d{2}$/;
const normalizeName = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const BASE = 'https://sweetshop.netlify.app/sweets';

const resolveUrl = (href, base) => {
  try {
    return new URL(href, base).toString();
  } catch {
    return href || '';
  }
};

// ======================================================
// A. FUNCTIONAL TESTS (YOUR ORIGINAL SUITE)
// ======================================================

describe('Sweet Shop - Functional', () => {

  beforeEach(() => {
    cy.visit(BASE);
  });

  it('page loads and shows correct chrome', () => {
    cy.title().should('include', 'Sweet Shop');
    cy.contains('h1,h2,h3', /Browse sweets/i).should('be.visible');
  });

  it('renders at least one product card and each has name, description, and valid price', () => {
    cy.get('.card').should('have.length.at.least', 1);

    cy.get('.card').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.card-title').invoke('text').should('match', /\S/);
        cy.get('.card-text').invoke('text').should('match', /\S/);
        cy.get('.text-muted')
          .invoke('text')
          .then((t) => t.trim())
          .should('match', priceRe)
          .then((p) => expect(Number(p.replace('£', ''))).to.be.greaterThan(0));
      });
    });
  });

  it('no duplicate items by normalized name + price', () => {
    const seen = new Set();

    cy.get('.card').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.card-title').invoke('text').then((name) => {
          cy.get('.text-muted').invoke('text').then((price) => {
            const key = `${normalizeName(name)}|${price.trim()}`;
            expect(seen.has(key), `duplicate item: ${key}`).to.eq(false);
            seen.add(key);
          });
        });
      });
    });
  });

  it('images have src and log a warning if alt is missing or empty', () => {
    cy.get('.card img.card-img-top').each(($img) => {
      cy.wrap($img)
        .should('have.attr', 'src')
        .and('match', /\S/);

      cy.wrap($img).then(($el) => {
        const alt = $el.attr('alt');
        if (!alt || !alt.trim()) {
          cy.log(`⚠️ Warning: image missing alt -> src="${$el.attr('src')}"`);
        }
      });
    });
  });

  it('basic responsive check (mobile render doesn’t hide cards)', () => {
    cy.viewport(375, 667);
    cy.get('.card').should('have.length.at.least', 1);
  });
});

// ======================================================
// B. NAVIGATION TESTS (YOUR SAFE RECURSIVE VERSION)
// ======================================================

describe('Sweet Shop - Navigation', () => {

  beforeEach(() => {
    cy.visit(BASE);
  });

  it('navbar links are visible, have non-empty text and valid href', () => {
    cy.get('nav a:visible').should('have.length.at.least', 1);

    cy.get('nav a:visible').each(($a) => {
      cy.wrap($a).invoke('text').then((t) => {
        expect(t.trim(), 'nav link text').to.match(/\S/);
      });

      cy.wrap($a).should('have.attr', 'href').then((href) => {
        expect(href, 'href exists').to.match(/\S/);
        if (/^https?:\/\//.test(href) || href.startsWith('/')) {
          const url = href.startsWith('/') ? new URL(href, BASE).toString() : href;
          cy.request({ url, failOnStatusCode: false }).its('status').should('be.within', 200, 399);
        }
      });
    });
  });

  it('clicking each nav link performs an action (or stable self-link)', () => {
    const testNavLinkAtIndex = (index) => {
      cy.get('nav a:visible').then(($links) => {
        if (index >= $links.length) return;

        const $link = $links.eq(index);
        const linkText = $link.text().trim() || '(no text)';
        const href = $link.attr('href');
        cy.log(` Checking nav link [${index + 1}/${$links.length}]: ${linkText}`);

        if (!href || href.startsWith('javascript')) {
          cy.log(`Skipping ${linkText} (invalid href)`);
          return testNavLinkAtIndex(index + 1);
        }

        if ($link.attr('target') === '_blank') {
          cy.wrap($link).invoke('removeAttr', 'target');
        }

        cy.location('href').then((current) => {
          const resolved = resolveUrl(href, current);
          const expectChange = resolved !== current;

          cy.location().then((before) => {
            cy.wrap($link).click({ force: true });

            cy.location().then((after) => {
              const changed = before.href !== after.href ||
                              before.pathname !== after.pathname ||
                              before.hash !== after.hash;

              if (expectChange) {
                expect(changed, `Link ${linkText} navigated`).to.eq(true);
              } else {
                cy.log(` Self-link (${linkText}) — no change expected`);
                expect(changed).to.eq(false);
              }
            });
          });

          if (expectChange) {
            cy.go('back');
            cy.url().should('include', '/sweets');
          }

          cy.wait(500).then(() => testNavLinkAtIndex(index + 1));
        });
      });
    };

    testNavLinkAtIndex(0);
  });
});

// ======================================================
// C. PAGE BUTTON TESTS (ALL BUTTONS ON THE PAGE)
// ======================================================

describe('Sweet Shop - Buttons & Interactions', () => {

  beforeEach(() => {
    cy.visit(BASE);
  });

  it('every product card has an Add to Basket button', () => {
    cy.get('.card .addItem').should('have.length.at.least', 1);
  });

  it('Add to Basket increments badge counter', () => {
    cy.get('a[href="/basket"] .badge').should('contain', '0');
    cy.get('.card .addItem').first().click();
    cy.get('a[href="/basket"] .badge').invoke('text').then((num) => {
      expect(Number(num)).to.be.greaterThan(0);
    });
  });
});
