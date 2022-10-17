<!-- Registration Display table -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <div v-else>
      <DataTable
        class="p-datatable-sm"
        :value="registrations"
        responsiveLayout="stack"
        :key="dataTableRender"
        :paginator="adminView && !registrationID"
        :rows="10"
        ref="dt"
        stripedRows
        exportFilename="Registration List"
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
        <template v-if="adminView && !registrationID" #header>
          <div style="text-align: left" class="header-buttons">
            <PrimeButton
              icon="pi pi-external-link"
              label="Export"
              @click="exportCSV($event)"
            />
            <PrimeButton
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined"
              @click="clearFilters()"
            />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                title="Search all by keyword"
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No registrations found. </template>
        <template #loading> Loading registration data. Please wait. </template>
        <PrimeColumn
          v-if="adminView"
          field="_id"
          header="ID#"
          key="_id"
          class="_id"
        >
          <template #body="{ data }">
            <router-link :to="`/admin/edit/${data._id}`">{{
              data.registrar
            }}</router-link>
          </template></PrimeColumn
        >
        <PrimeColumn
          field="organization"
          filterField="organization"
          header="Organization"
          key="organization"
        >
          <template #body="{ data }">
            {{ lookup("organizations", data.organization) }}
          </template>
          <template #filter="{ filterModel }" v-if="adminView">
            <DropDown
              v-model="filterModel.value"
              :options="organizations"
              optionLabel="text"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>{{ lookup("organizations", slotProps.value) }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>{{ lookup("organizations", slotProps.option) }}</div>
                </div>
              </template>
            </DropDown>
          </template></PrimeColumn
        >
        <PrimeColumn
          v-for="col of filter(columns)"
          :field="col.field"
          :header="col.text"
          :key="col.field"
        >
          <template #filter="{ filterModel }" v-if="adminView">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              :placeholder="`Search by ${col.field}`"
            /> </template
        ></PrimeColumn>
        <PrimeColumn
          v-if="adminView && !registrationID"
          field="guestCount"
          dataType="numeric"
          header="Guest Count:"
          key="guestCount"
          :sortable="true"
        >
          <template #body="{ data }">
            <span>{{ data.guestCount }}</span>
          </template>
          <template #filter="{ filterModel }">
            <InputNumber
              v-model="filterModel.value"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              decrementButtonClass="p-button-danger"
              incrementButtonClass="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn :hidden="true" field="tables" header="Tables" key="tables">
        </PrimeColumn>
        <PrimeColumn
          v-if="adminView"
          field="submitted"
          header="Submitted?"
          key="submitted"
          dataType="boolean"
        >
          <template #body="{ data }"
            ><span>
              <i
                class="pi pi-check-circle"
                :class="{
                  'true-icon pi-check-circle': data.submitted,
                  'false-icon pi-times-circle': !data.submitted,
                }"
                style="font-size: 2rem"
              ></i
              ><br />{{ data.submitted ? " Submitted" : " Pending" }}</span
            >
          </template>
          <template #filter="{ filterModel }">
            <TriStateCheckbox v-model="filterModel.value" /> </template
        ></PrimeColumn>
        <PrimeColumn
          v-if="adminView"
          field="createdAt"
          header="Created:"
          key="createdAt"
          :sortable="true"
          dataType="date"
        >
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }},<br />{{
              formatTime(data.createdAt)
            }}
          </template>
          <template #filter="{ filterModel }">
            <PrimeCalendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            /> </template
        ></PrimeColumn>

        <PrimeColumn
          v-if="adminView"
          field="updatedAt"
          header="Updated:"
          key="updatedAt"
          :sortable="true"
          dataType="date"
        >
          <template #body="{ data }">
            {{ formatDate(data.updatedAt) }},<br />
            {{ formatTime(data.updatedAt) }}
          </template>
          <template #filter="{ filterModel }">
            <PrimeCalendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            /> </template
        ></PrimeColumn>
        <PrimeColumn
          v-if="(!isSubmitted() && settingsStore.getIsSalesOpen) || adminView"
          :exportable="false"
          style="min-width: 8rem"
          header="Options:"
        >
          <template #body="slotProps">
            <div class="options-buttons">
              <PrimeButton
                v-if="!slotProps.data.submitted"
                label="Edit"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2 edit-button"
                @click="editRegistration(slotProps.data)"
              />
              <PrimeButton
                v-if="
                  !slotProps.data.submitted &&
                  (!adminView || (adminView && registrationID))
                "
                icon="pi pi-trash"
                label="Delete"
                class="p-button-rounded p-button-warning delete-button"
                @click="confirmDeleteRegistration(slotProps.data)"
              />
              <PrimeButton
                v-if="adminView && !registrationID"
                icon="pi pi-arrow-up-right"
                label="View"
                class="p-button-rounded p-button-info info-button"
                @click="router.push(`/admin/edit/${slotProps.data.guid}`)"
              />
            </div>
          </template>
        </PrimeColumn>
      </DataTable>
    </div>
    <div>
      <PrimeDialog
        v-model:visible="registrationDialog"
        :style="{ width: '50rem', margin: '5rem' }"
        header="Registration Details"
        :modal="true"
        class="p-fluid registration-dialog"
        @hide="() => loadLazyData()"
        ><InputFinancial
          :registrationID="registration.guid"
          :adminView="adminView"
          :detailsView="detailsView"
      /></PrimeDialog>
      <PrimeDialog
        v-model:visible="deleteRegistrationDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <p v-if="guests.some((each) => each.tabledetails !== undefined)">
            <b
              >All guests must be unseated before this registration may be
              deleted.<br />Please remove all guests from their tables.</b
            >
          </p>
          <p v-else-if="registration">
            Are you sure you want to delete {{ registration.primarycontact }}'s
            registration?<br />
            This will delete all associated guests.<br /><b
              >This action cannot be undone.</b
            >
          </p>
        </div>
        <template #footer>
          <div v-if="guests.some((each) => each.tabledetails !== undefined)">
            <PrimeButton
              label="Okay"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteRegistrationDialog = false"
            />
          </div>
          <div v-else>
            <PrimeButton
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteRegistrationDialog = false"
            />
            <PrimeButton
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteRegistration"
            />
          </div>
        </template>
      </PrimeDialog>
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
import { useGuestsStore } from "../stores/guests";
import { useSettingsStore } from "../stores/settings";
import { useTablesStore } from "../stores/tables";
import router from "../router";

