/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe("Users can add and edit guests to a registration.", () => {
  context("Guest add and edit functionality", () => {
    beforeEach(() => {
      cy.visit(`${url}create/registration`);
    });

    it("opens 'add guests' popup and adds one guest", () => {
      cy.get(`[aria-label="Add Guests"]`).click();
      cy.get(".guest-registration-form").should("be.visible");

      cy.get(".guest-registration-form .p-autocomplete-dropdown").click();

      cy.fixture("guest-info").then((guests) => {
        const { guest1 } = guests;
        cy.get(".p-autocomplete-panel li")
          .contains(guest1["organization"])
          .click();

        cy.get(".text-field #firstname").type("{selectAll}", "{del}");
        cy.get(".text-field #firstname").type(guest1["firstname"]);

        cy.get(".text-field #lastname").type("{selectAll}", "{del}");
        cy.get(".text-field #lastname").type(guest1["lastname"]);

        cy.get("#attendancetype .p-dropdown-trigger").click();
        cy.get("#attendancetype_list li")
          .contains(guest1["attendancetype"])
          .click();

        for (let each of guest1["accessibility"]) {
          cy.get(`#accessibility-checkbox`)
            .contains(each)
            .children(".p-checkbox")
            .invoke("addClass", "p-checkbox-checked");
        }
        for (let each of guest1["dietary"]) {
          cy.get(`[value="${each.toLowerCase().replace(/\s/g, "")}"]`).check();
        }

        cy.get(".guest-registration-form button").contains("Add Guest").click();
        cy.get(".p-dialog .p-dialog-header-close").click();
        cy.get(".guest-registration-form").should("not.exist");

        cy.get("p-datatable-table td")
          .not("#personal-registration-table td")
          .contains(guest1["organization"])
          .should("exist");

        cy.get("p-datatable-table td")
          .not("#personal-registration-table td")
          .contains(guest1["firstname"])
          .should("exist");

        cy.get("p-datatable-table td")
          .not("#personal-registration-table td")
          .contains(guest1["lastname"])
          .should("exist");

        cy.get("p-datatable-table td")
          .not("#personal-registration-table td")
          .contains(guest1["attendancetype"])
          .should("exist");

        cy.get("p-datatable-table td")
          .not("#personal-registration-table td")
          .contains(guest1["accessibility"])
          .should("exist");

        cy.get("p-datatable-table td")
          .not("#personal-registration-table td")
          .contains(guest1["dietary"])
          .should("exist");
      });
    });
  });
});
