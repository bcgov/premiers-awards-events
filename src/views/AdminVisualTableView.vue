<script setup>
import { useAuthUserStore } from "../stores/users";
import { useTablesStore } from "../stores/tables";
import { ref } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import NavMenu from "../components/common/NavMenu.vue";
import TableVisual from "../components/TableVisual.vue";
import formServices from "../services/settings.services";
import RegistrationVisual from "../components/RegistrationVisual.vue";

const userStore = useAuthUserStore();
const loading = ref(false)

const tableVisualLoaded = ref(false);
const tableVisualLoad = () => (tableVisualLoaded.value = true);

const navItems = ref(formServices.get("navItems") || []);

const tableCountAll = () => {
  return String(useTablesStore().getTablesCount);
};

//PrimeDialog controls

const tableInfoDialog = ref(false);

const tableInfo = () => {
  tableInfoDialog.value = true;
};

const helpDialog = ref(false);

const pageInfo = () => {
  helpDialog.value = true;
};

const keyCount = ref(0);
const keyAdd = () => keyCount.value++;

userStore.login();
</script>

<template>
  <main>
    <PageHeader title="Event Planning" subtitle="Visually Organize PA Event" />
    <ProgressSpinner v-if="loading" />
    <div v-else>
      <span class="flex gap-3 justify-content-between">
        <PrimeButton label="Table Count: " type="button" icon="pi pi-ticket" class="p-button-info"
          :badge="tableCountAll()" @click="tableInfo()" badgeClass="p-badge-danger" />
        <PrimeButton label="Help" type="button" icon="pi pi-question-circle" class="p-button-info"
          @click="pageInfo()" />
      </span>
      <NavMenu :title="''" :menuitems="navItems" />

      <TableVisual v-on:loadedTables="tableVisualLoad" :key="keyCount" />
      <h4>Registration Management - Bulk Seating: </h4>
      <RegistrationVisual v-if="tableVisualLoaded" v-on:addGuest="keyAdd" class="registrations-visual-box" />
      <PrimeDialog v-model:visible="helpDialog" :style="{ width: '900px' }" header="About Event Planner" :modal="true">
        <div class="help-content">
          This page is intended to assist event admin with visual event-planning. Admin can use this page to get a
          visual overview of the event, view tables and guests, and assign guests from registrations to tables using
          bulk seat registration tools. For a complete list of guests and their assigned tables and seats, review the
          <router-link :to="`/admin/guests`" class="guests-link">All Guests</router-link> admin management page.
          <h4>Visual Key:</h4>
          <div>
            <ul class="list-none table-icon-guide flex flex-column gap-2">
              <li class="flex align-items-center gap-3">
                <span><i class="pi pi-circle-fill full-table" /></span><span>{{ " " }}Full Table</span>
              </li>
              <li class="flex align-items-center gap-3">
                <span><i class="pi pi-circle-fill half-table" /></span><span>{{ " " }}Partially Filled Table</span>
              </li>
              <li class="flex align-items-center gap-3">
                <span><i class="pi pi-circle empty-table" /></span><span>{{ " " }}Empty Table</span>
              </li>
              <li class="flex align-items-center gap-3">
                <span><i class="pi pi-circle-fill full-table reserved-table" /></span><span><i
                    class="pi pi-circle-fill half-table reserved-table" /></span><span><i
                    class="pi pi-circle reserved-table" /></span><span>{{ " " }}Reserved Tables - A coloured
                  border indicates a table is categorized with a type of 'Reserved' rather than 'Standard'.</span>
              </li>
            </ul>
            <h4>Table Guide: </h4>
            <div class="line-height-4">
              <h5>Tables: </h5>
              Hover over the table name to preview the organizations represented by guests currently seated at the
              table.<br />
              Click on the table name to be directed to the editing page for the table.<br />
              <h5>Table Arrangement: </h5>
              Use the
              <PrimeButton :icon="`pi pi-table`" label="Arrange Tables" class="min-w-min w-auto" />
              button to toggle the ability to rearrange the layout of tables. Changes to the layout are saved between
              sessions and the current layout is visible to all admin (may require page refresh to note changes).
              <h5>Guests:</h5>
              Click on the users icon{{ " " }}<i class="pi pi-users" />{{ " " }}within a table to see a visual overview
              of
              the current guests seated at that table.<br />
              Hover over a guest to view their name.<br />
              Click on the user icon {{ " " }}<i class="pi pi-user" />{{ " " }}of any guest to be directed to their
              registration.<br />

            </div>
            <h4>Registration Management - Bulk Seating: </h4>
            <div class="line-height-4">
              This section allows users to assign guests from registrations to tables in bulk.<br />
              Guests can be viewed on the registration by clicking on the arrow icon <i class="pi pi-chevron-right" /> beside
              the registration.<br />
              Guests are displayed in the order they are requested to be seated within the registration. (Guests 1-10
              for table one, 11-20 for table 2, etc.)<br />
              The
              <PrimeButton icon="pi pi-pencil" label="Bulk Seat Registration"
                class="p-button-rounded p-button-success mr-2 edit-button" /> button will assign guests from a
              registration to a table, in the order they
              are entered in the registration.<br />
              Guests can be reassigned to other tables once assigned.<br />
              Seating order can be modified directly on the table edit page.
            </div>


          </div>


        </div>
      </PrimeDialog>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.registrations-visual-box {
  display: flex;
  justify-content: center;
}

.table-icon-guide {
  $fullColor: red;
  $emptyColor: green;
  $defaultColor: purple;
  $reservedColor: purple;
  $tableSize: 2rem;

  .full-table {
    color: $fullColor !important;
    font-size: $tableSize;
  }

  .half-table {
    background: -moz-linear-gradient(right, $fullColor 50%, $emptyColor 51%);
    background: -webkit-linear-gradient(right, $fullColor 50%, $emptyColor 51%);
    background: linear-gradient(to right, $fullColor 50%, $emptyColor 51%);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: $tableSize;
  }

  .empty-table {
    color: $emptyColor !important;
    font-size: $tableSize;
  }

  .reserved-table {
    font-size: $tableSize;
    border: 3px solid $reservedColor;
    border-radius: 50%;
    color: white;
  }
}
</style>
