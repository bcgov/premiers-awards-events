//Default stub pulls in origin tables

const singleTableStub = (state) => {
  const tablesUrl = "/tables/seating/*";
  const tableList = state
    ? `tables/tables-seating-${state}-single`
    : "tables/tables-seating-origin-single";

  cy.intercept("GET", tablesUrl, {
    fixture: tableList,
  }).as("getSingleTable");
};

export default singleTableStub;
