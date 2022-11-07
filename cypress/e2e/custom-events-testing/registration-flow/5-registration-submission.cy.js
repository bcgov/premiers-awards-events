/// <reference types="cypress" />
const url = Cypress.env("url");
import { getCustomLogin } from "../../helpers/login";
import {
  getRegistrations,
  getSingleRegistration,
  postRegistrations,
  postSingleRegistration,
} from "../../helpers/registrations";
import { getTables } from "../../helpers/tables";

describe("Users can submit a registration.", () => {
  context("Submission/unsubmission/resubmission of registration", () => {
    beforeEach(() => {
      getCustomLogin();
      getRegistrations();
      postRegistrations();
      getTables();

      getSingleRegistration("3-registration-unsubmitted-GET");

      cy.fixture(
        "responses/registrations/get-one/3-registration-submitted-POST"
      ).then((registration) => {
        const userInfo = registration;
        cy.intercept("GET", `/tables/registrations/${userInfo.guid}/guests`, {
          fixture:
            "responses/registrations/get-one/5-registration-submitted-guests",
        }).as("getRegistrationGuests");

        cy.visit(`${url}registration/${userInfo.guid}`, { timeout: 50000 });
      });
      cy.wait([
        "@inituser",
        "@getLogin",
        "@getSettings",
        "@getSingleRegistration",
        "@getSingleRegistration",
        "@getTables",
        "@getRegistrationGuests",
      ]);
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

      postSingleRegistration("3-registration-submitted-POST");
      getSingleRegistration("3-registration-submitted-GET");

      cy.get(".p-button").contains("Confirm submit registration").click();
      cy.wait(["@postSingleRegistration"]);

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
