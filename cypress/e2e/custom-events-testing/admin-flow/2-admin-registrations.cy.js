/// <reference types="cypress" />
const url = Cypress.env("url");
import { getCustomLogin } from "../../helpers/login";
import {
  getRegistrations,
  getSingleRegistration,
  postSingleRegistration,
} from "../../helpers/registrations";

describe("Admin Registrations Page", () => {
  beforeEach(() => {
    getCustomLogin();
    getRegistrations();
    getSingleRegistration("4-admin-registration-list-edit");
    cy.visit(`${url}admin`, { timeout: 50000 });
    cy.wait(["@inituser", "@getLogin", "@getSettings"]);

    cy.location("pathname").should("include", "admin");
  });
  context("Registrations page shows all admin navigation features", () => {
    it("displays admin nav bar with all items", () => {
      cy.get(".dropdown-calendar")
        .contains("View Registrations")
        .should("exist");
      cy.get(".dropdown-calendar").contains("View Guests").should("exist");
      cy.get(".dropdown-calendar").contains("View Tables").should("exist");
      cy.get(".dropdown-calendar").contains("Event Planner").should("exist");
    });
  });

  context("Registrations page buttons functional", () => {
    it("displays functional table count button", () => {
      cy.get(".p-button-label").contains("Table Count:").should("exist");
      cy.get(`.p-button-label`).contains("Table Count").click();
      cy.get(`.p-dialog-header`).contains("Table Information").should("exist");
    });
  });

  context(
    "Registrations page shows registrations table and column details",
    () => {
      beforeEach(() => {
        cy.wait(["@getRegistrations"]);
      });
      it("displays registrations data table", () => {
        cy.get(".p-datatable").should("exist");
      });

      it("displays ID column", () => {
        cy.get("th").contains("ID").should("exist");
      });

      it("displays organization column", () => {
        cy.get("th").contains("Organization").should("exist");
      });

      it("displays branch column", () => {
        cy.get("th").contains("Branch").should("exist");
      });

      it("displays primary contact column", () => {
        cy.get("th").contains("Primary Contact").should("exist");
      });
      it("displays primary contact email column", () => {
        cy.get("th").contains("Primary Contact's Email").should("exist");
      });

      it("displays financial contact column", () => {
        cy.get("th").contains("Financial Contact").should("exist");
      });

      it("displays client/ministry code column", () => {
        cy.get("th").contains("Client / Ministry Code").should("exist");
      });

      it("displays resp code column", () => {
        cy.get("th").contains("RESP Code").should("exist");
      });

      it("displays service line column", () => {
        cy.get("th").contains("Service Line").should("exist");
      });
      it("displays stob column", () => {
        cy.get("th").contains("STOB").should("exist");
      });

      it("displays project code column", () => {
        cy.get("th").contains("Project Code").should("exist");
      });

      it("displays guest count column", () => {
        cy.get("th").contains("Guest Count:").should("exist");
      });

      it("displays submitted column", () => {
        cy.get("th").contains("Submitted?").should("exist");
      });

      it("displays created column", () => {
        cy.get("th").contains("Created:").should("exist");
      });

      it("displays updated column", () => {
        cy.get("th").contains("Updated:").should("exist");
      });

      it("displays options column", () => {
        cy.get("th").contains("Options:").should("exist");
      });
    }
  );

  context("Registrations page lists registrations with details", () => {
    beforeEach(() => {
      cy.wait(["@getRegistrations"]);
    });
    it("displays registration data under every column", () => {
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("not.be.empty");
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("have.length", 16);
    });
  });

  context(
    "Registrations page allow edits and linking to view specific registrations ",
    () => {
      beforeEach(() => {
        postSingleRegistration("4-admin-registration-list-edit");
        cy.wait(["@getRegistrations"]);
      });
      it("displays edit buttons with functional popups", () => {
        cy.get(".edit-button").first().click();
        cy.wait(["@getSingleRegistration"]);

        cy.get(".registration-dialog").should("exist");

        cy.get(".submission-form-buttons button").contains("Submit").click();
        cy.wait(["@postSingleRegistration"]);

        cy.contains("Registration Updated").should("exist");
        cy.get(".registration-dialog .p-dialog-header-close").click();
      });

      it("displays view button with functional redirection", () => {
        cy.get(".info-button").first().click();
        cy.wait(["@getSingleRegistration"]);
        cy.location("pathname").should("include", "admin/edit");
      });
    }
  );
});
