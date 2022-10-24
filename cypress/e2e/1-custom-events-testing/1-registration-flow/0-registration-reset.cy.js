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
      beforeEach(() => {
        cy.visit(`${url}create/registration`, { timeout: 50000 });
      });
      it("confirm deletion of the current registration", () => {
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
