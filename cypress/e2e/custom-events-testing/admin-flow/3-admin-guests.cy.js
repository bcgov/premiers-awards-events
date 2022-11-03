/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe("Admin Guests Page", () => {
  context("Guests page shows all admin navigation features", () => {
    before(() => {
      cy.visit(`${url}admin/guests`, { timeout: 50000 });
    });
    it("displays admin nav bar with all items", () => {
      cy.get(".admin-nav").contains("Registrations").should("exist");
      cy.get(".admin-nav").contains("Guests").should("exist");
      cy.get(".admin-nav").contains("Tables").should("exist");
      cy.get(".admin-nav").contains("Event Planning").should("exist");
    });
  });

  context("Guests page buttons functional", () => {
    before(() => {
      cy.visit(`${url}admin/guests`, { timeout: 50000 });
    });

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
    beforeEach(() => {
      cy.visit(`${url}admin/guests`, { timeout: 50000 });
    });

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
    before(() => {
      cy.visit(`${url}admin/guests`, { timeout: 50000 });
    });

    it("displays registration data under every column", () => {
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("not.be.empty");
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("have.length", 11);
    });
  });

  context(
    "Guests page allow edits, linking to view specific registrations, and remove/delete option.",
    () => {
      beforeEach(() => {
        cy.visit(`${url}admin/guests`, { timeout: 50000 });
      });

      it("displays edit buttons with functional popups", () => {
        cy.get(".options-buttons").contains("Edit").first().click();
        cy.get(".p-dialog-header").contains("Guest Details").should("exist");
        cy.get(".p-dialog-footer button").contains("Save").click();
        cy.get(".p-dialog-header")
          .contains("Guest Details")
          .should("not.exist");
      });

      it("displays view button with functional redirection", () => {
        cy.get(".info-button").contains("View").should("exist");
        cy.get(".info-button").contains("View").first().click();
        cy.location("pathname").should("include", "admin/edit");
      });

      it("displays remove from Table buttons with functional popups", () => {
        cy.get(".options-buttons").contains("Edit").first().click();
        cy.get(".p-dialog-header").contains("Guest Details").should("exist");
        cy.get(".p-dialog-footer button").contains("Save").click();
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
    }
  );
});
