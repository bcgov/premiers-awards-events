import { defineStore } from "pinia";

export const useMessageStore = defineStore({
  id: "messageStore",
  state: () => {
    return {
      message: {
        text: "",
        type: "",
        spinner: false,
      },
    };
  },

  getters: {
    getMessage() {
      return this.message;
    },
  },
  actions: {
    setMessage(newValue) {
      //   console.log(newValue, "this is newvalue");
      const { text = "", type = "", spinner = false } = newValue || {};
      this.message = { text: text, type: type, spinner: spinner };
    },
    resetMessage() {
      this.$reset();
    },
  },
});
