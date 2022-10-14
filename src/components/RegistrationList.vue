<template>
  <div>
    <div>
      <DataTable
        class="p-datatable-sm"
        :value="registrations"
        responsiveLayout="stack"
        :key="dataTableRender"
        :paginator="adminView"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="[
          'organization',
          'branch',
          'primarycontact',
          'primaryemail',
          'financialcontact',
          'clientministry',
          'resp',
          'serviceline',
          'project',
          'guid',
        ]"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template v-if="adminView" #header>
          <div style="text-align: left">
            <Button
              icon="pi pi-external-link"
              label="Export"
              @click="exportCSV($event)"
            />
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined"
              @click="clearFilters()"
            />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No registrations found. </template>
        <template #loading> Loading registration data. Please wait. </template>
        <Column
          v-if="adminView"
          field="guid"
          header="ID#"
          key="guid"
          class="guid"
        >
          <template #body="{ data }">
            <router-link :to="`/admin/edit/${data.guid}`">{{
              data.registrar
            }}</router-link>
          </template></Column
        >
        <Column field="organization" header="Organization" key="organization">
          <template #body="{ data }">
            {{ lookup("organizations", data.organization) }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by organization"
            /> </template
        ></Column>
        <Column
          v-for="col of filter(columns)"
          :field="col.field"
          :header="col.text"
          :key="col.field"
        >
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              :placeholder="`Search by ${col.field}`"
            /> </template
        ></Column>
        <Column
          v-if="adminView"
          field="tables"
          header="Table Count:"
          key="tables"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ tableCount(data.guests.length) }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Number of Tables"
            /> </template
        ></Column>
        <Column
          v-if="adminView"
          field="submitted"
          header="Submitted?"
          key="submitted"
        >
          <template #body="{ data }">
            <i
              class="pi pi-check-circle"
              :class="{
                'true-icon pi-check-circle': data.submitted,
                'false-icon pi-times-circle': !data.submitted,
              }"
              style="font-size: 2rem"
            ></i>
          </template>
          <template #filter="{ filterModel }">
            <TriStateCheckbox v-model="filterModel.value" /> </template
        ></Column>
        <Column
          v-if="adminView"
          field="createdAt"
          header="Created:"
          key="createdAt"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }},<br />{{
              formatTime(data.createdAt)
            }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Date Created"
            /> </template
        ></Column>

        <Column
          v-if="adminView"
          field="updatedAt"
          header="Updated:"
          key="updatedAt"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatDate(data.updatedAt) }},<br />
            {{ formatTime(data.updatedAt) }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Date Updated"
            /> </template
        ></Column>
        <Column v-if="!detailsView" :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              v-if="!slotProps.data.submitted"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editRegistration(slotProps.data)"
            />
            <Button
              v-if="!slotProps.data.submitted"
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="confirmDeleteRegistration(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div>
      <Dialog
        v-model:visible="registrationDialog"
        :style="{ width: '450px' }"
        header="Registration Details"
        :modal="true"
        class="p-fluid"
        @hide="() => loadLazyData()"
        ><InputFinancial
          :registrationID="registration.guid"
          :adminView="adminView"
          :detailsView="detailsView"
      /></Dialog>
      <Dialog
        v-model:visible="deleteRegistrationDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="registration"
            >Are you sure you want to delete registration #
            <b>{{ registration.guid }}</b> for contact
            {{ registration.primarycontact }}? This will delete all associated
            guests.</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteRegistrationDialog = false"
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteRegistration"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
import formServices from "../services/settings.services";
import InputFinancial from "./inputs/InputFinancial.vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import router from "../router/index.js";

export default {
  props: {
    adminView: Boolean,
    detailsView: Boolean,
    registrationID: String,
  },
  setup(props) {
    const financialStore = useFinancialStore();
    const { registrations } = storeToRefs(useFinancialStore());
    const columns = ref(formServices.get("registrationSelection") || []);
    const organizations = ref(formServices.get("organizations") || []);
    const dataTableRender = ref(0);
    const userStore = useAuthUserStore();
    const detailsView = props.detailsView || false;
    const adminView = props.adminView || false;
    const registrationID = props.registrationID || null;
    const dt = ref();

    //Define filters for table sorting and searching
    const filters = ref(formServices.get("registrationFilters") || {});
    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = formServices.get("registrationFilters") || {};
    };

    const loading = ref(true);

    //Fill registration table with appropriate data based on props
    const fillList = async function () {
      const user = userStore.getUser;
      financialStore.$reset;
      loading.value = false;
      if (props.adminView) return await financialStore.fillAllRegistrations();
      if (props.registrationID)
        return await financialStore.fill(props.registrationID);
      else
        return (await financialStore.fill(user.guid))
          ? financialStore.fill(user.guid)
          : [];
    };

    const loadLazyData = () => {
      fillList();
    };

    onMounted(() => {
      loadLazyData();
    });

    const isSubmitted = function () {
      return financialStore.getRegistration.submitted;
    };

    //Helper Functions

    const lookup = function (key, value) {
      return formServices.lookup(key, value);
    };

    const exportCSV = () => {
      dt.value.exportCSV();
    };

    const formatDate = (value) => {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const formatTime = (value) => {
      const date = new Date(value);

      return date.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const filter = function (data) {
      return data.filter((item) => item.field !== "organization");
    };

    const tableCount = function (data) {
      let tableCount = 0;
      if (data % 10 <= 5 && data % 10 != 0) tableCount += 0.5;
      if (data % 10 > 5) tableCount += 1;
      if (data / 10 >= 1) tableCount += Math.floor(data / 10);
      return tableCount;
    };

    //Dialog Controls

    const registration = ref({});
    const submitted = ref(false);
    const registrationDialog = ref(false);
    const deleteRegistrationDialog = ref(false);

    const editRegistration = (prod) => {
      registration.value = { ...prod };
      registrationDialog.value = true;
    };
    const confirmDeleteRegistration = (prod) => {
      registration.value = prod;
      deleteRegistrationDialog.value = true;
    };

    const hideDialog = () => {
      registrationDialog.value = false;
      submitted.value = false;
    };

    //Registration Information Controls

    const deleteRegistration = async function () {
      financialStore
        .deleteRegistration(registration.value["_id"])

        .then(() => {})
        .then(fillList())
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          deleteRegistrationDialog.value = false;
          registration.value = {};
          loadLazyData();
          //Perform action in always
        });
    };

    return {
      columns,
      organizations,
      registrations,
      registration,
      isSubmitted,
      submitted,
      detailsView,
      adminView,
      registrationDialog,
      deleteRegistrationDialog,
      dataTableRender,
      filters,
      loading,
      dt,
      clearFilters,
      exportCSV,
      formatDate,
      formatTime,
      lookup,
      filter,
      editRegistration,
      confirmDeleteRegistration,
      deleteRegistration,
      hideDialog,
      loadLazyData,
      tableCount,
    };
  },
  components: { InputFinancial },
};
</script>
