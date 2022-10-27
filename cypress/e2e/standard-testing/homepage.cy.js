/// <reference types="cypress" />

const url = Cypress.env("url");

describe("Homepage Premier's Awards Events", () => {
  beforeEach(() => {
    cy.visit(url);
  });

  it("displays one registration button by default", () => {
    cy.get(".p-button").should("have.length", 1);
    cy.get(".p-button").should("have.text", " Register ");
  });

  it("displays one header dropdown button with all options for super-admin", () => {
    cy.get(".dropdown-account").should("have.length", 1);
    cy.get(".dropdown-account").should("contain", "My Registration");
    cy.get(".dropdown-account").should("contain", "View Profile");
    cy.get(".dropdown-account").should("contain", "Manage Users");
    cy.get(".dropdown-account").should("contain", "View Registrations");
    cy.get(".dropdown-account").should("contain", "View Guests");
    cy.get(".dropdown-account").should("contain", "View Tables");
    cy.get(".dropdown-account").should("contain", "Event Planner");
    cy.get(".dropdown-account").should("contain", "Event Settings");
  });
});
