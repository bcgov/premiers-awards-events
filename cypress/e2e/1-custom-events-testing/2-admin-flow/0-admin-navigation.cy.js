/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe("Admin Navigation Process", () => {
  context("Registration Page for admin", () => {
    beforeEach(() => {
      cy.visit(url, { timeout: 50000 });
    });

    it("navigates to the registration page when clicking on the register button", () => {
      Cypress.$("document").ready(function () {
        cy.get(".p-button").contains("Register").click();
        cy.location("pathname").should("include", "registration");
      });
    });

    it("navigates to the registration page when clicking on the register dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("My Registration").click();
        cy.location("pathname").should("include", "registration");
      });
    });
  });
  context("View Profile Page for admin", () => {
    beforeEach(() => {
      cy.visit(url, { timeout: 50000 });
    });
    it("navigates to the registration page when clicking on the register dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("View Profile").click();
        cy.location("pathname").should("include", "user/update");
      });
    });
  });
});
