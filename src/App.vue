<script>
import { ref } from "vue";
import { useAuthUserStore } from "./stores/users";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const user = userStore.getUser || null;
    const username = user.username;
    const menu = ref();

    const siteNav = ref([
      {
        label: "Home",
        to: "/",
      },
      {
        label: "About",
        url: 'https://premiersawards.gww.gov.bc.ca',
      },
      {
        label: () => userStore.getUser.username || "Account",
        // label: username || "Account",
        class: "dropdown-account",
        icon: "pi pi-user",
        items: [
          {
            label: "Create Account",
            to: "/register/",
            visible: () => !userStore.isAuthenticated,
            class: "dropdown-account-item",
          },
          {
            label: "Login",
            to: "/login/",
            visible: () => !userStore.isAuthenticated,
            class: "dropdown-account-item",
          },
          {
            label: "My Registration",
            to: "/create/registration/",
            visible: () => userStore.isAuthenticated,
            class: "dropdown-account-item",
          },
          {
            label: "Update Profile",
            to: "/user/update/",
            visible: () => userStore.isAuthenticated,
            class: "dropdown-account-item",
          },
          {
            label: "Manage Users",
            to: "/admin/user/list",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Registrations",
            to: "/admin/",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Guests",
            to: "/admin/guests",
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
        ],
      },
    ]);

    userStore.login();

    return { siteNav, username, menu };
  },
};
</script>

<template>
  <header>
    <div>
      <Menubar id="navbar" :model="siteNav">
        <template #start>
          <router-link to="/" id="page-title"
            >Premier's Awards Event Registration
          </router-link>
        </template>
      </Menubar>
    </div>
  </header>

  <RouterView />
</template>

<style>
/* @import "@/assets/base.css"; */
@import "primevue/resources/primevue.min.css";
@import "primeicons/primeicons.css";
@import "/node_modules/primeflex/primeflex.css";

/* Theme Choices: */

@import "primevue/resources/themes/nova/theme.css";

/* @import "primevue/resources/themes/nova-alt/theme.css"; */

/* @import "primevue/resources/themes/nova-accent/theme.css"; */

/* @import "primevue/resources/themes/nova-vue/theme.css"; */

/* @import "primevue/resources/themes/rhea/theme.css"; */

/* @import "primevue/resources/themes/lara-light-teal/theme.css"; */
html {
  font-size: 16px;
}

main {
  margin-top: 80px;
  padding-bottom: 300px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  /* max-width: 1280px; */
  margin: 0 auto;
  /* padding: 2rem; */
}

header {
  line-height: 1.5;
  max-height: 100vh;
  margin: -9px;
}

#navbar {
  position: sticky;
  color: white !important;
  background-color: #343a40;
  top: 0;
}

#page-title {
  color: white !important;
  z-index: 9999 !important;
  display: inline-block;
  padding-top: 0.3125rem;
  padding-bottom: 0.3125rem;
  margin-right: 1rem;
  font-size: 1.25rem;
  line-height: inherit;
  white-space: nowrap;
  text-decoration: none;
  background-color: transparent;
}

.p-menuitem-text {
  color: white !important;
}

.dropdown-account {
  position: absolute !important;
  right: 10px;
  z-index: 9999 !important;
  background-color: #116fbf;
}

.dropdown-account:hover {
  color: #343a40 !important;
  background-color: #116fbf;
}

.p-submenu-list {
  right: 0px;
  z-index: 9999 !important;
}

.dropdown-account-item .p-menuitem-text {
  color: #343a40 !important;
  z-index: 9999 !important;
}
</style>
