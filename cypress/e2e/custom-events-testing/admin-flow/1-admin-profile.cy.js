/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe("Admin Profile Page", () => {
  context("Profile page presents user info", () => {
    beforeEach(() => {
      cy.visit(`${url}user/update`, { timeout: 50000 });
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
});
