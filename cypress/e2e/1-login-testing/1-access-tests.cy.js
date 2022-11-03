// const { guid = "", username = "" } = res.locals.user;
// (guid = ""), (username = ""), (firstname = ""), (lastname = ""), (email = "");
const url = Cypress.env("url");
import loginStub from "./login-stub";

describe("Login Process", () => {
  context("login on page entry", () => {
    it("logs the user in on the main page", () => {
      loginStub("initial-user");

      cy.fixture("login-info").then((users) => {
        const { user1 } = users;
        cy.contains(`${user1["username"]}`);
      });
    });
  });
});

describe("Registration Process", () => {
  context("Registration Page based on user access", () => {
    it("shows message and correct access for inactive user", () => {
      loginStub("inactive");
      cy.get(".p-button").contains("Create a profile to register").click();
      cy.location("pathname").should("include", "register");
      cy.contains(
        "Your registration is currently under review. Please check back regularly for updates."
      );
      cy.get(".dropdown-account").click();
      cy.get(".dropdown-account").contains("Create Account").should("exist");
      cy.get(".dropdown-account")
        .contains("My Registration")
        .should("not.exist");
      cy.get(".dropdown-account").contains("View Profile").should("not.exist");
      cy.get(".dropdown-account").contains("Manage Users").should("not.exist");
      cy.get(".dropdown-account")
        .contains("View Registrations")
        .should("not.exist");
      cy.get(".dropdown-account").contains("View Guests").should("not.exist");
      cy.get(".dropdown-account").contains("View Tables").should("not.exist");
      cy.get(".dropdown-account").contains("Event Planner").should("not.exist");
      cy.get(".dropdown-account")
        .contains("Event Settings")
        .should("not.exist");
    });

    it("shows registered message and correct access for nominator user", () => {
      loginStub("nominator");

      cy.get(".p-button").contains("Create a profile to register").click();
      cy.location("pathname").should("include", "register");
      cy.contains(
        "Your profile is currently only registered as a nominator, and is not eligible to submit an event registration."
      );
      cy.get(".dropdown-account").click();
      cy.get(".dropdown-account").contains("Create Account").should("exist");
      cy.get(".dropdown-account")
        .contains("My Registration")
        .should("not.exist");
      cy.get(".dropdown-account").contains("View Profile").should("not.exist");
      cy.get(".dropdown-account").contains("Manage Users").should("not.exist");
      cy.get(".dropdown-account")
        .contains("View Registrations")
        .should("not.exist");
      cy.get(".dropdown-account").contains("View Guests").should("not.exist");
      cy.get(".dropdown-account").contains("View Tables").should("not.exist");
      cy.get(".dropdown-account").contains("Event Planner").should("not.exist");
      cy.get(".dropdown-account")
        .contains("Event Settings")
        .should("not.exist");
    });

    it("shows registered message and correct access for registered user", () => {
      loginStub("registrar");

      cy.visit(`${url}register`);
      cy.location("pathname").should("include", "register");
      cy.contains("You are currently registered.");
      cy.get(".dropdown-account").click();
      cy.get(".dropdown-account")
        .contains("Create Account")
        .should("not.exist");
      cy.get(".dropdown-account").contains("My Registration").should("exist");
      cy.get(".dropdown-account").contains("View Profile").should("exist");
      cy.get(".dropdown-account").contains("Manage Users").should("not.exist");
      cy.get(".dropdown-account")
        .contains("View Registrations")
        .should("not.exist");
      cy.get(".dropdown-account").contains("View Guests").should("not.exist");
      cy.get(".dropdown-account").contains("View Tables").should("not.exist");
      cy.get(".dropdown-account").contains("Event Planner").should("not.exist");
      cy.get(".dropdown-account")
        .contains("Event Settings")
        .should("not.exist");
    });

    it("shows registered message and correct access for administrator user", () => {
      loginStub("administrator");

      cy.visit(`${url}register`);
      cy.location("pathname").should("include", "register");
      cy.contains("You are currently registered.");
      cy.get(".dropdown-account").click();
      cy.get(".dropdown-account")
        .contains("Create Account")
        .should("not.exist");
      cy.get(".dropdown-account").contains("My Registration").should("exist");
      cy.get(".dropdown-account").contains("View Profile").should("exist");
      cy.get(".dropdown-account").contains("Manage Users").should("exist");
      cy.get(".dropdown-account")
        .contains("View Registrations")
        .should("exist");
      cy.get(".dropdown-account").contains("View Guests").should("exist");
      cy.get(".dropdown-account").contains("View Tables").should("exist");
      cy.get(".dropdown-account").contains("Event Planner").should("exist");
      cy.get(".dropdown-account").contains("Event Settings").should("exist");
    });

    it("shows registered message and correct access for super-administrator user", () => {
      loginStub("super-administrator");

      cy.visit(`${url}register`);
      cy.location("pathname").should("include", "register");
      cy.contains("You are currently registered.");
      cy.get(".dropdown-account").click();
      cy.get(".dropdown-account")
        .contains("Create Account")
        .should("not.exist");
      cy.get(".dropdown-account").contains("My Registration").should("exist");
      cy.get(".dropdown-account").contains("View Profile").should("exist");
      cy.get(".dropdown-account").contains("Manage Users").should("exist");
      cy.get(".dropdown-account")
        .contains("View Registrations")
        .should("exist");
      cy.get(".dropdown-account").contains("View Guests").should("exist");
      cy.get(".dropdown-account").contains("View Tables").should("exist");
      cy.get(".dropdown-account").contains("Event Planner").should("exist");
      cy.get(".dropdown-account").contains("Event Settings").should("exist");
    });
  });
});
