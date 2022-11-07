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

// initialization settings

describe("Resets registration", () => {
  context("Deletes Current Registration", () => {
    beforeEach(() => {
      getCustomLogin();
      getRegistrations();
      postRegistrations();
      getTables();

      getSingleRegistration("3-registration-submitted-GET");

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

    it("unsubmits the registration", () => {
      cy.get(`.submission-buttons button`)
        .contains("Unsubmit Registration")
        .click();

      cy.get(".p-dialog-header")
        .contains("Confirm Submission")
        .should("be.visible");

      getSingleRegistration("3-registration-unsubmitted-GET");
      getRegistrations();
      postSingleRegistration("3-registration-unsubmitted-POST");
      cy.intercept("GET", `**/tables/registrations/*`, {
        fixture:
          "responses/registrations/get-one/3-registration-unsubmitted-GET",
      }).as("getSingleRegistration");

      cy.get(".p-button").contains("Re-open registration").click();
      cy.wait(["@getSingleRegistration"]);
      cy.wait([
        "@postSingleRegistration",
        "@getSingleRegistration",
        "@getTables",
        "@getRegistrationGuests",
      ]);

      cy.get(".p-message-text")
        .contains("Successfully re-opened registration!")
        .should("exist");

      cy.get(".p-dialog-header-close").click();

      cy.get(".p-dialog-header")
        .contains("Confirm Submission")
        .should("not.exist");
    });

    it("confirms deletion of the current registration", () => {
      getSingleRegistration("3-registration-unsubmitted-GET");
      cy.reload();

      cy.intercept("POST", "/tables/registrations/delete/*", {
        acknowledged: true,
        deletedCount: 1,
      }).as("deleteRegistration");
      cy.get("#personal-registration-table .delete-button")
        .contains("Delete")
        .click();
      cy.get(".confirmation-content")
        .contains("Are you sure you want to delete")
        .should("be.visible");
      getSingleRegistration("00-registration-newblank");

      cy.get(".p-button").contains("Yes").click();
      cy.wait(["@getSingleRegistration", "@deleteRegistration"]);
      cy.contains("deleted registration and all connected guests");

      cy.get(".confirmation-content").should("not.exist");
    });
  });
});
