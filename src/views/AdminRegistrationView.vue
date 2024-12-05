<script setup>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { ref } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import RegistrationList from "../components/RegistrationList.vue";
import { useSettingsStore } from "../stores/settings";
import NavMenu from "../components/common/NavMenu.vue";
const userStore = useAuthUserStore();
const financialStore = useFinancialStore();
const settingsStore = useSettingsStore();

const navItems = ref(settingsStore.get("navItems") || []);

const tableInfoDialog = ref(false);
const tableCountAll = () => {
  return String(financialStore.getTotalTableCount);
};

//PrimeDialog controls

const tableInfo = () => {
  tableInfoDialog.value = true;
};

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="All Registrations" subtitle="Manage PA Registrations" />
    <PrimeButton
      label="Table Count: "
      type="button"
      icon="pi pi-ticket"
      class="p-button-info"
      :badge="tableCountAll()"
      @click="tableInfo()"
      badgeClass="p-badge-danger"
    />

    <PrimeDialog
      v-model:visible="tableInfoDialog"
      header="Table Information"
      :modal="true"
      class="p-fluid"
      >Current approximate table count across all registrations:
      {{ tableCountAll() }}
    </PrimeDialog>
    <NavMenu :title="''" :menuitems="navItems" />
    <RegistrationList :adminView="true" :ministryView="false" />
  </main>
</template>
