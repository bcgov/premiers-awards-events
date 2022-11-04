import { getLogin } from "../helpers/login";

describe("Registration Process", () => {
  context("Registration Page for new user", () => {
    beforeEach(() => {
      getLogin("initial-user");
    });

    it("navigates to the registration page when clicking on the register button", () => {
      const registrationurl = `/admin/users/register`;
      cy.intercept("POST", registrationurl, {
        fixture: "user-info/user-registration.json",
      }).as("postUserRegistration");

      cy.get(".p-button").contains("Create a profile to register").click();
      cy.location("pathname").should("include", "register");

      cy.fixture("requests/login-info").then((users) => {
        const { user1 } = users;

        cy.get("#input-user-register-firstname").type("{selectAll}");
        cy.get("#input-user-register-firstname").type(user1["firstname"]);

        cy.get("#input-user-register-lastname").type("{selectAll}");
        cy.get("#input-user-register-lastname").type(user1["lastname"]);

        cy.get("#input-user-register-email").type("{selectAll}");
        cy.get("#input-user-register-email").type(user1["email"]);

        cy.get(".p-card-content form button").click();
        cy.wait("@postUserRegistration");
        cy.contains("Successfully registered user!");
      });
    });
  });
});

describe("Login Process", () => {
  context("login on page entry", () => {
    it("logs the user in on the main page", () => {
      getLogin("initial-user");

      cy.fixture("requests/login-info").then((users) => {
        const { user1 } = users;
        cy.contains(`${user1["username"]}`);
      });
    });
  });
});
