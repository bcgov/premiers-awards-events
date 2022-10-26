/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");
require("dotenv").config();
("use strict");

// initialization settings
const nodeEnv = process.env.NODE_ENV;

if (nodeEnv === "local" || nodeEnv === "test" || nodeEnv === "development") {
  describe("Initializes Financial Registration", () => {
    context("Register", () => {
      before(() => {
        cy.visit(`${url}`, { timeout: 50000 }).then(() => {
          cy.visit(`${url}create/registration`, { timeout: 50000 });
        });
      });
      it.skip("resets all info with the reset button and prevents submission with missing info", () => {
        cy.get(".submission-form-buttons button").contains("Reset").click();
        cy.get(".submission-form-buttons button").contains("Submit").click();
        cy.get("#branch-help").should("exist");
        cy.get("#branch-help").should("exist");
        cy.get("#primarycontact-help").should("exist");
        cy.get("#primaryemail-help").should("exist");
        cy.get("#financialcontact-help").should("exist");
        cy.get("#clientministry-help").should("exist");
        cy.get("#respcode-help").should("exist");
        cy.get("#serviceline-help").should("exist");
        cy.get("#stob-help").should("exist");
        cy.get("#project-help").should("exist");
      });
      it.skip("prevents submission with incorrect info", () => {
        cy.fixture("financial-info").then((finances) => {
          const { faultyOrg } = finances;
          const testOrg = faultyOrg;

          cy.get(
            ".financial-registration-form #organization .p-dropdown-trigger"
          ).click();

          cy.get("#organization_list li")
            .contains(testOrg["organization"])
            .should("not.exist");

          cy.get(
            ".financial-registration-form #organization .p-dropdown-trigger"
          ).click();

          cy.get(".text-field #branch").type("{selectAll}", "{del}");
          cy.get(".text-field #branch").invoke("val", "");

          cy.get(".text-field #primarycontact").type("{selectAll}", "{del}");
          cy.get(".text-field #primarycontact").invoke("val", "");

          cy.get(".text-field #primaryemail").type("{selectAll}", "{del}");
          cy.get(".text-field #primaryemail").invoke("val", "");

          cy.get(".text-field #financialcontact").type("{selectAll}", "{del}");
          cy.get(".text-field #financialcontact").invoke("val", "");

          cy.get(".text-field #financialcontact").type("{selectAll}", "{del}");
          cy.get(".text-field #financialcontact").invoke("val", "");

          cy.get(".number-field #clientministry").type("{selectAll}", "{del}");
          cy.get(".number-field #clientministry").type(
            testOrg["clientministry"]
          );
          cy.get(".number-field #respcode").type("{selectAll}", "{del}");
          cy.get(".number-field #respcode").type(testOrg["respcode"]);
          cy.get(".number-field #serviceline").type("{selectAll}", "{del}");
          cy.get(".number-field #serviceline").type(testOrg["serviceline"]);
          cy.get(".number-field #stob").type("{selectAll}", "{del}");
          cy.get(".number-field #stob").type(testOrg["stob"]);
          cy.get(".number-field #project").type("{selectAll}", "{del}");
          cy.get(".number-field #project").type(testOrg["project"]);
          cy.get(".submission-form-buttons button").contains("Submit").click();

          cy.get("#branch-help").should("exist");
          cy.get("#branch-help").should("exist");
          cy.get("#primarycontact-help").should("exist");
          cy.get("#primaryemail-help").should("exist");
          cy.get("#financialcontact-help").should("exist");
          cy.get("#clientministry-help").should("exist");
          cy.get("#respcode-help").should("exist");
          cy.get("#serviceline-help").should("exist");
          cy.get("#stob-help").should("exist");
          cy.get("#project-help").should("exist");
        });
      });
      it("submits registration", () => {
        cy.get(
          ".financial-registration-form #organization .p-dropdown-trigger"
        ).click();

        cy.fixture("financial-info").then((finances) => {
          const { org1 } = finances;
          let testOrg = org1;

          cy.get("#organization_list li")
            .contains(testOrg["organization"])
            .click();

          cy.get(
            ".financial-registration-form #organization .p-inputtext"
          ).should("contain", testOrg["organization"]);

          cy.get(".text-field #branch").type("{selectAll}", "{del}");
          cy.get(".text-field #branch").type(testOrg["branch"]);

          cy.get(".text-field #primarycontact").type("{selectAll}", "{del}");
          cy.get(".text-field #primarycontact").type(testOrg["primarycontact"]);

          cy.get(".text-field #primaryemail").type("{selectAll}", "{del}");
          cy.get(".text-field #primaryemail").type(testOrg["primaryemail"]);

          cy.get(".text-field #financialcontact").type("{selectAll}", "{del}");
          cy.get(".text-field #financialcontact").type(
            testOrg["financialcontact"]
          );

          cy.get(".number-field #clientministry").type("{selectAll}", "{del}");
          cy.get(".number-field #clientministry").type(
            testOrg["clientministry"]
          );
          cy.get(".number-field #respcode").type("{selectAll}", "{del}");
          cy.get(".number-field #respcode").type(testOrg["respcode"]);
          cy.get(".number-field #serviceline").type("{selectAll}", "{del}");
          cy.get(".number-field #serviceline").type(testOrg["serviceline"]);
          cy.get(".number-field #stob").type("{selectAll}", "{del}");
          cy.get(".number-field #stob").type(testOrg["stob"]);
          cy.get(".number-field #project").type("{selectAll}", "{del}");
          cy.get(".number-field #project").type(testOrg["project"]);

          cy.get(".submission-form-buttons button").contains("Submit").click();
          cy.location("pathname").should("include", "registration");
        });
      });
    });
  });
}
