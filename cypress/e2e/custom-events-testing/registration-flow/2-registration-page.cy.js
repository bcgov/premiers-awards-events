/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe("Registration Navigation Process", () => {
  context("Registration Page for registrar", () => {
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
});

describe("Registration Functional and Displays Information", () => {
  context("Page Buttons", () => {
    beforeEach(() => {
      cy.visit(`${url}create/registration`);
    });

    it("opens and closes the edit pop-up for financial information", () => {
      cy.get("#personal-registration-table .edit-button")
        .contains("Edit")
        .click();
      cy.get(".financial-registration-form")
        .contains("Organizational Information")
        .should("be.visible");

      cy.get(".registration-dialog .p-dialog-header-close").click();
      cy.get(".financial-registration-form").should("not.exist");
    });

    it("opens and closes the delete confirmation pop-up", () => {
      cy.get("#personal-registration-table .delete-button")
        .contains("Delete")
        .click();
      cy.get(".confirmation-content")
        .contains("Are you sure you want to delete")
        .should("be.visible");

      cy.get(".p-button").contains("No").click();
      cy.get(".confirmation-content").should("not.exist");
    });
  });
});
