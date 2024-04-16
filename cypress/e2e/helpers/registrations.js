//Default stub pulls in origin registrations
const registrationsURL = "/tables/registrations";
const registrationsFixtures = "responses/registrations/";

const getRegistrations = (file) => {
  const registrationList = file
    ? `${registrationsFixtures}get-all/${file}`
    : `${registrationsFixtures}get-all/0-registrations-origin`;

  cy.intercept("GET", registrationsURL, {
    fixture: registrationList,
  }).as("getRegistrations");
};

const getSingleRegistration = (file) => {
  const registrationSingleUrl = `${registrationsURL}/*`;
  const registrationList = file
    ? `${registrationsFixtures}get-one/${file}`
    : `${registrationsFixtures}get-one/0-registration-blank`;

  console.log(registrationList, "this is file name");

  cy.intercept("GET", registrationSingleUrl, {
    fixture: registrationList,
  }).as("getSingleRegistration");
};

const postRegistrations = (file) => {
  const registrationList = file
    ? `${registrationsFixtures}get-all/${file}`
    : `${registrationsFixtures}get-all/0-registrations-origin`;

  cy.intercept("POST", registrationsURL, {
    fixture: registrationList,
  }).as("postRegistrations");
};

const postSingleRegistration = (file) => {
  const registrationSingleUrl = `${registrationsURL}/*`;
  const registrationList = file
    ? `${registrationsFixtures}get-one/${file}`
    : `${registrationsFixtures}get-one/0-registration-blank`;

  cy.intercept("POST", registrationSingleUrl, {
    fixture: registrationList,
  }).as("postSingleRegistration");
};

module.exports = {
  getRegistrations,
  getSingleRegistration,
  postRegistrations,
  postSingleRegistration,
};
