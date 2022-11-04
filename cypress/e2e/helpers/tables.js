//Default stub pulls in origin tables
const tablesUrl = "/tables/seating";
const tableFixtures = "responses/tables/";

const getTables = (file) => {
  const tableList = file
    ? `${tableFixtures}get-all/${file}`
    : `${tableFixtures}get-all/1-tables-origin`;

  cy.intercept("GET", tablesUrl, {
    fixture: tableList,
  }).as("getTables");
};

const getSingleTable = (file) => {
  const tableSingleURL = `${tablesUrl}/*`;
  const tableList = file
    ? `${tableFixtures}get-one/${file}`
    : `${tableFixtures}get-one/1-table-origin`;

  cy.intercept("GET", tableSingleURL, {
    fixture: tableList,
  }).as("getSingleTable");
};

const postTable = (file) => {
  const tableList = file
    ? `${tableFixtures}get-all/${file}`
    : `${tableFixtures}get-all/1-tables-origin`;

  cy.intercept("POST", tablesUrl, {
    fixture: tableList,
  }).as("postTable");
};

const postSingleTable = (file) => {
  const tableSingleURL = `${tablesUrl}/*`;
  const tableList = file
    ? `${tableFixtures}get-one/${file}`
    : `${tableFixtures}get-one/1-table-origin`;

  cy.intercept("POST", tableSingleURL, {
    fixture: tableList,
  }).as("postSingleTable");
};

module.exports = { getTables, getSingleTable, postTable, postSingleTable };
