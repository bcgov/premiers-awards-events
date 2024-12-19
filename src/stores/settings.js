/**
 * Settings state (Pinia)
 *
 * Schema: [{
 *         guid: '',
 *         username: '',
 *         firstname: '',
 *         lastname: '',
 *         email: '',
 *         roles: []
 *         }]
 *
 * @param {Array} settings
 * @param {Object} user
 * @param {Boolean} loading
 * @param {Object} error
 *
 * **/

import { defineStore } from "pinia";
import { get, post } from "@/services/api.services";
//import settingsRoutes from "../services/api-routes.eventsettings";

export const useSettingsStore = defineStore({
  id: "settingData",
  state: () => ({
    settings: [],
    selected: {
      type: "",
      label: "",
      value: "",
    },
    loading: false,
    error: null,
  }),
  getters: {
    getErrors: (state) => state.error,
    getIsSalesOpen: (state) => {
      if (state.settings == undefined || state.settings.length == 0) {
        return false;
      }
      const now = new Date();
      if (
        now >
          new Date(
            state.settings.find(
              (item) => item.type === "globalSettings"
            ).value.salesopen
          ) &&
        now <
          new Date(
            state.settings.find(
              (item) => item.type === "globalSettings"
            ).value.salesclose
          )
      ) {
        return true;
      }
      return false;
    },
  },
  actions: {
    // Reset selected item
    async reset() {
      this.loading = false;
      this.error = null;
      this.selected = {
        type: "",
        label: "",
        value: "",
      };
      this.getAll();
    },
    // Get all settings
    async getAll() {
      this.loading = true;
      const [error, settings] = await get(`admin/settings/view`);
      this.settings = settings;
      this.error = error;
      this.loading = false;
    },
    // Get setting by ID
    async get(id) {
      this.loading = true;
      const [error, setting] = await get(`admin/settings/type/${id}`);
      if (error) return [];
      const value = setting[0];
      if (value.value) return value.value;
      else return value;
    },
    async select(id) {
      const [error, setting] = await get(`admin/settings/type/${id}`);
      this.selected = setting[0];
      if (error) return false;
      return true;
    },
    // lookup setting by type and, if defined, the key within the value
    // Returns: Only type defined: entire settings content
    //          type+key defined: label by default,
    //          key+type+fullValue(true) defined: entire setting contents of the selected key
    lookup(type, key, fullValue) {
      try {
        if (this.settings == undefined || this.settings.length == 0) {
          this.getAll();
        }
        if (key != undefined && this.settings.length > 0) {
          const setting = this.settings.find((item) => item.type === type);
          const jsonSetting = setting.value;
          const keySetting = jsonSetting.find((item) => item.key === key);
          if (keySetting && !fullValue)
            return keySetting.label && keySetting.label.length > 0
              ? keySetting.label
              : jsonSetting;
          if (keySetting && fullValue) return keySetting;
        } else if (key == undefined && this.settings.length > 0) {
          const setting = this.settings.find((item) => item.type === type);
          const jsonSetting = setting.value;
          if (fullValue) return jsonSetting;
          try {
            const sorted = jsonSetting.sort((a, b) => {
              /*if (a.label < b.label) {
                return -1;
              }*/
             
              // PA-173 Changed to localeCompare due for Firefox not sorting correctly
              return a.label.localeCompare(b.label);
            });
            return sorted;
          } catch (e) {
            return jsonSetting;
          }
        } else {
          console.log(
            "[ERROR] -  Settings.store.js: Cannot find lookup for params: " +
              type +
              ", " +
              key +
              ", " +
              fullValue
          );
          return "NOT FOUND";
        }
      } catch (e) {
        console.log(
          "[ERROR] -  Settings.store.js: Cannot find lookup --- Caught error:",
          e
        );
        return "NOT FOUND";
      }
    },
    // Lookup organizations, and also return externals/custom orgs with includeExternal
    lookupOrg(type, key, includeExternal = false) {
      try {
        if (this.settings == undefined || this.settings.length == 0) {
          this.getAll();
        }
        if (key != undefined && this.settings.length > 0) {
          const setting = this.settings.find((item) => item.type === type);
          const jsonSetting = setting.value;
          const keySetting = jsonSetting.find((item) => item.key === key);
          if (keySetting)
            return keySetting.label && keySetting.label.length > 0
              ? keySetting.label
              : jsonSetting;
          else if (includeExternal) return key;
          else return null;
        } else {
          console.log(
            "[ERROR] -  Settings.store.js: Cannot find lookup for params: " +
              type +
              ", " +
              key +
              ", "
          );
          if (includeExternal) return key;
          else return null;
        }
      } catch (e) {
        console.log(
          "[ERROR] -  Settings.store.js: Cannot find lookup --- Caught error:",
          e
        );
        return "NOT FOUND";
      }
    },
    // Add new user
    async insert() {
      this.loading = true;
      const [error] = await post(`admin/settings/create`, this.selected);
      this.error = error;
      this.loading = false;
    },
    // Update user data
    async update() {
      const { _id = "" } = this.selected || {};
      this.loading = true;
      const [error] = await post(`admin/settings/update/${_id}`, this.selected);
      this.error = error;
      this.loading = false;
    },
    // Delete user
    async remove() {
      this.loading = true;
      const { _id = "" } = this.selected || {};
      const [error] = await get(`admin/settings/delete/${_id}`);
      this.error = error;
      this.loading = false;
    },
    async checkSection(section, category) {
      const metadata = this.lookup("categories", category);
      if (!metadata) return null;
      return metadata.sections.filter((sec) => sec.id === section).length > 0;
    },
  },
});

// export const useSettingsStore = defineStore({
//   id: "settingsStore",
//   state: () => {
//     return {
//       settings: {
//         year: null,
//         salesopen: "",
//         salesclose: "",
//       },
//     };
//   },

//   getters: {
//     getSettings() {
//       return this.settings;
//     },
//     getIsSalesOpen() {
//       let status = false;
//       const now = new Date();
//       if (
//         now > new Date(this.settings.salesopen) &&
//         now < new Date(this.settings.salesclose)
//       ) {
//         status = true;
//       }
//       return status;
//     },
//   },
//   actions: {
//     async fillSettings() {
//       this.settings = await (await settingsRoutes.getSettings()).data;
//     },

//     async updateSettings(settingsData) {
//       await settingsRoutes.updateSettings(settingsData);
//     },

//     resetSettings() {
//       this.$reset();
//     },
//   },
// });
