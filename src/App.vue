<script>
import { ref } from "vue";
import { useAuthUserStore } from "./stores/users";
import { useSettingsStore } from "./stores/settings";
import router from "./router";
import logoSrc from './assets/BCID_H_rgb_pos.png';

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

    const nodeENV = process.env.NODE_ENV;

    // Check if the URL contains the dev site url
    const currentUrl = window.location.href;
    const isDevSite =
      currentUrl.includes('https://pa-test-4015f5-test.apps.silver.devops.gov.bc.ca/events/') ||
      currentUrl.includes("localhost");

    const siteNav = ref([
      {
        icon: "pi pi-home",
        label: "Premier's Awards: Event Registration",
        command: () => {
          router.push('/');
        },
        class: "page-title"
      },
      {
        icon: "pi pi-external-link",
        label: "About",
        url: "https://premiersawards.gww.gov.bc.ca/",
        class: "about-option",
      },
      {
        icon: "pi pi-ticket",
        label: "My Registration",
        command: () => {
          router.push('/create/registration/');
        },
        visible: () => userStore.isRegistrar,
        class: "dropdown-account-item",
      },
      {
        label: () => userStore.isAdmin ? "Event Administration" : "Ministry Registrations",
        class: "dropdown-calendar",
        icon: "pi pi-calendar",
        items: [
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
        ],
      },
    ]);

    return { siteNav, username, menu, logoSrc, isDevSite, nodeENV };
  },
};
</script>

<template>

  <Toast position="bottom-right" />
  <Menubar class="navbar-fixed flex align-items-center gap-2" :model="siteNav">
    <template #start>
      <div id="titlenav">
        <img alt="Government of British Columbia" :src="logoSrc" height="60" class="mr-2">
      </div>
    </template>
  </Menubar>


  <RouterView />
  <div v-if="nodeENV === 'development' || isDevSite"
    className="testing-banner w-screen bg-orange-500 fixed top-0 m-0 text-center">
    Test Environment
  </div>
</template>

<style>
@import "primevue/resources/primevue.min.css";
@import "primevue/resources/themes/mdc-light-indigo/theme.css";
@import "primeicons/primeicons.css";
@import "/node_modules/primeflex/primeflex.css";

html {
  font-size: 12px;
}

main {
  padding-bottom: 300px;
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.p-menubar {
  background-color: #DDD !important;
}

.navbar-fixed {

  position: sticky;
  top: 0;
  z-index: 1100 !important;
  width: 100%;
  /* height: auto; */
}

@media screen and (max-width: 1115px) {
  .navbar-fixed {
    overflow: visible;
  }
}

.page-title {
  color: black !important;
  z-index: 1200 !important;
  display: inline-block;
  padding-top: 0.3125rem;
  padding-bottom: 0.3125rem;
  margin-right: 1rem;
  line-height: inherit;
  white-space: nowrap;
  text-decoration: none;
  background-color: transparent;
  font-weight: bold;
}

.dropdown-account {
  position: relative !important;
  z-index: 1200 !important;
  background-color: #3F51B5;
  border-radius: 4px;

  .p-menuitem-icon {
    color: white;
  }

  .p-menuitem-text {
    color: white;
  }

  .p-submenu-icon {
    color: white;
  }
}

.dropdown-account:hover {
  color: #343a40 !important;
  background-color: rgba(63, 81, 181, 0.92);
}

.p-submenu-list {
  right: 0px;
  z-index: 1200 !important;
}

.dropdown-account-item .p-menuitem-text {
  color: #343a40 !important;
  z-index: 1200 !important;
}

@media only screen and (min-width: 1115px) {
  .dropdown-account {
    position: absolute !important;
    right: 2vw;
  }
}

@media only screen and (max-width: 1115px) {
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

.testing-banner {
  z-index: 9999;
}
</style>
<style lang="scss">
@import "@/assets/base.css";
@import "@/assets/_theme.scss";
</style>