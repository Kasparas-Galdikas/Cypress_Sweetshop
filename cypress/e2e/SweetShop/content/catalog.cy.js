// Strict content check against a known hardcoded catalog.
// Keep this in a separate suite to avoid noisy failures when content is updated.

const priceRe = /^£\d+\.\d{2}$/;

function readDomList() {
  return cy.get('.card').then(($cards) => {
    const list = [];
    $cards.each((_, card) => {
      const $c = Cypress.$(card);
      const name = $c.find('.card-title').text().trim();
      const price = $c.find('.text-muted').text().trim();
      list.push({ name, price });
    });
    return list;
  });
}

function toMap(list) {
  const map = new Map();
  list.forEach(({ name, price }) => map.set(`${name}||${price}`, true));
  return map;
}

describe('Sweet Shop - Content Integrity', () => {
  before(() => {
    cy.visit('https://sweetshop.netlify.app/sweets');
  });

  it('matches the expected catalog (names + prices, order-agnostic)', () => {
    cy.fixture('SweetsContent.json').then((expected) => {
      // basic price sanity in the expected table (helps catch typos in fixture)
      expected.forEach(x => {
        expect(x.price).to.match(priceRe);
        expect(Number(x.price.replace('£',''))).to.be.greaterThan(0);
      });

      readDomList().then((actual) => {
        // 1) Exact count check (snapshot)
        expect(actual.length, 'count').to.eq(expected.length);

        // 2) Every actual price is well-formed and > 0
        actual.forEach(x => {
          expect(x.price).to.match(priceRe);
          expect(Number(x.price.replace('£',''))).to.be.greaterThan(0);
        });

        // 3) Set equality (ignoring order)
        const expMap = toMap(expected);
        const actMap = toMap(actual);

        // Missing items
        expected.forEach((e) => {
          const key = `${e.name}||${e.price}`;
          expect(actMap.has(key), `missing item: ${key}`).to.eq(true);
        });

        // Unexpected items
        actual.forEach((a) => {
          const key = `${a.name}||${a.price}`;
          expect(expMap.has(key), `unexpected item: ${key}`).to.eq(true);
        });
      });
    });
  });
});
