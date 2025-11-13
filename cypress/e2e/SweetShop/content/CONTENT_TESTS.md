#  SweetShop – Content Test Documentation  
Šiame dokumente pateikiami visi **SweetShop front-end turinio testai**, esantys kataloge:


Kiekvienas testų failas tikrina, ar puslapiai turi teisingą tekstą, struktūrą, semantiką ir UI elementus.  
Testai neskaito API ar logikos – tikrinamas **UI turinys, HTML semantika ir statiniai duomenys**.

---

# 📁 1. `about-content.cy.js`
**Tema:** *About puslapio statinio turinio tikrinimas*  
**URL:** `https://sweetshop.netlify.app/about`

### ✔ Testuoja:
- Pagrindinės antraštės ir projekto aprašymo tekstą  
- Raktažodžius: *“Sweet Shop Project”*, *“Chrome DevTools”*, metų informaciją  
- Ar egzistuoja visi pagrindiniai informaciniai blokai

### ✔ Metodai:
- `cy.visit()` — atidaro About puslapį  
- `cy.contains()` — ieško teksto pagal fragmentą  
- `should('exist')` — tikrina ar elementas yra DOM'e

---

# 📁 2. `basket-content.cy.js`  
**Tema:** *Krepšelio puslapio turinys, antraštės, elementų struktūra ir formos semantika*  
**URL:** `https://sweetshop.netlify.app/basket`

### ✔ Testuoja:
- Krepšelio antraštes, helper tekstus  
- Navigacijos meniu elementus (About, Login, Basket…)  
- Krepšelio skaitliukus (navbar + sidebar)  
- Prekių sąrašą ir total'o bloką  
- Pristatymo pasirinkimus („Collect”, „Standard Shipping”)  
- Promo code UI struktūrą  
- Viso billing & payment formos būtinumą (required laukus)  
- Pasikartojančius `id="name"` įrašo kaip *warning*  
- Footer turinį ir matomumą

### ✔ Metodai:
- `cy.get()` — ieško elementų pagal CSS selektorius  
- `.should('have.text')` — tikslaus teksto sutikrinimas  
- `.should('have.value')` — input’ų reikšmės  
- `.then()` — logika su sąlygomis, nestandartiniai tikrinimai  
- `cy.log()` — įspėjamieji pranešimai (ne test fail)

---

# 📁 3. `catalog.cy.js`  
**Tema:** *Viso prekių katalogo turinio vientisumas*  
**URL:** `https://sweetshop.netlify.app/sweets`

### ✔ Testuoja:
- Kiekvienos prekės pavadinimą + kainą  
- Ar DOM katalogas sutampa su `fixtures/SweetsContent.json`  
- Kainų formato tikslumą: `£X.XX`  
- Elementų kiekį DOM'e  
- Ar nėra netikėtų prekių / kainų  
- Ar kainos > £0.00  
- Požymių suvedimą į Map (set equality)

### ✔ Metodai:
- `cy.fixture()` — nuskaito JSON katalogo etaloną  
- Custom helperiai (`readDomList()`, `toMap()`)  
- Regex (`priceRe`) kainų formatui tikrinti  
- DOM sąrašų analizė su `.each()`, `.text()`

---

# 📁 4. `login-content.cy.js`  
**Tema:** *Login puslapio HTML turinys ir UI elementai*  
**URL:** `https://sweetshop.netlify.app/login`

### ✔ Testuoja:
- Puslapio antraštę *“Login”*  
- Pagalbinį tekstą apie el. paštą ir slaptažodį  
- Demo prisijungimo `abbr` elementus (tooltip)  
- Navigacijos meniu elementus  
- Social ikonų `alt` atributus  
- Footer egzistavimą

### ✔ Metodai:
- `cy.contains()`  
- `.each()` iteracija per social icon/img  
- `.should('have.attr')`  
- Įspėjimai per `cy.log()` jei trūksta alt tekstų

---

# 📁 5. `profile-content.cy.js`  
**Tema:** *Paskyros puslapio statinis turinys ir istorinių užsakymų lentelė*  
**URL:** `https://sweetshop.netlify.app/account`

### ✔ Testuoja:
- Teisingą antraštę “Your Account”  
- Sveikinimo tekstą su vartotojo el. paštu  
- Navbar struktūrą + Basket badge  
- Sidebar heading ir basket count  
- Užsakymų lentelę su 3 tiksliai aprašytomis eilutėmis  
- Teisingą header struktūrą (Order Number, Date, Description, Total)  
- Sortavimo nuorodas (`javascript:SortTable()`)  
- Chart.js grafiko renderinimą  
- Footer egzistavimą

### ✔ Metodai:
- `cy.loginDemoUser()` — custom login komanda  
- `.within()` — kontekstinis DOM tikrinimas  
- `.its('Chart')` — tikrina Chart.js egzistavimą Window objekte  
- `.should('contain.text')`

