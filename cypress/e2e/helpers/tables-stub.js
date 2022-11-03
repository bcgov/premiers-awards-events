//Default stub pulls in origin tables

const tableStub = (state) => {
  const tablesUrl = "/tables/seating";
  const tableList = state
    ? `tables/tables-seating-${state}`
    : "tables/tables-seating-origin";

  cy.intercept("GET", tablesUrl, {
    fixture: tableList,
  }).as("getTables");
};

export default tableStub;
