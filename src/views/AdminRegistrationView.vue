<script setup>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { ref } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import RegistrationList from "../components/RegistrationList.vue";
import formServices from "../services/settings.services";
import NavMenu from "../components/common/NavMenu.vue";
const userStore = useAuthUserStore();
const financialStore = useFinancialStore();

const navItems = ref(formServices.get("navItems") || []);

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
      class="p-button-warning"
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
    <RegistrationList :adminView="true" />
  </main>
</template>