export default {
  props: {
    adminView: Boolean,
    detailsView: Boolean,
    registrationID: String,
  },
  setup(props) {
    const financialStore = useFinancialStore();
    const settingsStore = useSettingsStore();
    const { registrations } = storeToRefs(useFinancialStore());
    const { guests } = storeToRefs(useGuestsStore());
    const { tables } = storeToRefs(useTablesStore());
    const columns = ref(formServices.get("registrationSelection") || []);
    const organizations = ref(
      (formServices.get("organizations") || []).map((each) => each.value)
    );
    const dataTableRender = ref(0);
    const userStore = useAuthUserStore();
    const dt = ref();

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });

    //Define filters for table sorting and searching
    const filters = ref(formServices.get("registrationFilters") || {});
    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = formServices.get("registrationFilters") || {};
    };
    const filter = function (data) {
      return data.filter((item) => item.field !== "organization");
    };

    const loading = ref(false);

    //Fill registration table with appropriate data based on props
    const fillList = async function () {
      const user = userStore.getUser;
      financialStore.$reset;
      loading.value = true;
      try {
        if (props.registrationID) {
          return await financialStore.fill(props.registrationID);
        } else if (props.adminView) {
          return await financialStore.fillAllRegistrations();
        } else {
          return (await financialStore.fill(user.guid))
            ? financialStore.fill(user.guid)
            : [];
        }
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not fetch registrations.",
        };
      } finally {
        loading.value = false;
        setTimeout(() => (message.value = false), 1500);
      }
    };

    //Format data after load
    const loadLazyData = () => {
      fillList().then(() => {
        registrations.value.forEach((registration) => {
          registration.createdAt = new Date(registration.createdAt);
          registration.updatedAt = new Date(registration.updatedAt);
          registration.guestCount = Number(registration.guests.length);
        });
      });
    };

    onMounted(() => {
      loadLazyData();
    });

    //Helper Functions

    const isSubmitted = function () {
      return financialStore.getRegistration.submitted;
    };

    const lookup = function (key, value) {
      return formServices.lookup(key, value);
    };

    //Custom export loads guest and table data to inform tables on each registration on export only

    const exportCSV = async () => {
      await useTablesStore().fillTables();
      await useGuestsStore()
        .fillGuests()
        .then(() => {
          registrations.value.forEach((registration) => {
            registration.details = {};
            registration.status = 0;
            registration.guests.forEach((guest) => {
              registration.details[guest] = guests.value.filter(
                (each) => each._id === guest
              )[0];
              registration.details[guest]["tabledetails"] = tables.value.filter(
                (each) => each._id === registration.details[guest]["table"]
              )[0];
            });
          });
        })
        .then(() => {
          dt.value.value.map((each) => {
            const organization = {
              organization: lookup("organizations", each.organization),
            };
            const tableList = [];
            each.guests.forEach((guest) => {
              const guestDetails = guests.value.filter(
                (each) => each._id === guest
              );
              const tableDetails = guestDetails.map((each) =>
                each["tabledetails"] ? each["tabledetails"] : null
              );
              const tableNames = tableDetails.map((each) =>
                each ? each["tablename"] : null
              );
              tableNames[0] ? tableList.push(tableNames[0]) : null;
            });
            const finalTables = new Set(tableList);
            let tableString = "";
            finalTables.forEach((value) => (tableString += `${value} `));
            const tables = {
              tables: tableString,
            };
            each = Object.assign(each, organization, tables);
          });
        })
        .then(() => {
          dt.value.exportCSV();
        });
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

    const tableCount = function (data) {
      let tableCount = 0;
      if (data % 10 <= 5 && data % 10 != 0) tableCount += 0.5;
      if (data % 10 > 5) tableCount += 1;
      if (data / 10 >= 1) tableCount += Math.floor(data / 10);
      return tableCount;
    };

    //PrimeDialog Controls

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
      loading.value = true;
      try {
        financialStore
          .deleteRegistration(registration.value["_id"])
          .then(fillList())
          .then(() => {
            loading.value = false;
            message.value = true;
            messageText.value = {
              severity: "success",
              text: "Successfully deleted registration and all connected guests.",
            };
          });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not delete registration.",
        };
      } finally {
        deleteRegistrationDialog.value = false;

        await new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
          message.value = false;
          if (props.registrationID) router.push("/admin");
          else if (!props.adminView) router.push("/");
          else fillList();
        });
      }
    };

    return {
      columns,
      organizations,
      registrations,
      settingsStore,
      guests,
      registration,
      isSubmitted,
      submitted,
      registrationDialog,
      deleteRegistrationDialog,
      dataTableRender,
      filters,
      loading,
      message,
      messageText,
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
      router,
    };
  },
  components: { InputFinancial },
};
</script>

<style lang="scss">
.p-datatable {
  .p-button {
    margin-left: 1em;
    margin-right: 1em;
    .edit-button {
      margin: 2em;
    }
    .delete-button {
      margin: none;
    }
  }
  .header-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 1em;
  }
  .options-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25em;
  }

  .p-input-icon-left {
    margin-left: 1em;
    margin-right: 1em;
  }
}
</style>
