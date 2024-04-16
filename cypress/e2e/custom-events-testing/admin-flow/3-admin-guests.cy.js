/// <reference types="cypress" />
const url = Cypress.env("url");
import { getCustomLogin } from "../../helpers/login";
import { getGuests, postSingleGuest } from "../../helpers/guests";
import { getTables } from "../../helpers/tables";

describe("Admin Guests Page", () => {
  beforeEach(() => {
    getCustomLogin();
    getGuests("1-guests-origin");
    getTables("1-tables-origin");

    cy.visit(`${url}admin/guests`, { timeout: 50000 });
    cy.wait([
      "@inituser",
      "@getLogin",
      "@getSettings",
      "@getTables",
      "@getGuests",
    ]);
    cy.location("pathname").should("include", "admin/guests");
  });
  context("Guests page shows all admin navigation features", () => {
    it("displays admin nav bar with all items", () => {
      cy.get(".dropdown-calendar").contains("Registrations").should("exist");
      cy.get(".dropdown-calendar").contains("Guests").should("exist");
      cy.get(".dropdown-calendar").contains("Tables").should("exist");
      cy.get(".dropdown-calendar").contains("Event Planner").should("exist");
    });
  });

  context("Guests page buttons functional", () => {
    it("displays functional guest count button", () => {
      cy.get(".p-button-label").contains("Guest Count").should("exist");
      cy.get(`.p-button-label`).contains("Guest Count").click();
      cy.get(`.p-dialog-header`)
        .contains("Total Count of Current Guests")
        .should("exist");
      cy.get(`.p-dialog-header-close`).click();
      cy.get(`.p-dialog-header`)
        .contains("Total Count of Current Guests")
        .should("not.exist");
    });
  });

  context("Guests page shows guests table and column details", () => {
    it("displays registrations data table", () => {
      cy.get(".guests-datatable").should("exist");
    });

    it("displays organization column", () => {
      cy.get("th").contains("Organization").should("exist");
    });

    it("displays first name column", () => {
      cy.get("th").contains("First Name").should("exist");
    });

    it("displays last name column", () => {
      cy.get("th").contains("Last Name").should("exist");
    });
    it("displays attendance type column", () => {
      cy.get("th").contains("Attendance Type").should("exist");
    });

    it("displays Accessibility Requirements column", () => {
      cy.get("th").contains("Accessibility Requirements").should("exist");
    });

    it("displays Dietary Requirements column", () => {
      cy.get("th").contains("Dietary Requirements").should("exist");
    });

    it("displays Notes column", () => {
      cy.get("th").contains("Notes:").should("exist");
    });

    it("displays Table column", () => {
      cy.get("th").contains("Table").should("exist");
    });
    it("displays Created column", () => {
      cy.get("th").contains("Created:").should("exist");
    });

    it("displays updated column", () => {
      cy.get("th").contains("Updated:").should("exist");
    });

    it("displays options column", () => {
      cy.get("th").contains("Options:").should("exist");
    });
  });

  context("Guests page lists guests with details", () => {
    it("displays guest data under every column", () => {
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("not.be.empty");
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("have.length", 15);
    });
  });

  context(
    "Guests page allow edits, linking to view specific registrations, and remove/delete option.",
    () => {
      it("displays edit buttons with functional popups", () => {
        postSingleGuest();
        cy.get(".edit-button").first().click();
        cy.get(".p-dialog-header").contains("Guest Details").should("exist");
        cy.get(".p-dialog-footer button").contains("Save").click();
        cy.wait(["@postSingleGuest"]);
        cy.get(".p-dialog-header")
          .contains("Guest Details")
          .should("not.exist");
      });

      it("displays delete or remove from table buttons with functional popups", () => {
        cy.get(".delete-button").should("exist");
        cy.get(".delete-button").first().click();
        cy.get(".p-dialog-header").contains("Confirm").should("exist");
        cy.get(".p-dialog-footer button").contains("No").click();
        cy.get(".p-dialog-header").contains("Confirm").should("not.exist");
      });

      it("displays view button with functional redirection", () => {
        cy.get(".info-button").should("exist");
        cy.get(".info-button").first().click();
        cy.location("pathname").should("include", "admin/edit");
      });
    }
  );
});
