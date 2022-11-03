//Default stub pulls in origin guests

const guestStub = (state) => {
  const guestsURL = "/tables/guests";
  const guestList = state
    ? `registrations/tables-guests-${state}`
    : "registrations/tables-guests-origin";

  cy.intercept("GET", guestsURL, {
    fixture: guestList,
  }).as("getGuests");
};

export default guestStub;
