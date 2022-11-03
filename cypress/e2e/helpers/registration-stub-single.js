//Default stub pulls in single origin registration

const singleRegistrationStub = (updated) => {
  const registrationsURL = "/tables/registrations/*";
  const registrationList = updated
    ? `registrations/registration-${updated}-single`
    : "registrations/registration-origin-single";

  cy.intercept("GET", registrationsURL, {
    fixture: registrationList,
  }).as("getSingleRegistration");
};

export default singleRegistrationStub;
