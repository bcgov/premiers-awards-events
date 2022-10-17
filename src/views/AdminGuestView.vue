<script setup>
import { useAuthUserStore } from "../stores/users";
import { useGuestsStore } from "../stores/guests";
import { ref } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import GuestList from "../components/GuestList.vue";
import formServices from "../services/settings.services";
import NavMenu from "../components/common/NavMenu.vue";
const userStore = useAuthUserStore();
const guestStore = useGuestsStore();

const navItems = ref(formServices.get("navItems") || []);

const guestInfoDialog = ref(false);
const guestCountAll = () => {
  return String(guestStore.getGuestsCount);
};

//PrimeDialog controls

const guestInfo = () => {
  guestInfoDialog.value = true;
};

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="All Guests" subtitle="Manage PA Guests" />
    <PrimeButton
      label="Guest Count"
      type="button"
      icon="pi pi-ticket"
      class="p-button-warning"
      :badge="guestCountAll()"
      @click="guestInfo()"
      badgeClass="p-badge-danger"
    />

    <PrimeDialog
      v-model:visible="guestInfoDialog"
      header="Total Count of Current Guests"
      :modal="true"
      class="p-fluid"
      >Current guest count across all registrations:
      {{ guestCountAll() }}
    </PrimeDialog>
    <NavMenu :title="''" :menuitems="navItems" />
    <GuestList :adminView="true" />
  </main>
</template>
