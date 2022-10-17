import { expect, describe, beforeEach, it } from "vitest";
import { useFinancialStore } from "../../../stores/financial";
import { setActivePinia, createPinia } from "pinia";

const testingGUID = "961DB747B0044D3C866E1B39841C4501";
const fakeID = "0000000";
const defaultRegistration = {
  guid: "",
  registrar: "",
  organization: "",
  branch: "",
  primarycontact: "",
  primaryemail: "",
  financialcontact: "",
  clientministry: null,
  respcode: "",
  serviceline: null,
  stob: null,
  project: "",
  guests: [],
  submitted: false,
};
const defaultRegistrations = [];

describe("Financial Store", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("returns the current registration information", async () => {
    const financialStore = useFinancialStore();
    expect(financialStore.registration).toStrictEqual(defaultRegistration);
    expect(financialStore.registrations).toStrictEqual(defaultRegistrations);

    await financialStore.fill(testingGUID);
    expect(financialStore.registration).not.toStrictEqual(defaultRegistration);

    await financialStore.fillAllRegistrations();
    expect(financialStore.registrations.length).toBeGreaterThanOrEqual(1);
  });

  it("creates and deletes a registration", async () => {
    const financialStore = useFinancialStore();
    expect(await financialStore.fill(fakeID)).toBe(undefined);

    await financialStore.createRegistration(
      fakeID,
      "testingUser",
      "firstNameTest",
      "lastNameTest",
      "emailTest"
    );
    expect(financialStore.registration).not.toBe(defaultRegistration);

    financialStore.$reset;
    expect(() => financialStore.fill(fakeID)).not.toThrowError("error");
    await financialStore.deleteRegistration(financialStore.registration._id);
    expect(await financialStore.fill(fakeID)).toBe(undefined);
  });
});
