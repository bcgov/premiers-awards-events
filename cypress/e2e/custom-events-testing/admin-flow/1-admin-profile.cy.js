/// <reference types="cypress" />
import { getLogin } from "../../helpers/login";

describe("Admin Profile Page", () => {
  context("Profile page presents user info", () => {
    beforeEach(() => {
      getLogin();
      cy.get(".dropdown-account").click();
      cy.get(".dropdown-account").contains("View Profile").click();
      cy.location("pathname").should("include", "user/update");
    });

    it("displays registration status message", () => {
      cy.get(".p-message-wrapper").contains("You").should("exist");
    });
    it("displays disabled username and details", () => {
      cy.get(`form #input-user-register-username`).should("be.disabled");
      cy.get(`form #input-user-register-firstname`).should("be.disabled");
      cy.get(`form #input-user-register-lastname`).should("be.disabled");
    });

    it("displays Admin Portal button", () => {
      cy.get("form button").contains("Admin Portal").should("exist");
    });
  });
});
