import { defineStore } from "pinia";
import apiRoutes from "../services/api-routes.services";
import { useSettingsStore } from "./settings";

const getRequiredTableCount = (guestCount, expandedTableCount) => {
  const expandedGuests = Math.min(guestCount, expandedTableCount * 11);
  const standardGuests = guestCount - expandedGuests;
  const expandedRemainder = expandedGuests % 11;
  const standardRemainder = standardGuests % 10;
  const remainder = expandedRemainder || standardRemainder;

  return (
    Math.floor(expandedGuests / 11) +
    Math.floor(standardGuests / 10) +
    (remainder === 0 ? 0 : remainder <= 5 ? 0.5 : 1)
  );
};

export const useFinancialStore = defineStore({
  id: "financialStore",
  state: () => {
    return {
      registration: {
        guid: "",
        registrar: "",
        users: [],
        organization: "",
        branch: "",
        primarycontact: "",
        primaryemail: "",
        financialcontact: "",
        clientministry: "",
        respcode: "",
        serviceline: "",
        stob: "",
        project: "",
        guests: [],
        submitted: false,
      },
      loading: false,
      registrations: [],
    };
  },
  getters: {
    getRegistration() {
      return this.registration;
    },
    getCompleted() {
      const status =
        this.registration.organization &&
        this.registration.branch &&
        this.registration.primarycontact &&
        this.registration.primaryemail &&
        this.registration.financialcontact &&
        this.registration.clientministry &&
        this.registration.respcode &&
        this.registration.serviceline &&
        this.registration.stob &&
        this.registration.project;
      return status;
    },
    getId() {
      return this.registration._id;
    },
    getGuid() {
      return this.registration.guid;
    },
    getRegistrar() {
      return this.registration.registrar;
    },
    getMinistry() {
      return this.registration.organization;
    },
    getUsers() {
      return this.registration.users;
    },
    getGuestCount() {
      return this.registration.guests.length;
    },
    getTableCount() {
      const settingsStore = useSettingsStore();
      return getRequiredTableCount(
        this.registration.guests.length,
        settingsStore.getExpandedTableCount(this.registration.organization)
      );
    },

    getTotalTableCount() {
      const settingsStore = useSettingsStore();
      let totalTables = 0;
      this.registrations.forEach((element) => {
        totalTables += getRequiredTableCount(
          element.guests.length,
          settingsStore.getExpandedTableCount(element.organization)
        );
      });
      return totalTables;
    },
  },
  actions: {
    async fill(guid) {
      try {
        const registrationData = await apiRoutes.getRegistration(guid);

        const validatedGuests = await apiRoutes.getGuestsByRegistration(
          registrationData.data[0]._id
        );
        //Overwrite retrieved guests with real guests from guests schema:
        registrationData.data[0].guests = validatedGuests.data[0].guests;

        this.registration = registrationData.data[0];
        this.registrations = [registrationData.data[0]];

        return registrationData.data[0];
      } catch (error) {
        return error;
      }
    },

    async fillAllUserRegistrations(guid) {
      try {
        const registrationData = await apiRoutes.getAllUserRegistrations(guid);
        // this.registration = registrationData.data[0];
        this.registrations = registrationData.data;
        return registrationData.data[0];
      } catch (error) {
        return error;
      }
    },

    async fillOnlyRegistration(guid) {
      const registrationData = await apiRoutes.getRegistration(guid);
      this.registration = registrationData.data[0];
      return registrationData.data[0];
    },
    async fillID(id) {
      const registrationData = await apiRoutes.getRegistrationByID(id);
      this.registration = registrationData.data[0];
      this.registrations = [registrationData.data[0]];
      return registrationData.data[0];
    },
    async fillAllRegistrations() {
      // PA-84 Added this flag to try and keep registrations populated when this function is called twice 
      if ( this.loading ) return Promise.resolve();
      this.loading = true;
      const registrations = (await apiRoutes.getAllRegistrations()).data;
      this.registrations = registrations;
      this.loading = false;
    },

    async deleteRegistration(id) {
      await apiRoutes.deleteRegistration(id);
    },

    async removeRegistrationGuest(id, data) {
      await apiRoutes.updateRegistration(id, data);
    },

    async createRegistration(
      guid,
      username,
      firstname,
      lastname,
      email,
      extraGUID
    ) {
      const userGUID = extraGUID ? extraGUID : guid;
      const newRegistration = await apiRoutes.createRegistration({
        guid,
        users: [{ guid: userGUID, username }],
        registrar: username,
        primarycontact: `${firstname} ${lastname}`,
        primaryemail: email,
        submitted: false,
      });
      this.registration = newRegistration.data;
      return this.registration;
    },

    async registerFinancialInformation(registrationData, regID) {
      const id = regID || this.registration._id;
      const newRegistration = await apiRoutes.updateRegistration(
        id,
        registrationData
      );
      this.registration = newRegistration.data;
      return this.registration;
    },

    async pushFinancialInformation(registrationData, regID) {
      const id = regID || this.registration._id;
      const newRegistration = await apiRoutes.pushToRegistration(
        id,
        registrationData
      );
      this.registration = newRegistration.data;
      return this.registration;
    },

    async pullFinancialInformation(registrationData, regID) {
      const id = regID || this.registration._id;
      const newRegistration = await apiRoutes.pullFromRegistration(
        id,
        registrationData
      );
      this.registration = newRegistration.data;
      return this.registration;
    },
  },
});
