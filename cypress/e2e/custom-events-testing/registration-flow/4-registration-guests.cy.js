/// <reference types="cypress" />
const url = Cypress.env("url");
import { getCustomLogin } from "../../helpers/login";
import {
  getRegistrations,
  getSingleRegistration,
  postRegistrations,
} from "../../helpers/registrations";
import { getTables } from "../../helpers/tables";
import {
  getGuests,
  getSingleGuest,
  postGuests,
  postSingleGuest,
} from "../../helpers/guests";

describe("Users can add, edit, and delete guests on a registration.", () => {
  context("Guest add and edit functionality, using 'add guests' popup", () => {
    beforeEach(() => {
      getCustomLogin();
      getRegistrations();
      postRegistrations();
      getTables();
      postGuests();
      getGuests();
      getSingleGuest();
      postSingleGuest();

      getSingleRegistration("1b-registration-edited-GET");

      cy.fixture(
        "responses/registrations/get-one/1b-registration-edited-POST"
      ).then((registration) => {
        const userInfo = registration;
        cy.intercept("GET", `/tables/registrations/${userInfo.guid}/guests`, {
          fixture:
            "responses/registrations/get-one/5-registration-submitted-guests",
        }).as("getRegistrationGuests");

        cy.visit(`${url}registration/${userInfo.guid}`, { timeout: 50000 });
      });
      cy.wait([
        "@inituser",
        "@getLogin",
        "@getSettings",
        "@getSingleRegistration",
        "@getSingleRegistration",
        "@getTables",
        "@getRegistrationGuests",
      ]);
    });

    it("adds one guest (guest1)", () => {
      cy.get(`[aria-label="Add Guests"]`).click();
      cy.get(".guest-registration-form").should("be.visible");

      cy.get(".guest-registration-form .p-autocomplete-dropdown").click();

      cy.fixture("requests/guest-info").then((guests) => {
        const { guest1 } = guests;
        cy.get(".p-autocomplete-panel li")
          .contains(guest1["organization"])
          .click();

        cy.get(".text-field #firstname").type("{selectAll}", "{del}");
        cy.get(".text-field #firstname").type(guest1["firstname"]);

        cy.get(".text-field #lastname").type("{selectAll}", "{del}");
        cy.get(".text-field #lastname").type(guest1["lastname"]);

        cy.get("#attendancetype .p-dropdown-trigger").click();
        cy.get("#attendancetype_list li")
          .contains(guest1["attendancetype"])
          .click();

        for (let each of guest1["accessibility"]) {
          cy.get(`.field-checkbox`)
            .contains(each)
            .parent()
            .children("div")
            .click();
        }
        for (let each of guest1["dietary"]) {
          cy.get(`.field-checkbox`)
            .contains(each)
            .parent()
            .children("div")
            .click();
        }

        postGuests("guest1");
        cy.intercept(`/tables/registrations/*/*`, {
          fixture: "responses/registrations/get-one/2a-registration-guests",
        }).as("pushGuests");
        cy.get(".guest-registration-form button").contains("Add Guest").click();
        cy.wait(["@postGuests", "@pushGuests"]);
        cy.get(".p-dialog .p-dialog-header-close").click();
        cy.get(".guest-registration-form").should("not.exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest1["organization"])
          .should("exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest1["firstname"])
          .should("exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest1["lastname"])
          .should("exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest1["attendancetype"])
          .should("exist");

        for (let each of guest1["accessibility"]) {
          cy.get("#personal-registration-guests-table td")
            .contains(each)
            .should("exist");
        }

        for (let each of guest1["dietary"]) {
          cy.get("#personal-registration-guests-table td")
            .contains(each)
            .should("exist");
        }
      });
    });

    it("adds multiple guests (guests 2-6)", () => {
      cy.fixture("requests/guest-info").then((guests) => {
        for (let each in guests) {
          if (
            each !== "guest1" &&
            each !== "guestFaulty" &&
            each !== "guest7"
          ) {
            cy.get(`[aria-label="Add Guests"]`).click();
            cy.get(".guest-registration-form").should("be.visible");

            //cy.get(".guest-registration-form .p-autocomplete-input").click();

            cy.get(".guest-registration-form .p-autocomplete-input").type(
              "{selectAll}",
              "{del}"
            );
            cy.get(".guest-registration-form .p-autocomplete-input").type(
              guests[each]["organization"]
            );

            // cy.get(".p-autocomplete-panel li")
            //   .contains(guests[each]["organization"])
            //   .click();

            cy.get(".text-field #firstname").type("{selectAll}", "{del}");
            cy.get(".text-field #firstname").type(guests[each]["firstname"]);

            cy.get(".text-field #lastname").type("{selectAll}", "{del}");
            cy.get(".text-field #lastname").type(guests[each]["lastname"]);

            cy.get("#attendancetype .p-dropdown-trigger").click();
            cy.get("#attendancetype_list li")
              .contains(guests[each]["attendancetype"])
              .click();

            for (let every of guests[each]["accessibility"]) {
              cy.get(`.field-checkbox`)
                .contains(every)
                .parent()
                .children("div")
                .click();
            }
            for (let every of guests[each]["dietary"]) {
              cy.get(`.field-checkbox`)
                .contains(every)
                .parent()
                .children("div")
                .click();
            }

            postGuests(`${each}`);
            cy.intercept(`/tables/registrations/*/*`, {
              fixture: "responses/registrations/get-one/2b-registration-guests",
            }).as("pushGuests");
            cy.get(".guest-registration-form button")
              .contains("Add Guest")
              .click();
            cy.wait(["@postGuests", "@pushGuests"]);

            cy.get(".guest-registration-form button")
              .contains("Add Guest")
              .click();
            cy.get(".p-dialog .p-dialog-header-close").click();
            cy.get(".guest-registration-form").should("not.exist");

            cy.get("#personal-registration-guests-table td")
              .contains(guests[each]["organization"])
              .should("exist");

            cy.get("#personal-registration-guests-table td")
              .contains(guests[each]["firstname"])
              .should("exist");

            cy.get("#personal-registration-guests-table td")
              .contains(guests[each]["lastname"])
              .should("exist");

            cy.get("#personal-registration-guests-table td")
              .contains(guests[each]["attendancetype"])
              .should("exist");

            for (let every of guests[each]["accessibility"]) {
              cy.get("#personal-registration-guests-table td")
                .contains(every)
                .should("exist");
            }

            for (let every of guests[each]["dietary"]) {
              cy.get("#personal-registration-guests-table td")
                .contains(every)
                .should("exist");
            }
          }
        }
      });
    });

    it("does not add an incorrect/incomplete guest", () => {
      cy.get(`[aria-label="Add Guests"]`).click();
      cy.get(".guest-registration-form").should("be.visible");

      cy.fixture("requests/guest-info").then((guests) => {
        const { guestFaulty } = guests;

        cy.get(".guest-registration-form .p-autocomplete-input").type(
          "{selectAll}",
          "{del}"
        );
        cy.get(".guest-registration-form .p-autocomplete-input").invoke(
          "val",
          ""
        );

        cy.get(".text-field #firstname").type("{selectAll}", "{del}");
        cy.get(".text-field #firstname").invoke("val", "");

        cy.get(".text-field #lastname").type("{selectAll}", "{del}");
        cy.get(".text-field #lastname").invoke("val", "");

        cy.get("#attendancetype .p-dropdown-trigger").click();
        cy.get("#attendancetype_list li")
          .contains(guestFaulty["attendancetype"])
          .should("not.exist");
        cy.get("#attendancetype .p-dropdown-trigger").click();

        for (let each of guestFaulty["accessibility"]) {
          cy.get(`.field-checkbox`).contains(each).should("not.exist");
        }
        for (let each of guestFaulty["dietary"]) {
          cy.get(`.field-checkbox`).contains(each).should("not.exist");
        }

        cy.get(".guest-registration-form button").contains("Add Guest").click();

        cy.get("#organization-help").should("exist");
        cy.get("#firstname-help").should("exist");
        cy.get("#lastname-help").should("exist");
        cy.get("#attendancetype-help").should("exist");

        cy.get(".p-dialog .p-dialog-header-close").click();
        cy.get(".guest-registration-form").should("not.exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guestFaulty["attendancetype"])
          .should("not.exist");
      });
    });

    it("correctly edits a guest (updates guest1 to guest7)", () => {
      cy.get("#personal-registration-guests-table .edit-button")
        .first()
        .click();
      cy.get(".p-dialog-header").contains("Guest Details").should("be.visible");

      cy.fixture("requests/guest-info").then((guests) => {
        const { guest7 } = guests;

        cy.get(".p-autocomplete-input").type("{selectAll}", "{del}");
        cy.get(".p-autocomplete-input").type(guest7["organization"]);

        cy.get(".field-text #firstname").type("{selectAll}", "{del}");
        cy.get(".field-text #firstname").type(guest7["firstname"]);

        cy.get(".field-text #firstname").type("{selectAll}", "{del}");
        cy.get(".field-text #firstname").type(guest7["firstname"]);

        cy.get(".field-text #lastname").type("{selectAll}", "{del}");
        cy.get(".field-text #lastname").type(guest7["lastname"]);

        cy.get("#attendancetype .p-dropdown-trigger").click();
        cy.get("#attendancetype_list li")
          .contains(guest7["attendancetype"])
          .click();

        postSingleGuest("guest1-edited");

        cy.intercept(`/tables/registrations/*/*`, {
          fixture:
            "responses/registrations/get-one/5-registration-submitted-guests-edited",
        }).as("pushGuests");

        cy.get(".p-dialog-footer button").contains("Save").click();
        cy.wait(["@postSingleGuest", "@pushGuests"]);

        cy.get("#personal-registration-guests-table td")
          .contains(guest7["organization"])
          .should("exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest7["firstname"])
          .should("exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest7["lastname"])
          .should("exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest7["attendancetype"])
          .should("exist");
      });
    });

    it("deletes a guest", () => {
      cy.get("#personal-registration-guests-table .delete-button")
        .first()
        .click();
      postGuests;
      cy.get(".p-dialog-header").contains("Confirm").should("be.visible");

      cy.intercept("POST", "/tables/guests/delete/*", {
        acknowledged: true,
        deletedCount: 1,
      }).as("deleteGuest");

      cy.intercept("POST", `/tables/registrations/*/pull`, {
        fixture:
          "responses/registrations/get-one/3-registration-unsubmitted-POST",
      }).as("pullGuest");

      cy.intercept("GET", `/tables/registrations/*/*`, {
        fixture:
          "responses/registrations/get-one/5-registration-submitted-guests",
      }).as("pullGuest");

      cy.get(".p-dialog-footer button").contains("Yes").click();
      cy.wait(["@deleteGuest", "@pullGuest"]);

      cy.fixture("requests/guest-info").then((guests) => {
        const { guest7 } = guests;

        cy.get("#personal-registration-guests-table td")
          .contains(guest7["organization"])
          .should("not.exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest7["firstname"])
          .should("not.exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest7["lastname"])
          .should("not.exist");

        cy.get("#personal-registration-guests-table td")
          .contains(guest7["attendancetype"])
          .should("not.exist");
      });
    });
  });
});
