describe("Bejelentkezés folyamata", () => {
  beforeEach(() => {
    // Minden teszt előtt meglátogatjuk a login oldalt
    cy.visit("/login");
  });

  it("Sikertelen login üres mezőkkel (Bootstrap validáció)", () => {
    // Megnyomjuk a gombot anélkül, hogy írnánk valamit
    cy.get('button[type="submit"]').click();

    // Ellenőrizzük, hogy a form megkapta-e a Bootstrap 'was-validated' osztályát
    cy.get("form").should("have.class", "was-validated");

    // Ellenőrizzük, hogy a hibaüzenet látható-e
    cy.get(".invalid-feedback")
      .should("be.visible")
      .and("contain", "Az email üres");
  });

  it('Bejelentkezés tesztelése', () => {
  // A csillagok segítik, hogy akkor is elkapja, ha a localhost:8000 vagy 5173 kavar be
  cy.intercept('POST', '**/login**').as('loginReq');
  
  cy.visit('/login');
  
  cy.get('#email').type('teszt@elek.hu');
  
  // Próbáljuk meg az input típusa alapján megfogni a jelszót, 
  // mert a label-parent-find lánc néha megszakad
  cy.get('input[type="password"]').type('jelszo123');
  
  cy.get('button[type="submit"]').click();
  
  // Itt várjuk a hálózati kérést
  cy.wait('@loginReq').its('response.statusCode').should('be.oneOf', [200, 201, 401]);
  });


  it("Hibaüzenet megjelenítése helytelen jelszó esetén", () => {
    // Szimuláljuk, hogy a szerver 401-es hibát (Unauthorized) küld vissza
    cy.intercept("POST", "**/login**", {
      statusCode: 401,
      body: { message: "Hibás email vagy jelszó!" },
    }).as("failedLogin");

    cy.get("#email").type("rossz@email.hu");
    cy.contains("label", "Jelszavad")
      .parent()
      .find("input")
      .type("rosszjelszo");
    cy.get('button[type="submit"]').click();

    // Megvárjuk a "kamu" 401-es választ
    cy.wait("@failedLogin");

    // Ellenőrizzük, hogy megjelent-e a hibaüzenet a képernyőn
    // Itt a ToastContainer-ed osztályát vagy szövegét kell keresni
    cy.contains("Hibás email vagy jelszó!").should("be.visible");

    // Az URL pedig maradjon a /login-on
    cy.url().should("include", "/login");
  });
});
