/// <reference types="cypress" />
const url = Cypress.env("url");
import { getCustomLogin } from "../../helpers/login";
import {
  getTables,
  getSingleTable,
  postSingleTable,
  postTable,
} from "../../helpers/tables";

describe("Admin Tables Page", () => {
  beforeEach(() => {
    getCustomLogin();
    getTables("1-tables-origin");

    cy.visit(`${url}admin/tables`, { timeout: 50000 });
    cy.wait(["@inituser", "@getLogin", "@getSettings", "@getTables"]);
    cy.location("pathname").should("include", "admin/tables");
  });
  context("Table page shows all admin navigation features", () => {
    it("displays admin nav bar with all items", () => {
      cy.get(".dropdown-calendar").contains("Registrations").should("exist");
      cy.get(".dropdown-calendar").contains("Guests").should("exist");
      cy.get(".dropdown-calendar").contains("Tables").should("exist");
      cy.get(".dropdown-calendar").contains("Event Planner").should("exist");
    });
  });

  context("Table page buttons functional", () => {
    it("displays functional table count button", () => {
      cy.get(".p-button-label").contains("Table Count:").should("exist");
      cy.get(`.p-button-label`).contains("Table Count:").click();
      cy.get(`.p-dialog-header`).contains("Table Information").should("exist");
      cy.get(`.p-dialog-header-close`).click();
      cy.get(`.p-dialog-header`)
        .contains("Table Information")
        .should("not.exist");
    });
    it("displays functional add new table button", () => {
      cy.get(".p-button-label").contains("Add New Table").should("exist");
      cy.get(`.p-button-label`).contains("Add New Table").click();
      cy.get(`.p-dialog-header`).contains("Add New Table").should("exist");
      // Does not submit without valid information
      cy.get(`.p-dialog-content form button`).contains("Submit").click();
      cy.get("#tabletype-help")
        .contains("Please select the type of table.")
        .should("exist");
      cy.get("#tablecapacity-help")
        .contains("Please enter the required table capacity.")
        .should("exist");

      cy.get(`.p-dialog-header-close`).click();
      cy.get(`.p-dialog-header`).contains("Add New Table").should("not.exist");
    });
  });

  context("Tables page shows table and column details", () => {
    it("displays tables data table", () => {
      cy.get(".table-data-view").should("exist");
    });

    it("displays Table Name column", () => {
      cy.get("th").contains("Table Name").should("exist");
    });

    it("displays Type of Table column", () => {
      cy.get("th").contains("Type of Table").should("exist");
    });

    it("displays Table Capacity column", () => {
      cy.get("th").contains("Table Capacity").should("exist");
    });
    it("displays Number of Guests column", () => {
      cy.get("th").contains("Number of Guests").should("exist");
    });

    it("displays Table Status column", () => {
      cy.get("th").contains("Table Status").should("exist");
    });

    it("displays Government Organizations column", () => {
      cy.get("th").contains("Government Organizations").should("exist");
    });

    it("displays Created column", () => {
      cy.get("th").contains("Created:").should("exist");
    });

    it("displays updated column", () => {
      cy.get("th").contains("Updated:").should("exist");
    });

    it("displays options column blank title", () => {
      cy.get("th").last().should("have.value", "");
    });
  });

  context("Tables page lists tables with details", () => {
    it("displays table data under every column", () => {
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("not.be.empty");
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("have.length", 9);
    });
  });

  context(
    "Tables page allow edits, linking to view specific tables, and delete option.",
    () => {
      it("displays edit buttons with functional popups", () => {
        getSingleTable("1-table-origin");
        postSingleTable("1-table-origin");
        cy.get(".edit-button").first().click();
        cy.wait(["@getSingleTable"]);
        cy.get(".p-dialog-header").contains("Table Details").should("exist");
        cy.get("button").contains("Submit").click();
        cy.wait(["@postSingleTable"]);
        cy.contains("Table Updated").should("exist");
        cy.get(".p-dialog-header .p-dialog-header-close").click();
        cy.get(".p-dialog-header")
          .contains("Table Details")
          .should("not.exist");
      });

      it("displays delete table button with functional popups", () => {
        cy.get(".delete-button").should("exist");
        cy.get(".delete-button").first().click();
        cy.get(".p-dialog-header").contains("Confirm").should("exist");
        cy.get(".p-dialog-footer button").contains("No").click();
        cy.get(".p-dialog-header").contains("Confirm").should("not.exist");
      });

      it("displays link to table with functional redirection", () => {
        getSingleTable("1-table-origin");
        cy.get(".p-datatable-tbody .tablename a").first().click();
        cy.wait(["@getSingleTable"]);
        cy.location("pathname").should("include", "admin/table/");
      });
    }
  );

  context("Table creation, editing and deletion functional", () => {
    it("adds new table", () => {
      cy.get(`.p-button-label`).contains("Add New Table").click();
      cy.get(".text-field #tablename").type("{selectAll}", "{del}");
      cy.get(`.text-field #tablename`).type("0123-testing");

      cy.get("#tabletype .p-dropdown-trigger").click();
      cy.get("#tabletype_list li").contains("Reserved").click();

      cy.get(".number-field #tablecapacity").type("{selectAll}", "{del}");
      cy.get(`.number-field #tablecapacity`).type("99");

      //Add New Table
      postTable("2-tables-updated");
      cy.get(`.p-dialog-content form button`).contains("Submit").click();
      cy.wait(["@postTable"]);
      cy.contains("Table Updated").should("exist");

      //Load updated table list
      getTables("2-tables-updated");
      cy.get(`.p-dialog-header-close`).click();
      cy.wait(["@getTables"]);
      cy.get(`.p-dialog-header`).contains("Add New Table").should("not.exist");
    });

    it("edits testing table", () => {
      //load updated table list
      getTables("2-tables-updated");
      getSingleTable("2-table-updated");
      cy.visit(`${url}admin/tables`, { timeout: 50000 });
      cy.wait(["@inituser", "@getLogin", "@getSettings", "@getTables"]);
      cy.location("pathname").should("include", "admin/tables");

      cy.get(".p-datatable-header input").type("{selectAll}", "{del}");
      cy.get(`.p-datatable-header input`).type("0123-testing");
      cy.get(".p-datatable-tbody .edit-button").should("have.length", 1);
      cy.get(".p-datatable-tbody .edit-button").click();
      cy.wait(["@getSingleTable"]);

      cy.get(".text-field #tablename").type("{selectAll}", "{del}");
      cy.get(`.text-field #tablename`).type("4567-testing");

      cy.get("#tabletype .p-dropdown-trigger").click();
      cy.get("#tabletype_list li").contains("Standard").click();

      cy.get(".number-field #tablecapacity").type("{selectAll}", "{del}");
      cy.get(`.number-field #tablecapacity`).type("1");

      //Updates Table
      postSingleTable("3-table-final");

      cy.get(`.p-dialog-content form button`).contains("Submit").click();
      cy.wait(["@postSingleTable"]);
      cy.contains("Table Updated").should("exist");

      //Load final table list
      getTables("3-tables-final");
      cy.get(`.p-dialog-header-close`).click();
      cy.wait(["@getTables"]);

      cy.get(`.p-dialog-header`).contains("Table Details").should("not.exist");

      cy.get(".p-datatable-header input").type("{selectAll}", "{del}");
      cy.get(`.p-datatable-header input`).type("0123-testing");
      cy.get(".p-datatable-tbody .edit-button").should("not.exist");

      cy.get(".p-datatable-header input").type("{selectAll}", "{del}");
      cy.get(`.p-datatable-header input`).type("4567-testing");
      cy.get(".p-datatable-tbody .edit-button").should("have.length", 1);
    });

    it("deletes testing table", () => {
      //load updated table list
      getTables("3-tables-final");
      getSingleTable("3-table-final");
      cy.visit(`${url}admin/tables`, { timeout: 50000 });
      cy.wait(["@inituser", "@getLogin", "@getSettings", "@getTables"]);
      cy.location("pathname").should("include", "admin/tables");

      //Load final table list
      cy.get(".p-datatable-header input").type("{selectAll}");
      cy.get(`.p-datatable-header input`).type("4567-testing");
      cy.get(".p-datatable-tbody .delete-button").should("have.length", 1);

      cy.get(".p-datatable-tbody .delete-button").click();

      cy.get(".p-dialog-header").contains("Confirm").should("exist");
      cy.get(".p-dialog-content").contains("4567-testing").should("exist");

      //Deletes Table
      cy.intercept("POST", `/tables/seating/delete/*`, {
        acknowledged: true,
        deletedCount: 1,
      }).as("postTable");
      getTables("1-tables-origin");

      cy.get(".p-dialog-footer button").contains("Yes").click();
      cy.wait(["@postTable"]);
      cy.contains("Successfully").should("exist");

      cy.wait(["@getTables"]);

      //clears filter and displays all tables again
      cy.get(".p-datatable-header input").type("{selectAll}");
      cy.get(".p-datatable-header input").type("{del}");

      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("not.be.empty");
      cy.get(".p-datatable-tbody > tr")
        .first()
        .children()
        .should("have.length", 9);
    });
  });
});
