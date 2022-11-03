const url = Cypress.env("url");

//Default stub logs in as super-administrator for testing

const loginStub = (loginFile) => {
  const infoURL = "/admin/users/info";
  const loginURL = "/admin/users/login";
  const settingsURL = "/tables/settings";
  const loginID = loginFile
    ? `user-info/user-states/${loginFile}`
    : "user-info/user-states/super-administrator";
  const infoID = loginFile
    ? `user-info/user-states/${loginFile}-info`
    : "user-info/user-states/super-administrator-info";

  cy.intercept("GET", infoURL, {
    fixture: infoID,
  }).as("inituser");

  cy.intercept("GET", loginURL, {
    fixture: loginID,
  }).as("getLogin");

  cy.intercept("GET", settingsURL, {
    fixture: "user-info/eventsettings.json",
  }).as("getSettings");

  cy.visit(url, { timeout: 50000 });

  cy.wait(["@inituser", "@getLogin", "@getSettings"]);
};

export default loginStub;
