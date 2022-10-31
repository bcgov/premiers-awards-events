const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "x91brq",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    excludeSpecPattern: process.env.CI
      ? [
          "cypress/e2e/all.cy.js",
          "cypress/e2e/custom-events-testing/registration-all.cy.js",
          "cypress/e2e/custom-events-testing/admin-all.cy.js",
        ]
      : [],
  },
  env: {
    url: "http://localhost:3002/",
    user: "sprose",
  },
  video: false,
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 2,
  },
});
