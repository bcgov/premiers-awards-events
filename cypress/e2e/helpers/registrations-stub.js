//Default stub pulls in origin registrations

const registrationStub = (state) => {
  const registrationsURL = "/tables/registrations";
  const registrationList = state
    ? `registrations/tables-registrations-${state}`
    : "registrations/tables-registrations-origin";

  cy.intercept("GET", registrationsURL, {
    fixture: registrationList,
  }).as("getRegistrations");
};

export default registrationStub;
