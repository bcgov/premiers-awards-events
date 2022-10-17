import { expect, describe, beforeEach, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGuestsStore } from "../../../stores/guests";

const testingGUID = "961DB747B0044D3C866E1B39841C4501";
const fakeID = "0000000";
const defaultGuest = {
  registration: "",
  firstname: "",
  lastname: "",
  attendancetype: "",
  organization: "",
  accessibility: [],
  dietary: [],
  notes: "",
};
const defaultGuests = [];

describe("Guest Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("returns the current guest information", async () => {
    const guestStore = useGuestsStore();
    expect(guestStore.guest).toStrictEqual(defaultGuest);
    expect(guestStore.guests).toStrictEqual(defaultGuests);

    await guestStore.fillGuestsRegistration(testingGUID);
    expect(guestStore.guests.length).toBeGreaterThanOrEqual(1);

    guestStore.$reset;

    await guestStore.fillGuests();
    expect(guestStore.guests.length).toBeGreaterThanOrEqual(1);
  });
});
