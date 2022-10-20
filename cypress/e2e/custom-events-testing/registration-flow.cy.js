/// <reference types="cypress" />
const url = Cypress.env("local");
const user = Cypress.env("user");

context("Registration Navigation", () => {
  beforeEach(() => {
    cy.visit(url, { timeout: 50000 });
  });

  it("Navigates to the regisrtation page when clicking on the register button", () => {
    cy.get(".p-button").contains("Register").click();
    cy.location("pathname").should("include", "registration");
  });

  it("Navigates to the regisrtation page when clicking on the register dropdown", () => {
    cy.get(".dropdown-account").contains(user).click();
    cy.get(".dropdown-account").contains("My Registration").click();
    cy.location("pathname").should("include", "registration");
  });
});

context("Registration Fuctional and Displays Information", () => {
  beforeEach(() => {
    cy.visit(`${url}create/registration`);
  });

  it("Opens and closes the edit pop-up for financial information", () => {
    cy.get("#personal-registration-table .edit-button")
      .contains("Edit")
      .click();
    cy.get(".financial-registration-form")
      .contains("Organizational Information")
      .should("be.visible");

    cy.get(".registration-dialog .p-dialog-header-close").click();
    cy.get(".financial-registration-form").should("not.exist");
  });

  it("Opens and closes the delete confirmation pop-up", () => {
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
