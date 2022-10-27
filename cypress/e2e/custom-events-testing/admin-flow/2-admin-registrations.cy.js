/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe("Admin Registrations Page", () => {
  context("Registrations page shows all admin navigation features", () => {
    beforeEach(() => {
      cy.visit(`${url}admin`, { timeout: 50000 });
    });

    it("displays functional table count button", () => {
      cy.get(`button .p-button .p-component`)
        .contains("Table Count")
        .should("exist");
      cy.get(`button .p-button .p-component`).contains("Table Count").click();
      cy.get(`.p-dialog-header`).contains("Table Information").should("exist");
      cy.get(`button .p-dialog-header-close`).click();
      cy.get(`.p-dialog-header`)
        .contains("Table Information")
        .should("not.be.visible");
    });

    it("displays admin nav bar with all items", () => {
      cy.get(".admin-nav").contains("Registrations").should("exist");
      cy.get(".admin-nav").contains("Guests").should("exist");
      cy.get(".admin-nav").contains("Tables").should("exist");
      cy.get(".admin-nav").contains("Event Planning").should("exist");
    });

    it("displays Admin Portal button", () => {
      cy.get("form button").contains("Admin Portal").should("exist");
    });
  });

  context("Registrations page shows all registrations and details", () => {
    beforeEach(() => {
      cy.visit(`${url}admin`, { timeout: 50000 });
    });

    it("displays registration status message", () => {
      cy.get(".p-message-wrapper").contains("You").should("exist");
    });
    it("displays disabled username and details", () => {
      cy.get(`form #input-user-register-username`).should("be.disabled");
      cy.get(`form #input-user-register-firstname`).should("be.disabled");
      cy.get(`form #input-user-register-lastname`).should("be.disabled");
    });

    it("displays Admin Portal button", () => {
      cy.get("form button").contains("Admin Portal").should("exist");
    });
  });

  context(
    "Registrations page allow edits and linking to view specific registrations ",
    () => {
      beforeEach(() => {
        cy.visit(`${url}admin`, { timeout: 50000 });
      });

      it("displays registration status message", () => {
        cy.get(".p-message-wrapper").contains("You").should("exist");
      });
      it("displays disabled username and details", () => {
        cy.get(`form #input-user-register-username`).should("be.disabled");
        cy.get(`form #input-user-register-firstname`).should("be.disabled");
        cy.get(`form #input-user-register-lastname`).should("be.disabled");
      });

      it("displays Admin Portal button", () => {
        cy.get("form button").contains("Admin Portal").should("exist");
      });
    }
  );
});
