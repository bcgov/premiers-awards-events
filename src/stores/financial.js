import { defineStore } from "pinia";
import apiRoutes from "../services/api-routes.services";

export const useFinancialStore = defineStore({
  id: "financialStore",
  state: () => {
    return {
      registration: {
        guid: "",
        registrar: "",
        organization: "",
        branch: "",
        primarycontact: "",
        primaryemail: "",
        financialcontact: "",
        clientministry: null,
        respcode: null,
        serviceline: null,
        stob: null,
        project: null,
        guests: [],
        submitted: false,
      },
      registrations: [],
    };
  },
  getters: {
    getRegistration() {
      return this.registration;
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
    getGuestCount() {
      return this.registration.guests.length;
    },
    getTableCount() {
      const guestCount = this.registration.guests.length;
      let tableCount = 0;
      if (guestCount % 10 <= 5 && guestCount % 10 != 0) tableCount += 0.5;
      if (guestCount % 10 > 5) tableCount += 1;
      if (guestCount / 10 >= 1) tableCount += Math.floor(guestCount / 10);
      return tableCount;
    },

    getTotalTableCount() {
      let totalTables = 0;
      this.registrations.forEach((element) => {
        const guestCount = element.guests.length;
        if (guestCount % 10 <= 5 && guestCount % 10 != 0) totalTables += 0.5;
        if (guestCount % 10 > 5) totalTables += 1;
        if (guestCount / 10 >= 1) totalTables += Math.floor(guestCount / 10);
      });
      return totalTables;
    },
  },
  actions: {
    async fill(guid) {
      try {
        const registrationData = await apiRoutes.getRegistration(guid);
        this.registration = registrationData.data[0];
        this.registrations = [registrationData.data[0]];
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
      this.registrations = await (await apiRoutes.getAllRegistrations()).data;
    },

    async deleteRegistration(id) {
      await apiRoutes.deleteRegistration(id);
    },

    async removeRegistrationGuest(id, data) {
      await apiRoutes.updateRegistration(id, data);
    },

    async createRegistration(guid, username, firstname, lastname, email) {
      const newRegistration = await apiRoutes.createRegistration({
        guid,
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
  },
});
