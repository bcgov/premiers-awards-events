const { defineConfig } = require("cypress");
require("dotenv").config();

const nodeENV = process.env.NODE_ENV;
const baseURL = process.env.PA_APPS_BASE_URL;
const appPort = process.env.PA_APPS_EVENTS_PORT || 3000;
const apiURL = process.env.PA_APPS_API_URL;
const appURL = process.env.PA_APPS_EVENTS_URL;

module.exports = defineConfig({
  projectId: "x91brq",
  e2e: {
    experimentalSessionAndOrigin: true,
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
    url: appURL,
    nodeENV,
    baseURL,
    appPort,
    apiURL,
    appURL,
  },
  video: false,
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
});
