<script setup>
import { useAuthUserStore } from "../stores/users";
import { useGuestsStore } from "../stores/guests";
import { ref } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import GuestList from "../components/GuestList.vue";
import NavMenu from "../components/common/NavMenu.vue";
const userStore = useAuthUserStore();
const guestStore = useGuestsStore();

const navItems = [
  {
    label: "Registrations",
    to: "/admin",
  },
  {
    label: "Guests",
    to: "/admin/guests",
  },
];

const guestInfoDialog = ref(false);
const guestCountAll = () => {
  return String(guestStore.getGuestsCount);
};

//Dialog controls

const guestInfo = (prod) => {
  guestInfoDialog.value = true;
};

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="All Guests" subtitle="Manage PA Guests" />
    <Button
      label="Guest Count"
      type="button"
      icon="pi pi-ticket"
      class="p-button-warning"
      :badge="guestCountAll()"
      @click="guestInfo()"
      badgeClass="p-badge-danger"
    />

    <Dialog
      v-model:visible="guestInfoDialog"
      header="Total Count of Current Guests"
      :modal="true"
      class="p-fluid"
      >Current guest count across all registrations:
      {{ guestCountAll() }}
    </Dialog>
    <NavMenu :title="''" :menuitems="navItems" />
    <GuestList :adminView="true" />
  </main>
</template>
