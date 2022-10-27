/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe("Admin Navigation Process", () => {
  context("Registration Page for admin", () => {
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

  context("View Profile Page for admin", () => {
    beforeEach(() => {
      cy.visit(url, { timeout: 50000 });
    });
    it("navigates to the view profile page from the dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("View Profile").click();
        cy.location("pathname").should("include", "user/update");
      });
    });
  });

  context("View Registrations Page for admin", () => {
    beforeEach(() => {
      cy.visit(url, { timeout: 50000 });
    });
    it("navigates to the view registrations page from the dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("View Registrations").click();
        cy.location("pathname").should("include", "admin");
      });
    });
  });

  context("View Guests Page for admin", () => {
    beforeEach(() => {
      cy.visit(url, { timeout: 50000 });
    });
    it("navigates to the view guests page from the dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("View Guests").click();
        cy.location("pathname").should("include", "admin/guests");
      });
    });
  });

  context("View Tables Page for admin", () => {
    beforeEach(() => {
      cy.visit(url, { timeout: 50000 });
    });
    it("navigates to the view tables page from the dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("View Tables").click();
        cy.location("pathname").should("include", "admin/tables");
      });
    });
  });

  context("Event Planner Page for admin", () => {
    beforeEach(() => {
      cy.visit(url, { timeout: 50000 });
    });
    it("navigates to the Event Planning page from the dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("Event Planner").click();
        cy.location("pathname").should("include", "tables/event/planning");
      });
    });
  });

  context("Event Settings Page for admin", () => {
    beforeEach(() => {
      cy.visit(url, { timeout: 50000 });
    });
    it("navigates to the event settings page from the dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("Event Settings").click();
        cy.location("pathname").should("include", "settings");
      });
    });
  });
});
