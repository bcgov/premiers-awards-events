/// <reference types="cypress" />

const url = Cypress.env("url");
const user = Cypress.env("user");

describe.skip("Navigation works across the application", () => {
  context("Navigation", () => {
    beforeEach(() => {
      cy.visit(url);
    });

    it("cy.go() - go back or forward in the browser's history", () => {
      cy.get("#navbar .dropdown-account").click();
      cy.get("#navbar .dropdown-account").contains("View Profile").click();
      cy.location("pathname").should("include", "user/update");

      cy.go("back");
      cy.location("pathname").should("not.include", "user/update");

      cy.go("forward");
      cy.location("pathname").should("include", "user/update");

      // clicking back
      cy.go(-1);
      cy.location("pathname").should("not.include", "user/update");

      // clicking forward
      cy.go(1);
      cy.location("pathname").should("include", "user/update");
    });

    it("cy.reload() - reload the page", () => {
      cy.reload();
      cy.reload(true);
    });

    it("cy.visit() - visit a remote url", () => {
      cy.visit(`${url}create/registration`, {
        timeout: 50000,
        onBeforeLoad(contentWindow) {
          expect(typeof contentWindow === "object").to.be.true;
        },
        onLoad(contentWindow) {
          expect(typeof contentWindow === "object").to.be.true;
        },
      });
    });
  });
});
