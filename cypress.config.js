const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "x91brq",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    local: "http://localhost:3002/",
    user: "sprose",
  },
});
