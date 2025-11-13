// cypress/e2e/SweetShop/functional/basket.cy.js
// Sweet Shop - Basket (interactions & validation)

require('../support/commands');

describe('Sweet Shop - Basket (functional)', () => {
    const BASE = 'https://sweetshop.netlify.app/basket';

    beforeEach(() => {
        cy.visit(BASE);
    });

    it('navbar badge and sidebar pill show consistent counts', () => {
        cy.readNavbarBasketCount().then((nav) => {
            cy.get('body').then(($b) => {
                if ($b.find('#basketCount').length) {
                    cy.readSidebarBasketCount().then((side) => {
                        expect(side, 'sidebar count').to.be.a('number');
                        expect(side).to.eq(nav);
                    });
                } else {
                    cy.log(' No #basketCount found; skipping sidebar consistency.');
                }
            });
        });
    });

    it('toggling delivery method checks/unchecks radios', () => {
        cy.get('#exampleRadios1').should('be.checked');
        cy.get('#exampleRadios2').check({ force: true }).should('be.checked');
        cy.get('#exampleRadios1').should('not.be.checked');
        cy.get('#exampleRadios1').check({ force: true }).should('be.checked');
        cy.get('#exampleRadios2').should('not.be.checked');
    });

    it('promo code submit does not change origin/path (ignores trailing "?")', () => {
        cy.location().then((before) => {
            cy.get('.input-group input[placeholder="Promo code"]').clear().type('SAVE10');
            cy.contains('button', 'Redeem').click();

            cy.location().should((after) => {
                expect(after.origin, 'origin').to.eq(before.origin);
                expect(after.pathname, 'pathname').to.eq(before.pathname);
                // search may be "" or "?" depending on how the page submits; both are fine
            });
        });
    });

    it('empty submit triggers bootstrap validation and native validity=false', () => {
        cy.get('form.needs-validation').as('form');
        cy.contains('button', 'Continue to checkout').click();

        cy.get('@form').should('have.class', 'was-validated');
        cy.get('@form').then(($f) => {
            expect($f[0].checkValidity(), 'form validity').to.eq(false);
        });

        ['#email', '#address', '#country', '#city', '#zip', '#cc-name', '#cc-number', '#cc-expiration', '#cc-cvv']
            .forEach(sel => {
                cy.get(sel).then(($el) => {
                    expect($el[0].checkValidity(), `${sel} validity`).to.eq(false);
                });
            });
    });

    it('happy path: fills required fields and attempts submit (assert values before submit + path after)', () => {
        // Fill
        cy.get('input#name').eq(0).clear().type('Ada');
        cy.get('input#name').eq(1).clear().type('Lovelace');

        cy.get('#email').clear().type('customer@example.com');
        cy.get('#address').clear().type('123 Main St');
        cy.get('#address2').clear().type('Apt 4B');

        cy.get('#country').select('United Kingdom');
        cy.get('#city').select('Cardiff');
        cy.get('#zip').clear().type('AB12 3CD');

        cy.get('#cc-name').clear().type('Test User');
        cy.get('#cc-number').clear().type('4111111111111111');
        cy.get('#cc-expiration').clear().type('12/29');
        cy.get('#cc-cvv').clear().type('123');

        // Assert values BEFORE submit (page will reload on submit)
        cy.get('input#name').eq(0).should('have.value', 'Ada');
        cy.get('input#name').eq(1).should('have.value', 'Lovelace');
        cy.get('#email').should('have.value', 'customer@example.com');
        cy.get('#address').should('have.value', '123 Main St');
        cy.get('#address2').should('have.value', 'Apt 4B');
        cy.get('#country').find('option:selected').should('have.text', 'United Kingdom');
        cy.get('#city').find('option:selected').should('have.text', 'Cardiff');
        cy.get('#zip').should('have.value', 'AB12 3CD');
        cy.get('#cc-name').should('have.value', 'Test User');
        cy.get('#cc-number').should('have.value', '4111111111111111');
        cy.get('#cc-expiration').should('have.value', '12/29');
        cy.get('#cc-cvv').should('have.value', '123');

        // Submit (page may append "?" and reload)
        cy.location().then((before) => {
            cy.contains('button', 'Continue to checkout').click();
            cy.location().should((after) => {
                expect(after.origin, 'origin').to.eq(before.origin);
                expect(after.pathname, 'pathname').to.eq(before.pathname); // ignore trailing '?'
            });
        });
    });



    it('delete/empty controls are clicked only if present (best-effort)', () => {
        cy.get('body').then(($b) => {
            const hasDelete = $b.find('a:contains("Delete Item")').length > 0;
            const hasEmpty = $b.find('a:contains("Empty Basket")').length > 0;

            if (hasDelete) {
                cy.contains('a', 'Delete Item').click({ force: true });
                cy.wait(200);
            } else {
                cy.log(' No "Delete Item" link on this state — skipping.');
            }

            if (hasEmpty) {
                cy.contains('a', 'Empty Basket').click({ force: true });
                cy.wait(200);
            } else {
                cy.log(' No "Empty Basket" link on this state — skipping.');
            }
        });
    });
});
