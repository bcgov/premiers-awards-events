import { defineStore } from "pinia";
import { useMessageStore } from "./messages";
import UsersDataService from "../services/api-routes.users";

export const useAuthUserStore = defineStore({
  id: "auth/user",
  state: () => {
    return {
      user: {
        guid: "",
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        roles: [],
      },
      users: [],
    };
  },
  getters: {
    getUser() {
      return this.user;
    },
    isAuthenticated() {
      return (
        !!this.user &&
        !!this.user.guid &&
        !!this.user.username &&
        !!(this.user.roles.length > 0)
      );
    },

    isRegistrar() {
      const active = !this.user.roles.includes("inactive");
      const hasRoles =
        this.user.roles.includes("registrar") ||
        this.user.roles.includes("administrator") ||
        this.user.roles.includes("super-administrator");
      return active && hasRoles;
    },
    isAdmin() {
      const active = !this.user.roles.includes("inactive");
      const hasAdmin =
        this.user.roles.includes("administrator") ||
        this.user.roles.includes("super-administrator");
      return active && hasAdmin;
    },
    isSuperAdmin() {
      const active = !this.user.roles.includes("inactive");
      const hasSuperAdmin = this.user.roles.includes("super-administrator");
      return active && hasSuperAdmin;
    },
  },
  actions: {
    async login() {
      try {
        const response = (await UsersDataService.login()) || {};
        const { data = {} } = response || {};
        const { user = {} } = data || {};
        this.setUser(user);
      } catch (err) {
        const message = useMessageStore();
        console.error(err);
        message.setMessage({
          text: "Please sign in to access this site.",
          type: "danger",
        });
      }
    },
    async logout() {
      await UsersDataService.logout();
      localStorage.clear();
      this.user = null;
    },

    async getUserById(guid) {
      const message = useMessageStore();
      message.resetMessage();
      return await UsersDataService.getUserByID(guid).then((response) => {
        const { data = {} } = response || {};
        const {
          _id = null,
          roles = [],
          guid = "",
          username = "",
          firstname = "",
          lastname = "",
          email = "",
          createdAt = "",
          updatedAt = "",
        } = data || {};
        const updatedTS = new Date(updatedAt);
        const createdTS = new Date(createdAt);
        return {
          id: _id,
          roles: roles,
          guid: guid,
          username: username,
          firstname: firstname,
          lastname: lastname,
          email: email,
          created: createdTS,
          updated: updatedTS,
        };
      });
    },

    async getUsers() {
      this.users = await (await UsersDataService.getAllUsers()).data;
    },

    async updateUser(id, userData) {
      await UsersDataService.updateUser(id, userData);
    },

    async activateUser(guid) {
      const message = useMessageStore();
      message.setMessage({
        text: "Activating user...",
        type: "info",
        spinner: true,
      });
      return await UsersDataService.activate(guid).then(() =>
        message.resetMessage()
      );
    },

    async removeUser(guid) {
      const message = useMessageStore();
      message.setMessage({
        text: "Deleting user...",
        type: "info",
        spinner: true,
      });
      await UsersDataService.deleteUser(guid).then(() =>
        message.resetMessage()
      );
    },

    async refresh(accessToken) {
      this.user = { ...this.user, accessToken: accessToken };
    },

    setUser(user) {
      this.user = user;
    },

    clearUser() {
      this.$reset();
    },
  },
});
