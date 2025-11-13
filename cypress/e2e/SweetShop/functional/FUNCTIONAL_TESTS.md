# SweetShop – Functional Test Documentation  
Šiame dokumente aprašomi **funkciniai Cypress testai**, esantys kataloge:


Šie testai tikrina **elgesį ir srautus**: formų validaciją, login’o veikimą, krepšelio elgseną, rūšiavimą, navigaciją ir t. t.

---

## 📁 1. `about.cy.js`
**Tema:** About puslapio funkciniai testai  
**URL:** `https://sweetshop.netlify.app/about`

### ✔ Ką tikrina:
- Ar puslapis sėkmingai užsikrauna ir `title` turi „Sweet Shop“
- Ar URL baigiasi `/about`
- Ar navbar matomas ir turi nuorodas: **Sweets, About, Login, Basket**
- Ar rodomas teisingas header tekstas *“Sweet Shop Project”*
- Ar puslapyje yra aprašomieji paragrafai (`p.lead`) su frazėmis apie **Chrome DevTools**
- Ar footer’e matomas tekstas „Sweet Shop Project 2018“
- Ar esant mobilaus ekrano `viewport`, pagrindinis turinys ir footer vis dar matomi

### ✔ Naudojami metodai:
- `cy.visit()`, `cy.title()`, `cy.url()`
- `cy.get().should('be.visible')`
- `cy.viewport()` – paprastas responsive check

---

## 📁 2. `basket-flows.cy.js`
**Tema:** Krepšelio srautai – svečias vs prisijungęs, pridėjimas / šalinimas  
**Bazinė URL:** `https://sweetshop.netlify.app`

Naudoja custom komandas iš `../support/commands`:
- `cy.loginDemoUser()`
- `cy.emptyBasketIfPresent()`
- `cy.addItemByName()`
- `cy.readNavbarBasketCount()`

### ✔ Ką tikrina (Guest user):
- „Empty basket“ pradinę būseną ir nulinius skaitliukus (kai įmanoma)
- Prekės pridėjimą iš `/sweets` ir:
  - ar **badge** skaičius navbar’e padidėja
  - ar krepšelio puslapyje rodoma teisinga eilutė su preke ir „Total (GBP)“
- Vieno elemento šalinimą ir tai, kad skaitliukas **nesididina**
- „Empty Basket“ funkciją – ištuština krepšelį, jei nuoroda egzistuoja

### ✔ Ką tikrina (Logged-in user):
- Prisijungusiu vartotoju ištuština krepšelį, jei yra daiktų
- Prideda kelias prekes ir **minkštai** tikrina total’ą (0.75 + 1.50 = £2.25), logindamas įspėjimą jei skaičiavimas kitoks
- Visada stengiasi palikti krepšelį švarų (cleanup per „Empty Basket“, jei yra)

### ✔ Naudojami metodai:
- `cy.visit()`, `cy.location()`, `cy.contains().click()`
- Custom Cypress commands (`cy.addItemByName`, `cy.readNavbarBasketCount`, …)
- `cy.get('body').then(...)` – sąlyginiai veiksmai, jeigu elementai yra / nėra

---

## 📁 3. `basket.cy.js`
**Tema:** Krepšelio puslapio interakcijos ir formų validacija  
**URL:** `https://sweetshop.netlify.app/basket`

### ✔ Ką tikrina:
- Ar navbar badge ir sidebar skaitliukas (`#basketCount`) rodo tą pačią reikšmę
- Pristatymo metodo perjungimą:
  - `Collect` vs `Standard Shipping` – radio mygtukų pasirinkimą / atžymėjimą
- Promo kodo įvedimą ir submit:
  - po „Redeem“ URL origin ir path nesikeičia (gali atsirasti tik `?`)
- Tuščias checkout submit:
  - forma gauna klasę `was-validated`
  - HTML5 `checkValidity()` grąžina `false` tiek formai, tiek visiems privalomiems laukams
- „Happy path“:
  - užpildomi VISI būtini billing ir payment laukai (vardas, adresas, kortelės info)
  - prieš submit tikrinama, kad visos reikšmės įvestos teisingai
  - po submit URL origin ir path išlieka tie patys (tik minimalus reload)

- „Delete Item“ ir „Empty Basket“:
  - mygtukai paspaudžiami tik jei egzistuoja
  - įspėjimai log’inami, jei jų nėra

### ✔ Naudojami metodai:
- `cy.get().then(...)` su natūraliu DOM `checkValidity()`
- `cy.location()` prieš ir po submit
- Sąlyginių veiksmų logika per `cy.get('body').then(...)`

---

## 📁 4. `login.cy.js`
**Tema:** Login formos funkcionalumas ir validacija  
**URL:** `https://sweetshop.netlify.app/login`

### ✔ Ką tikrina:
- Login puslapio header’į ir helper tekstą
- El. pašto įvesties semantiką:
  - `type="email"`, `maxlength="255"`, `placeholder="you@example.com"`, `required`, `tabindex="1"`
