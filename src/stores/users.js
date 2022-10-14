import { defineStore } from "pinia";
import { useMessageStore } from "./messages";
import UsersDataService from "../services/api-routes.users";

//update error setting/remove if not in use

export const useAuthUserStore = defineStore({
  // convert to a function
  id: "auth/user",
  state: () => {
    return {
      user: {
        guid: "",
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        role: "",
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
        !!this.user.role
      );
    },

    isRegistrar() {
      return (
        this.user.role === "registrar" ||
        this.user.role === "nominator" ||
        this.user.role === "administrator" ||
        this.user.role === "super-administrator"
      );
    },
    isAdmin() {
      return (
        this.user.role === "administrator" ||
        this.user.role === "super-administrator"
      );
    },
    isSuperAdmin() {
      return this.user.role === "super-administrator";
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
      console.log("this is logout");
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
          role = "",
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
          role: role,
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

    /*
    async getUsers() {
      const message = useMessageStore();
      message.resetMessage();
      return await UsersDataService.getAllUsers().then((response) => {
        const { data = [] } = response || {};
        return data.map((user) => {
          const {
            _id = null,
            role = "",
            guid = "",
            username = "",
            firstname = "",
            lastname = "",
            email = "",
            createdAt = "",
            updatedAt = "",
          } = user || {};
          const updatedTS = new Date(updatedAt);
          const createdTS = new Date(createdAt);
          return {
            id: _id,
            role: role,
            guid: guid,
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: email,
            created: createdTS,
            updated: updatedTS,
          };
        });
      });
    },
    */

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
      //   this.status.loggedIn = true;
      this.user = { ...this.user, accessToken: accessToken };
    },

    setUser(user) {
      this.user = user;
    },

    // easily reset state using `$reset`
    clearUser() {
      this.$reset();
    },
  },
});
