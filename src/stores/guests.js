import { defineStore } from "pinia";
import apiRoutes from "../services/api-routes.services";
import tableRoutes from "../services/api-routes.tables";
import { useFinancialStore } from "./financial";
import { useTablesStore } from "./tables";

export const useGuestsStore = defineStore({
  id: "guestsStore",
  state: () => {
    return {
      guest: {
        registration: "",
        firstname: "",
        lastname: "",
        attendancetype: "",
        organization: "",
        accessibility: [],
        dietary: [],
        notes: "",
      },
      guests: [],
    };
  },
  getters: {
    getGuestsCount() {
      return this.guests.length;
    },
    getGuestTableStatus() {
      return this.guest.table;
    },
  },
  actions: {
    async fillGuestsRegistration(guid) {
      const guestList = await (
        await apiRoutes.getGuestsByRegistration(guid)
      ).data[0];
      this.guests = guestList.guests || [];
    },

    async fillGuestsTable(guid) {
      const guestList = await (
        await tableRoutes.getGuestsByTable(guid)
      ).data[0];
      this.guests = guestList.guests || [];
    },

    async fillGuests() {
      this.guests = await (await apiRoutes.getAllGuests()).data;
    },

    async addRegistrationData() {
      const registrationData = useFinancialStore();
      this.guest.registration = await registrationData.getId;
    },
    async addGuestList() {
      const {
        registration = "",
        guid = "",
        firstname = "",
        lastname = "",
        attendancetype = "",
        organization = "",
        accessibility = [],
        dietary = [],
      } = this.guest || {};

      await this.guests.push({
        registration,
        guid,
        firstname,
        lastname,
        attendancetype,
        organization,
        accessibility,
        dietary,
      });
    },
    async updateGuest(id, guestData) {
      await apiRoutes.updateGuest(id, guestData);
    },

    async removeGuestFromTable(id, guestData, table) {
      const tableStore = useTablesStore();
      await apiRoutes.updateGuest(id, guestData).then(() => {
        tableStore.pullTableDetails(table._id, {
          guests: id,
          organizations: {
            organization: guestData.organization,
            guestID: id,
          },
        });
      });
    },

    async addGuestToTable(id, guestData, table) {
      const tableStore = useTablesStore();
      await apiRoutes.updateGuest(id, guestData).then(() => {
        tableStore.pushTableDetails(table._id, {
          guests: id,
          organizations: {
            organization: guestData.organization,
            guestID: id,
          },
        });
      });
    },

    async deleteGuest(id, registrationID) {
      const financialStore = useFinancialStore();
      await apiRoutes.deleteGuest(id).then(() => {
        financialStore.pullFinancialInformation(
          { guests: id },

          registrationID
        );
      });
    },

    async registerGuest(guestData) {
      const financialStore = useFinancialStore();
      const newGuest = await apiRoutes.createGuest(guestData);
      const id = newGuest.data._id;
      await financialStore.pushFinancialInformation({ guests: id });
      this.guest["guid"] = newGuest.data["guid"];
      return this.guest;
    },

    async registerAllGuests() {
      for (let each of this.guests) {
        this.registerGuest(each);
      }
    },
  },
});
