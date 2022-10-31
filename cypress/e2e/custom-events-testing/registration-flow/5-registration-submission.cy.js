/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe.skip("Users can submit a registration.", () => {
  context("Submission/unsubmission/resubmission of registration", () => {
    beforeEach(() => {
      cy.visit(`${url}create/registration`);
    });

    it("submits the registration", () => {
      cy.get(`.submission-buttons button`)
        .contains("Submit Registration")
        .click();
      cy.get(".p-dialog-header")
        .contains("Confirm Submission")
        .should("be.visible");

      cy.get(".p-disabled")
        .contains("Confirm submit registration")
        .should("exist");

      cy.get("#minister-approval").click();
      cy.get(".p-disabled")
        .contains("Confirm submit registration")
        .should("not.exist");

      cy.get(".p-button").contains("Confirm submit registration").click();

      cy.get(".p-message-text")
        .contains("Successfully submitted registration!")
        .should("exist");
      cy.get(".p-dialog-header-close").click();

      cy.get(".p-dialog-header")
        .contains("Confirm Submission")
        .should("not.exist");
      cy.get(`.submission-buttons button`)
        .contains("Unsubmit Registration")
        .should("exist");

      cy.get("#personal-registration-table td")
        .contains("Submitted")
        .should("exist");
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
    it("resubmits the registration", () => {
      cy.get(`.submission-buttons button`)
        .contains("Submit Registration")
        .click();
      cy.get(".p-dialog-header")
        .contains("Confirm Submission")
        .should("be.visible");

      cy.get(".p-disabled")
        .contains("Confirm submit registration")
        .should("exist");

      cy.get("#minister-approval").click();
      cy.get(".p-disabled")
        .contains("Confirm submit registration")
        .should("not.exist");

      cy.get(".p-button").contains("Confirm submit registration").click();

      cy.get(".p-message-text")
        .contains("Successfully submitted registration!")
        .should("exist");
      cy.get(".p-dialog-header-close").click();

      cy.get(".p-dialog-header")
        .contains("Confirm Submission")
        .should("not.exist");
      cy.get(`.submission-buttons button`)
        .contains("Unsubmit Registration")
        .should("exist");

      cy.get("#personal-registration-table td")
        .contains("Submitted")
        .should("exist");
    });
  });
});
