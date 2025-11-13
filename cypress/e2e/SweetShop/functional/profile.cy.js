// cypress/e2e/SweetShop/functional/profile.cy.js
// Sweet Shop - Profile/Account (functional & interactions)

require('../support/commands');

describe('Sweet Shop - Profile (functional)', () => {
  beforeEach(() => {
    cy.loginDemoUser();
  });

  const table = {
    root: '#transactions',
    rows: '#transactions tbody tr',
    firstRow: '#transactions tbody tr:first',
    thNumberInRow: 'th[scope="row"]',
    tdsInRow: 'td',
    hdr: {
      number: '#transactions thead .order-number',
      date: '#transactions thead .order-date',
      desc: '#transactions thead .order-description',
      total: '#transactions thead .order-total',
    },
  };

  function getOrderNumbers() {
    return cy.get(table.rows).then(($trs) =>
      [...$trs].map(tr => tr.querySelector('th[scope="row"]').textContent.trim())
    );
  }

  function getTotals() {
    return cy.get(table.rows).then(($trs) =>
      [...$trs].map(tr => tr.querySelectorAll('td')[2].textContent.trim())
    );
  }

  it('navbar is visible and contains expected items', () => {
    cy.get('nav.navbar').should('be.visible');
    cy.get('nav.navbar a:visible').then(($links) => {
      const texts = [...$links].map(a => a.textContent.trim()).join(' | ');
      expect(texts).to.include('Sweets');
      expect(texts).to.include('About');
      expect(texts).to.include('Login');
      expect(texts).to.include('Basket');
    });
  });

  it('basket counts are consistent (navbar badge and sidebar pill)', () => {
    cy.get('nav.navbar a[href="/basket"] .badge').should('contain.text', '0');
    cy.get('.badge.badge-secondary.badge-pill').should('contain.text', '0');
  });

  it('table has exactly 3 rows and remains stable after sorts', () => {
    cy.get(table.rows).should('have.length', 3);

    // Click a couple of sorts and ensure row count never changes
    cy.get(table.hdr.desc).click();
    cy.get(table.rows).should('have.length', 3);
    cy.get(table.hdr.desc).click();
    cy.get(table.rows).should('have.length', 3);
  });

  it('clicking "Order Description" changes order, second click reverses previous', () => {
    let afterFirst = null;

    getOrderNumbers().then((initial) => {
      // First click: order should change
      cy.get(table.hdr.desc).click();

      getOrderNumbers().then((one) => {
        afterFirst = one.slice();
        expect(one.join(','), 'order changed after first click')
          .to.not.equal(initial.join(','));

        // Second click: should be exact reverse of the first
        cy.get(table.hdr.desc).click();

        getOrderNumbers().then((two) => {
          const reversed = afterFirst.slice().reverse();
          expect(two, 'second click reverses previous').to.deep.equal(reversed);
        });
      });
    });
  });

  it('clicking "Order Total" toggles min/max at the top', () => {
    // The dataset totals are 1.50, 0.75, 8.00
    cy.get(table.hdr.total).click();

    cy.get(table.firstRow).find('td').eq(2).invoke('text').then((txt1) => {
      const t1 = txt1.trim();
      expect(['0.75', '8.00']).to.include(t1);

      cy.get(table.hdr.total).click();

      cy.get(table.firstRow).find('td').eq(2).invoke('text').then((txt2) => {
        const t2 = txt2.trim();
        // After toggle, it should flip to the other extreme
        if (t1 === '0.75') {
          expect(t2).to.equal('8.00');
        } else {
          expect(t2).to.equal('0.75');
        }
      });
    });
  });

  it('clicking "Date Ordered" twice reverses the previous order', () => {
    let firstOrder = null;

    getOrderNumbers().then(() => {
      cy.get(table.hdr.date).click();

      getOrderNumbers().then((one) => {
        firstOrder = one.slice();

        cy.get(table.hdr.date).click();

        getOrderNumbers().then((two) => {
          expect(two).to.deep.equal(firstOrder.slice().reverse());
        });
      });
    });
  });

  it('Chart.js is present and the chart canvas has a renderable size', () => {
    cy.window().its('Chart').should('be.a', 'function');
    cy.get('#transactionChart')
      .should('be.visible')
      .and(($c) => {
        const el = $c[0];
        // Ensure the canvas is actually sized (renderable)
        expect(el.width).to.be.greaterThan(0);
        expect(el.height).to.be.greaterThan(0);
      });
  });
});
