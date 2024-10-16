/// <reference types="cypress" />
import { getLogin } from "../../helpers/login";

describe("Admin Navigation Process", () => {
  beforeEach(() => {
    getLogin();
  });
  context("Registration Page for admin", () => {
    it("navigates to the registration page when clicking on the register button", () => {
      cy.get(".p-button").contains("Register").click();
      cy.location("pathname").should("include", "registration");
    });
  });

  context("Registration page from dropdown for admin", () => {
    it("navigates to the registration page when clicking on the register dropdown", () => {
      cy.get(".p-menubar-root-list").contains("My Registration").click();
      cy.location("pathname").should("include", "registration");
    });
  });

  context("View Profile Page for admin", () => {
    it("navigates to the view profile page from the dropdown", () => {
      cy.get(".dropdown-account").click();
      cy.get(".dropdown-account").contains("View Profile").click();
      cy.location("pathname").should("include", "user/update");
    });
  });

  context("View Registrations Page for admin", () => {
    it("navigates to the view registrations page from the dropdown", () => {
      cy.get(".dropdown-calendar").click();
      cy.get(".dropdown-calendar").contains("View Registrations").click();
      cy.location("pathname").should("include", "admin");
    });
  });

  context("View Guests Page for admin", () => {
    it("navigates to the view guests page from the dropdown", () => {
      cy.get(".dropdown-calendar").click();
      cy.get(".dropdown-calendar").contains("View Guests").click();
      cy.location("pathname").should("include", "admin/guests");
    });
  });

  context("View Tables Page for admin", () => {
    it("navigates to the view tables page from the dropdown", () => {
      cy.get(".dropdown-calendar").click();
      cy.get(".dropdown-calendar").contains("View Tables").click();
      cy.location("pathname").should("include", "admin/tables");
    });
  });

  context("Event Planner Page for admin", () => {
    it("navigates to the Event Planning page from the dropdown", () => {
      cy.get(".dropdown-calendar").click();
      cy.get(".dropdown-calendar").contains("Event Planner").click();
      cy.location("pathname").should("include", "tables/event/planning");
    });
  });

  context("Event Settings Page for admin", () => {
    it("navigates to the event settings page from the dropdown", () => {
      cy.get(".dropdown-calendar").click();
      cy.get(".dropdown-calendar").contains("Event Settings").click();
      cy.location("pathname").should("include", "settings");
    });
  });
});
