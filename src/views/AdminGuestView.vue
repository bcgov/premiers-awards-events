<script setup>
import { useAuthUserStore } from "../stores/users";
import { useGuestsStore } from "../stores/guests";
import { ref, onMounted } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import GuestList from "../components/GuestList.vue";
import { useSettingsStore } from "../stores/settings";
import NavMenu from "../components/common/NavMenu.vue";
const userStore = useAuthUserStore();
const guestStore = useGuestsStore();
const settingsStore = useSettingsStore();

const navItems = ref([]);

const guestInfoDialog = ref(false);
const guestCountAll = () => {
  return String(guestStore.getGuestsCount);
};
onMounted(async () => {
  const getNavItems = await settingsStore.get("navItems");
  navItems.value = getNavItems;
});

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
      class="p-button-info"
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
    <div v-if="navItems">
      <NavMenu :title="''" :menuitems="navItems" />
    </div>
    <Suspense>
      <GuestList :adminView="true" />
    </Suspense>
  </main>
</template>
