<script setup>
import { useAuthUserStore } from "../stores/users";
import { useTablesStore } from "../stores/tables";
import { useMessageStore } from "../stores/messages";
import { useSettingsStore } from "../stores/settings";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import PageHeader from "../components/common/PageHeader.vue";
import NavMenu from "../components/common/NavMenu.vue";
import TableList from "../components/TableList.vue";
import InputTable from "../components/inputs/InputTable.vue";

const userStore = useAuthUserStore();
const tableStore = useTablesStore();
const settingsStore = useSettingsStore();

const { message } = storeToRefs(useMessageStore());
const activeMessage = ref(false);

const getNavItems = await settingsStore.get("navItems");
const navItems = ref(getNavItems || []);

const tableCountAll = () => {
  return String(tableStore.getTablesCount);
};

const { table, tables } = storeToRefs(useTablesStore());

const keyCount = ref(0);
const keyAdd = () => keyCount.value++;

//PrimeDialog controls

const tableInfoDialog = ref(false);
const addTableDialog = ref(false);

const tableInfo = () => {
  tableInfoDialog.value = true;
};

const addTable = () => {
  table.value = {};
  addTableDialog.value = true;
};

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="All Tables" subtitle="Manage PA Tables" />
    <PrimeMessage
      show
      v-if="activeMessage"
      :variant="message.type"
      :life="5000"
      :sticky="false"
    >
      <p>
        {{ message.text }}
      </p>
    </PrimeMessage>
    <div id="table-management-buttons">
      <PrimeButton
        label="Table Count: "
        type="button"
        icon="pi pi-ticket"
        class="p-button-info"
        :badge="tableCountAll()"
        @click="tableInfo()"
        badgeClass="p-badge-danger"
      />

      <PrimeButton
        label="Add New Table"
        type="button"
        icon="pi pi-plus-circle"
        class="p-button-success"
        @click="addTable()"
        badgeClass="p-badge-danger"
      />
    </div>

    <PrimeDialog
      v-model:visible="addTableDialog"
      header="Add New Table"
      :modal="true"
      class="p-fluid"
      @hide="keyAdd()"
      ><InputTable :adminView="true" />
    </PrimeDialog>

    <PrimeDialog
      v-model:visible="tableInfoDialog"
      header="Table Information"
      :modal="true"
      class="p-fluid"
      >Current approximate table count across all registrations:
      {{ tableCountAll() }}
    </PrimeDialog>
    <div v-if="navItems">
      <NavMenu :title="''" :menuitems="navItems" />
    </div>
    <Suspense>
      <TableList :data="tables" :key="keyCount" />
    </Suspense>
  </main>
</template>
<style lang="scss" scoped>
#table-management-buttons {
  display: flex;
  justify-content: space-between;
}
</style>
