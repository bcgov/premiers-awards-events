<script>
import { ref } from "vue";
import { useAuthUserStore } from "./stores/users";
import { useSettingsStore } from "./stores/settings";
import router from "./router";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const settingsStore = useSettingsStore();
    const user = userStore.getUser || null;
    const username = user.username;
    const menu = ref();
    const devMode = import.meta.env.DEV;

    settingsStore.fillSettings();
    userStore.login();

    const siteNav = ref([
      {
        label: "Home",
        command: () => {
          router.push('/');
        },
      },
      {
        label: "About",
        url: "https://premiersawards.gww.gov.bc.ca/",
        class: "about-option",
      },
      {
        label: () => userStore.getUser.username || "Account",
        class: "dropdown-account",
        icon: "pi pi-user",
        items: [
          {
            label: "Create Account",
            command: () => {
              router.push('/register/');
            },
            visible: () => !userStore.isAuthenticated || !userStore.isRegistrar,
            class: "dropdown-account-item",
          },
          {
            label: "My Registration",
            command: () => {
              router.push('/create/registration/');
            },
            visible: () => userStore.isRegistrar,
            class: "dropdown-account-item",
          },
          {
            label: "View Profile",
            command: () => {
              router.push('/user/update/');
            },
            visible: () => userStore.isRegistrar,
            class: "dropdown-account-item",
          },
          {
            label: "Manage Users Local",
            //url: "https://premiersawards.gww.gov.bc.ca/app/users",
            command: () => {
              router.push('/admin/user/list');
            },
            visible: () => userStore.isAdmin && devMode,
            class: "dropdown-account-item",
          },
          {
            label: "Manage Users",
            url: import.meta.env.PA_APPS_ADMIN_URL,
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Registrations",
            command: () => {
              router.push('/admin/');
            },
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View My Ministry Registrations",
            command: () => {
              router.push('/ministry-admin/');
            },
            visible: () => !userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Guests",
            command: () => {
              router.push('/admin/guests');
            },
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "View Tables",
            command: () => {
              router.push('/admin/tables');
            },
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "Event Planner",
            command: () => {
              router.push('/admin/tables/event/planning');
            },
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
          {
            label: "Event Settings",
            command: () => {
              router.push('/admin/settings');
            },
            visible: () => userStore.isAdmin,
            class: "dropdown-account-item",
          },
        ],
      },
    ]);

    return { siteNav, username, menu };
  },
};
</script>

<template>
  <header>
    <div>
      <MenuBar id="navbar" :model="siteNav">
        <template #start>
          <div id="titlenav">
            <router-link to="/" id="page-title"
              >Premier's Awards Event Registration
            </router-link>
          </div>
        </template>
      </MenuBar>
    </div>
  </header>

  <RouterView />
</template>

<style>
@import "primevue/resources/primevue.min.css";
@import "primeicons/primeicons.css";
@import "/node_modules/primeflex/primeflex.css";
@import "./assets/_theme.scss"; /* Originally from "primevue/resources/themes/md-light-indigo/theme.css" */

html {
  font-size: 12px;
}

main {
  margin-top: 4em;
  padding-bottom: 300px;
  margin-left: 2em;
  margin-right: 2em;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  margin: 0 auto;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  margin: -9px;
}

#navbar {
  color: white !important;
  background-color: #343a40;
  font-size: 1.3em;
  z-index: 9999 !important;
  width: 100%;
  justify-content: flex-start;
}

#navbar .p-menuitem-text {
  color: white !important;
}

#navbar .p-submenu-list {
  z-index: 9999 !important;
}

#navbar .p-submenu-list .p-menuitem-text {
  color: black !important;
}
#navbar .p-submenu-list .p-menuitem-link {
  font-size: 0.9em;
}

#page-title {
  color: white !important;
  z-index: 9999 !important;
  display: inline-block;
  padding-top: 0.3125rem;
  padding-bottom: 0.3125rem;
  margin-right: 1rem;
  font-size: 20px;
  line-height: inherit;
  white-space: nowrap;
  text-decoration: none;
  background-color: transparent;
}

.dropdown-account {
  position: absolute !important;
  right: 10px;
  z-index: 9999 !important;
  background-color: rgba(21, 162, 184, 0.92);
}

.dropdown-account:hover {
  color: #343a40 !important;
  background-color: rgba(21, 162, 184, 0.92);
}

.p-submenu-list {
  right: 0px;
  z-index: 9999 !important;
}

.dropdown-account-item .p-menuitem-text {
  color: #343a40 !important;
  z-index: 9999 !important;
}
@media only screen and (min-width: 960px) {
  #navbar {
    position: sticky !important;
    top: 0 !important;
  }
}

@media only screen and (max-width: 960px) {
  .about-option {
    display: none;
  }
  .p-menubar-button {
    position: absolute;
    right: 1vw;
  }
  .p-menubar-button i {
    color: white;
  }

  #page-title {
    font-size: 2vmax;
  }
}

@media only screen and (max-width: 440px) {
  main {
    margin-left: 0;
    margin-right: 0;
  }
}

.p-datatable-table {
  white-space: break-spaces !important;
}
</style>
