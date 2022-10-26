/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");
require("dotenv").config();
("use strict");

// initialization settings
const nodeEnv = process.env.NODE_ENV;

if (nodeEnv === "local" || nodeEnv === "test" || nodeEnv === "development") {
  describe("Create Blank Slate in local env for Testing Registration Process", () => {
    context("Deletes Current Registration", () => {
      before(() => {
        //cy.visit(`${url}create/registration`, { timeout: 50000 });
        cy.visit(url, { timeout: 50000 });
        cy.get(".dropdown-account .p-menuitem-link span")
          .contains(user)
          .click();
        cy.get(".dropdown-account").contains("My Registration").click();
      });
      it("unsubmits the registration", () => {
        cy.get(`.submission-buttons button`)
          .contains("Unsubmit Registration")
          .click();
        cy.get(".p-dialog-header")
          .contains("Confirm Submission")
          .should("be.visible");

        cy.get(".p-button").contains("Re-open registration").click();

        cy.get(".p-message-text")
          .contains("Successfully re-opened registration!")
          .should("exist");
        cy.get(".p-dialog-header-close").click();

        cy.get(".p-dialog-header")
          .contains("Confirm Submission")
          .should("not.exist");
        cy.get(`.submission-buttons button`)
          .contains("Submit Registration")
          .should("exist");

        cy.get("#personal-registration-table td")
          .contains("Pending")
          .should("exist");
      });
      it("confirms deletion of the current registration", () => {
        Cypress.$("document").ready(function () {
          cy.wait(1000);
          cy.get("#personal-registration-table .delete-button")
            .contains("Delete")
            .click();
          cy.wait(1000);
          cy.get(".confirmation-content")
            .contains("Are you sure you want to delete")
            .should("be.visible");

          cy.get(".p-button").contains("Yes").click();
          cy.visit(`${url}`, { timeout: 50000 });
          cy.get(".confirmation-content").should("not.exist");
        });
      });
    });
  });
}
