import { defineStore } from "pinia";
import settingsRoutes from "../services/api-routes.eventsettings";

export const useSettingsStore = defineStore({
  id: "settingsStore",
  state: () => {
    return {
      settings: {
        year: null,
        salesopen: "",
        salesclose: "",
      },
    };
  },

  getters: {
    getSettings() {
      return this.settings;
    },
    getIsSalesOpen() {
      let status = false;
      const now = new Date();
      if (
        now > new Date(this.settings.salesopen) &&
        now < new Date(this.settings.salesclose)
      ) {
        status = true;
      }
      return status;
    },
  },
  actions: {
    async fillSettings() {
      this.settings = await (await settingsRoutes.getSettings()).data;
    },

    async updateSettings(settingsData) {
      await settingsRoutes.updateSettings(settingsData);
    },

    resetSettings() {
      this.$reset();
    },
  },
});