- Slaptažodžio įvestį:
  - `type="password"`, `maxlength="30"`, `onpaste` atributas, `required`, `tabindex="0"`
- Demo prisijungimo `abbr` tooltip’us („test@user.com“, „qwerty“)
- Tuščią submit:
  - forma pereina į `was-validated`
  - abu laukeliai HTML5 `checkValidity()` grąžina `false`
  - URL lieka `/login`
- Blogas e-mail, bet kažkoks slaptažodis:
  - vėl invalid form ir išliekama `/login`
- Teisingi demo duomenys:
  - submit nuveda **nebe** į `/login`, o į konkrečią `.html` kvito (receipt) nuorodą
- Navbar ir social ikonos:
  - navbar’e yra Sweets, About, Login, Basket
  - social ikonų `<img>` turi `href` linkus; alt trūkumo atveju tik log’inamas įspėjimas

### ✔ Naudojami metodai:
- `cy.location('pathname')`
- Natūralus formos `checkValidity()`
- String apdorojimas iš `location.pathname` (`.match(/\.html$/)`)

---

## 📁 5. `profile.cy.js`
**Tema:** Profilio / paskyros puslapio funkciniai testai ir rūšiavimo logika  
**URL:** `https://sweetshop.netlify.app/account`

Naudoja custom komandą: `cy.loginDemoUser()`.

### ✔ Ką tikrina:
- Navbar elementus (Sweets, About, Login, Basket)
- Basket count – navbar badge ir sidebar pill abu rodo `0`
- Užsakymų lentelę:
  - tiksliai 3 eilutės
  - po rūšiavimo „Order Description“ ir „Order Total“ eilutės kiekvieną kartą išlieka 3
- Rūšiavimą:
  - „Order Description“:
    - pirmas paspaudimas pakeičia užsakymų tvarką
    - antras paspaudimas apverčia pirmojo rezultatą (reverse)
  - „Order Total“:
    - „min/max“ togglinimą – viršuje arba 0.75, arba 8.00
  - „Date Ordered“:
    - dvigubas paspaudimas apverčia ankstesnį rikiavimą
- Chart.js:
  - `window.Chart` egzistuoja ir yra funkcija
  - `<canvas id="transactionChart">` matomas ir turi `width`/`height` > 0

### ✔ Naudojami metodai:
- Helper funkcijos `getOrderNumbers()`, `getTotals()` – DOM transformavimas į masyvus
- `expect(two).to.deep.equal(firstOrder.slice().reverse())` – tvarkos palyginimas
- `cy.window().its('Chart')` – JavaScript bibliotekos buvimas

---

## 📁 6. `SweetShopMainPage.cy.js`
*(kodas su trimis describe blokais: Functional, Navigation, Buttons – testuoja Sweets katalogo pagrindinį puslapį)*  
**URL:** `https://sweetshop.netlify.app/sweets`  
Naudoja utilitus: `priceRe`, `normalizeName`, `resolveUrl`.

### A. **Sweet Shop - Functional**
Tikrina:
- Ar puslapio pavadinime yra „Sweet Shop“ ir rodomas heading’as „Browse sweets“
- Ar yra bent viena produkto kortelė
- Kiekviena kortelė turi:
  - pavadinimą (`.card-title`)
  - aprašymą (`.card-text`)
  - kainą su formatu `£X.XX` ir reikšme > 0
- Nėra dublikuotų prekių pagal „normalizuotą pavadinimą + kainą“
- Visi `.card-img-top` paveikslėliai turi `src`; `alt` trūkumo atveju log’inamas įspėjimas
- Paprasta mobile viewport patikra – kortelės vis dar rodomos

### B. **Sweet Shop - Navigation**
Tikrina:
- Kad navbar nuorodos yra matomos, turi tekstą ir `href`
- Jei `href` yra absoliutus arba prasideda `/`, atliekamas HTTP request ir tikrinamas status 200–399
- Paspaudimai ant kiekvienos nuorodos:
  - jei nuoroda turėtų keisti puslapį – tikrinama, kad URL pasikeičia
  - jei tai savęs-nuoroda – leidžiama nepasikeisti
- Po navigacijos grįžtama į `/sweets` (`cy.go('back')`)

### C. **Sweet Shop - Buttons & Interactions**
Tikrina:
- Kad kiekviena produktų kortelė turi „Add to Basket“ mygtuką
- Kad pirmo „Add to Basket“ paspaudimas padidina krepšelio badge skaičių navbar’e (skaičius > 0)

### ✔ Naudojami metodai:
- `cy.request()` su `failOnStatusCode: false` – link’ų statusui tikrinti
- Rekursinė `testNavLinkAtIndex(index)` funkcija nuosekliai testuoja visus navbar linkus
- Badge skaičiaus pavertimas į Number ir validacija
