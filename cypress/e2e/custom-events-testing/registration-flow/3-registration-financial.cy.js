/// <reference types="cypress" />
const url = Cypress.env("url");
const user = Cypress.env("user");

describe.skip("Users can edit registration financial details.", () => {
  context("Registration edit functionality", () => {
    beforeEach(() => {
      cy.visit(`${url}create/registration`);
    });

    it("opens registration popup and makes one edit", () => {
      cy.get("#personal-registration-table .edit-button")
        .contains("Edit")
        .click();
      cy.get(".financial-registration-form")
        .contains("Organizational Information")
        .should("be.visible");

      cy.get(
        ".financial-registration-form #organization .p-dropdown-trigger"
      ).click();

      cy.fixture("financial-info").then((finances) => {
        const { org2 } = finances;
        cy.get("#organization_list li").contains(org2["organization"]).click();

        cy.get(
          ".financial-registration-form #organization .p-inputtext"
        ).should("contain", org2["organization"]);

        cy.get(".submission-form-buttons button").contains("Submit").click();
        cy.get(".registration-dialog .p-dialog-header-close").click();
        cy.get(".financial-registration-form").should("not.exist");
        cy.get("#personal-registration-table td")
          .contains(org2["organization"])
          .should("exist");
      });
    });

    it("opens registration popup and edits every field", () => {
      cy.get("#personal-registration-table .edit-button")
        .contains("Edit")
        .click();
      cy.get(".financial-registration-form")
        .contains("Organizational Information")
        .should("be.visible");

      cy.get(
        ".financial-registration-form #organization .p-dropdown-trigger"
      ).click();

      cy.fixture("financial-info").then((finances) => {
        //Conditionally select organization to use in testing based on current form
        const { org2 } = finances;
        let testOrg = org2;

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
        cy.get(".number-field #clientministry").type(testOrg["clientministry"]);
        cy.get(".number-field #respcode").type("{selectAll}", "{del}");
        cy.get(".number-field #respcode").type(testOrg["respcode"]);
        cy.get(".number-field #serviceline").type("{selectAll}", "{del}");
        cy.get(".number-field #serviceline").type(testOrg["serviceline"]);
        cy.get(".number-field #stob").type("{selectAll}", "{del}");
        cy.get(".number-field #stob").type(testOrg["stob"]);
        cy.get(".number-field #project").type("{selectAll}", "{del}");
        cy.get(".number-field #project").type(testOrg["project"]);

        cy.get(".submission-form-buttons button").contains("Submit").click();
        cy.get(".registration-dialog .p-dialog-header-close").click();
        cy.get(".financial-registration-form").should("not.exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["organization"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["branch"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["primarycontact"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["primaryemail"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["financialcontact"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["clientministry"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["respcode"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["serviceline"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["stob"])
          .should("exist");
        cy.get("#personal-registration-table td")
          .contains(testOrg["project"])
          .should("exist");
      });
    });

    it("opens registration popup and attempts to make incorrect edits", () => {
      cy.get("#personal-registration-table .edit-button")
        .contains("Edit")
        .click();
      cy.get(".financial-registration-form")
        .contains("Organizational Information")
        .should("be.visible");

      cy.get(
        ".financial-registration-form #organization .p-dropdown-trigger"
      ).click();

      cy.fixture("financial-info").then((finances) => {
        const { faultyOrg } = finances;
        cy.get("#organization_list li")
          .contains(faultyOrg["organization"])
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

        cy.get(".number-field #clientministry").type("{selectAll}", "{del}");
        cy.get(".number-field #clientministry").type(
          faultyOrg["clientministry"]
        );
        cy.get(".number-field #respcode").type("{selectAll}", "{del}");
        cy.get(".number-field #respcode").type(faultyOrg["respcode"]);
        cy.get(".number-field #serviceline").type("{selectAll}", "{del}");
        cy.get(".number-field #serviceline").type(faultyOrg["serviceline"]);
        cy.get(".number-field #stob").type("{selectAll}", "{del}");
        cy.get(".number-field #stob").type(faultyOrg["stob"]);
        cy.get(".number-field #project").type("{selectAll}", "{del}");
        cy.get(".number-field #project").type(faultyOrg["project"]);

        cy.get(".submission-form-buttons button").contains("Submit").click();

        cy.get("#branch-help").should("exist");
        cy.get("#primarycontact-help").should("exist");
        cy.get("#primaryemail-help").should("exist");
        cy.get("#financialcontact-help").should("exist");
        cy.get("#clientministry-help").should("exist");
        cy.get("#respcode-help").should("exist");
        cy.get("#serviceline-help").should("exist");
        cy.get("#stob-help").should("exist");
        cy.get("#project-help").should("exist");

        cy.get(".registration-dialog .p-dialog-header-close").click();
        cy.get(".financial-registration-form").should("not.exist");
      });
    });

    it("opens registration popup and tests the reset button", () => {
      cy.get("#personal-registration-table .edit-button")
        .contains("Edit")
        .click();
      cy.get(".financial-registration-form")
        .contains("Organizational Information")
        .should("be.visible");

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

      cy.get(".registration-dialog .p-dialog-header-close").click();
      cy.get(".financial-registration-form").should("not.exist");
    });
  });
});
