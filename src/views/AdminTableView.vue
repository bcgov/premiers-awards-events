<script setup>
import { useAuthUserStore } from "../stores/users";
import { useTablesStore } from "../stores/tables";
import { useMessageStore } from "../stores/messages";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import PageHeader from "../components/common/PageHeader.vue";
import NavMenu from "../components/common/NavMenu.vue";
import TableList from "../components/TableList.vue";
import formServices from "../services/settings.services";
import InputTable from "../components/inputs/InputTable.vue";

const userStore = useAuthUserStore();
const tableStore = useTablesStore();

const { message } = storeToRefs(useMessageStore());
const activeMessage = ref(false);

const navItems = ref(formServices.get("navItems") || []);

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
        class="p-button-warning"
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
    <NavMenu :title="''" :menuitems="navItems" />
    <TableList :data="tables" :key="keyCount" />
  </main>
</template>
<style lang="scss" scoped>
#table-management-buttons {
  display: flex;
  justify-content: space-between;
}
</style>
