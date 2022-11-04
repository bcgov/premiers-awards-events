/// <reference types="cypress" />
const url = Cypress.env("url");
import { getCustomLogin } from "../../helpers/login";
import {
  getRegistrations,
  getSingleRegistration,
  postRegistrations,
} from "../../helpers/registrations";

describe("Registration Navigation Process", () => {
  context("Registration Page for registrar", () => {
    beforeEach(() => {
      getCustomLogin();
      getRegistrations();
      getSingleRegistration();
      postRegistrations();
      cy.visit(url, { timeout: 50000 });
      cy.wait(["@inituser", "@getLogin", "@getSettings"]);
    });

    it("navigates to the registration page when clicking on the register button", () => {
      Cypress.$("document").ready(function () {
        cy.get(".p-button").contains("Register").click();
        cy.wait(["@getRegistrations", "@getSingleRegistration"]);
        cy.location("pathname").should("include", "registration");
      });
    });

    it("navigates to the registration page when clicking on the register dropdown", () => {
      Cypress.$("document").ready(function () {
        cy.get(".dropdown-account").click();
        cy.get(".dropdown-account").contains("My Registration").click();
        cy.wait(["@getRegistrations", "@getSingleRegistration"]);
        cy.location("pathname").should("include", "registration");
      });
    });
  });
});
