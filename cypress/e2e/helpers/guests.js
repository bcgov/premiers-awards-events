//Default stub pulls in origin guests
const guestsURL = "/tables/guests";
const guestsFixture = "responses/guests/";

const getGuests = (file) => {
  const guestList = file
    ? `${guestsFixture}get-all/${file}`
    : `${guestsFixture}get-all/1-guests-origin`;

  cy.intercept("GET", guestsURL, {
    fixture: guestList,
  }).as("getGuests");
};

const getSingleGuest = (file) => {
  const guestSingleUrl = `${guestsURL}/*`;
  const guestList = file
    ? `${guestsFixture}get-one/${file}`
    : `${guestsFixture}get-one/guest-1`;

  cy.intercept("GET", guestSingleUrl, {
    fixture: guestList,
  }).as("getSingleGuest");
};

const postGuests = (file) => {
  const guestList = file
    ? `${guestsFixture}get-all/${file}`
    : `${guestsFixture}get-all/1-guests-origin`;

  cy.intercept("POST", guestsURL, {
    fixture: guestList,
  }).as("postGuests");
};

const postSingleGuest = (file) => {
  const guestSingleUrl = `${guestsURL}/*`;
  const guestList = file
    ? `${guestsFixture}get-one/${file}`
    : `${guestsFixture}get-one/guest-1`;

  cy.intercept("POST", guestSingleUrl, {
    fixture: guestList,
  }).as("postSingleGuest");
};

module.exports = { getGuests, getSingleGuest, postGuests, postSingleGuest };
