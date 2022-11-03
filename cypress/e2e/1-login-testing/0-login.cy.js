// const { guid = "", username = "" } = res.locals.user;
// (guid = ""), (username = ""), (firstname = ""), (lastname = ""), (email = "");
const url = Cypress.env("url");
const user = Cypress.env("user");
const apiURL = Cypress.env("apiURL");

describe("Registration Process", () => {
  context("Registration Page for new user", () => {
    beforeEach(() => {
      const registrationurl = `/admin/users/register`;
      const infoURL = "/admin/users/info";
      const loginURL = "/admin/users/login";
      const settingsURL = "/tables/settings";
      cy.intercept("POST", registrationurl, {
        fixture: "user-info/registration.json",
      }).as("postRegistration");

      cy.intercept("GET", infoURL, {
        fixture: "user-info/info.json",
      }).as("inituser");

      cy.intercept("GET", loginURL, {
        fixture: "user-info/initial-user.json",
      }).as("getLogin");

      cy.intercept("GET", settingsURL, {
        fixture: "user-info/eventsettings.json",
      }).as("getSettings");

      cy.visit(url, { timeout: 50000 });

      cy.wait(["@inituser", "@getLogin", "@getSettings"]);
    });

    it("navigates to the registration page when clicking on the register button", () => {
      cy.get(".p-button").contains("Create a profile to register").click();
      cy.location("pathname").should("include", "register");

      cy.fixture("login-info").then((users) => {
        const { user1 } = users;

        cy.get("#input-user-register-firstname").type("{selectAll}");
        cy.get("#input-user-register-firstname").type(user1["firstname"]);

        cy.get("#input-user-register-lastname").type("{selectAll}");
        cy.get("#input-user-register-lastname").type(user1["lastname"]);

        cy.get("#input-user-register-email").type("{selectAll}");
        cy.get("#input-user-register-email").type(user1["email"]);

        cy.get(".p-card-content form button").click();
        cy.wait("@postRegistration");
        cy.contains("Successfully registered user!");
      });
    });
  });
});

describe("Login Process", () => {
  context("login on page entry", () => {
    it("logs the user in on the main page", () => {
      const infoURL = "/admin/users/info";
      const loginURL = "/admin/users/login";
      const settingsURL = "/tables/settings";

      cy.intercept("GET", infoURL, {
        fixture: "user-info/info.json",
      }).as("inituser");

      cy.intercept("GET", loginURL, {
        fixture: "user-info/initial-user.json",
      }).as("getLogin");

      cy.intercept("GET", settingsURL, {
        fixture: "user-info/eventsettings.json",
      }).as("getSettings");

      cy.visit(url, { timeout: 50000 });

      cy.wait(["@inituser", "@getLogin", "@getSettings"]);

      cy.fixture("login-info").then((users) => {
        const { user1 } = users;
        cy.contains(`${user1["username"]}`);
      });
    });
  });
});
