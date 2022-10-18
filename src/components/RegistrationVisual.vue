<!-- Nested layout of registrations with guests for use in the event-planning page  -->
<template>
  <div>
    <ProgressSpinner v-if="loading || multiloading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <div class="registrations-visual" v-else>
      <DataTable
        class="p-datatable-sm"
        exportFilename="Event List"
        :value="registrations"
        responsiveLayout="stack"
        breakpoint="780px"
        :key="dataTableRender"
        v-model:expandedRows="expandedRows"
        :rows="10"
        :paginator="true"
        ref="dt"
        stripedRows
        sortField="organization"
        :sortOrder="1"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['organization', 'guid']"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template #header>
          <div style="text-align: left">
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
          header="Guests"
          :expander="true"
          headerStyle="width: 3rem"
        />
        <PrimeColumn field="guid" header="ID#" key="guid" class="guid">
          <template #body="{ data }">
            <router-link :to="`/admin/edit/${data.guid}`">{{
              data.registrar
            }}</router-link>
          </template></PrimeColumn
        >
        <PrimeColumn
          field="organization"
          filterField="organization"
          header="Organization"
          key="organization"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ lookup("organizations", data.organization) }}
          </template>
          <template #filter="{ filterModel }">
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
          field="guestList"
          header="Guest List"
          key="guestList"
          filterField="guestList"
          sortable
        >
          <template #body="{ data }">
            {{ data.guests.length }}
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
        <PrimeColumn
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
          field="seated"
          header="All Guests Seated?"
          key="seated"
          filterField="allAssigned"
          dataType="boolean"
        >
          <template #body="{ data }"
            ><span>
              <i
                class="pi pi-check-circle"
                :class="{
                  'true-icon pi-check-circle':
                    data.status === data.guests.length,
                  'false-icon pi-times-circle':
                    data.status !== data.guests.length,
                }"
                style="font-size: 2rem"
              ></i
              ><br />
              {{ data.status }} of {{ data.guests.length }} Guests Seated</span
            >
          </template>
          <template #filter="{ filterModel }">
            <TriStateCheckbox v-model="filterModel.value" /> </template
        ></PrimeColumn>
        <PrimeColumn header="Options">
          <template #body="{ data }">
            <PrimeButton
              v-if="data.submitted"
              icon="pi pi-pencil"
              label="Bulk Seat Registration"
              class="p-button-rounded p-button-success mr-2 edit-button"
              @click="editRegistrationTable(data)"
            />
          </template>
        </PrimeColumn>
        <template #expansion="slotProps">
          <div class="orders-subtable">
            <h5>Guests for {{ slotProps.data.registrar }}</h5>
            <DataTable
              :value="Object.values(slotProps.data.details)"
              responsiveLayout="scroll"
            >
              <PrimeColumn field="organization" header="Organization" sortable>
                <template #body="{ data }">{{
                  lookup("organizations", data.organization)
                }}</template></PrimeColumn
              >

              <PrimeColumn field="name" header="Name">
                <template #body="{ data }"
                  >{{ data.firstname }} {{ data.lastname }}</template
                ></PrimeColumn
              >
              <PrimeColumn
                field="attendancetype"
                header="Attendee Type"
                sortable
              >
                <template #body="{ data }">{{
                  lookup("attendancetypes", data.attendancetype)
                }}</template>
              </PrimeColumn>
              <PrimeColumn
                field="accessibility"
                header="Accessibility Accomodations Required"
                sortable
              >
                <template #body="{ data }">
                  {{ lookupLoop("accessibilityoptions", data.accessibility) }}
                </template>
              </PrimeColumn>
              <PrimeColumn
                field="tabledetails.tablename"
                header="Seated?"
                sortable
              >
                <template #body="{ data }">
                  <router-link
                    v-if="data.table"
                    :to="`/admin/table/${data.table}`"
                    >{{ data.tabledetails.tablename }}</router-link
                  >
                  <span v-else>Pending</span>
                </template>
              </PrimeColumn>
              <PrimeColumn field="table" header="Edit Table">
                <template #body="{ data }">
                  <span v-if="slotProps.data.submitted === false"
                    >Must Submit Registration</span
                  >
                  <span v-else
                    ><PrimeButton
                      icon="pi pi-pencil"
                      :label="data.tabledetails ? 'Edit Table' : 'Add Table'"
                      class="p-button-rounded p-button-success mr-2 edit-button"
                      @click="editGuestTable(data)"
                  /></span>
                </template>
              </PrimeColumn>
              <PrimeDialog
                v-model:visible="tableDetailsDialog"
                :style="{ width: '50rem', margin: '5rem' }"
                header="Table Details"
                :modal="true"
                class="p-fluid registration-dialog"
              >
                <div class="dropdown">
                  <label for="table">Table</label>
                  <DropDown
                    v-bind:class="{ 'p-invalid': v$.table.$error }"
                    id="table"
                    v-model="guest.table"
                    :options="
                      tables.filter(
                        (each) => each.tablecapacity > each.guests.length
                      )
                    "
                    name="table"
                    optionLabel="tablename"
                    optionValue="_id"
                    placeholder="Select the table."
                  />
                  <small v-if="v$.table.$error" class="p-error" id="table-help"
                    >Please select the table.</small
                  >
                </div>
                <template #footer>
                  <PrimeButton
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="tableDetailsDialog = false"
                  />
                  <PrimeButton
                    label="Confirm Table"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="editTable"
                  /> </template
              ></PrimeDialog>
            </DataTable>
          </div>
        </template>
        <PrimeDialog
          v-model:visible="multiTableDialog"
          :style="{ width: '50rem', margin: '5rem' }"
          header="Table Details"
          :modal="true"
          class="p-fluid registration-dialog"
        >
          <div class="dropdown">
            <label for="table">Table</label>
            <DropDown
              v-bind:class="{ 'p-invalid': v$.table.$error }"
              id="table"
              v-model="registration.table"
              :options="
                tables.filter((each) => each.tablecapacity > each.guests.length)
              "
              name="table"
              optionLabel="tablename"
              optionValue="_id"
              placeholder="Select the table."
            />
            <small v-if="v$.table.$error" class="p-error" id="table-help"
              >Please select the table.</small
            >
          </div>
          <template #footer>
            <PrimeButton
              label="Cancel"
              icon="pi pi-times"
              class="p-button-text"
              @click="multiTableDialog = false"
            />
            <PrimeButton
              label="Confirm Table"
              icon="pi pi-check"
              class="p-button-text"
              @click="multiSeat(registration.table)"
            /> </template
        ></PrimeDialog>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import { useGuestsStore } from "../stores/guests";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import formServices from "../services/settings.services";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  emits: ["addGuest"],
  setup(props, { emit }) {
    const financialStore = useFinancialStore();
    const guestStore = useGuestsStore();
    const { registrations } = storeToRefs(useFinancialStore());
    const { guests } = storeToRefs(useGuestsStore());
    const { tables } = storeToRefs(useTablesStore());

    const dt = ref();
    const dataTableRender = ref(0);
    const expandedRows = ref([]);

    const columns = ref(formServices.get("tableSelection") || []);
    const organizations = ref(
      (formServices.get("organizations") || []).map((each) => each.value)
    );

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });
    const loading = ref(false);
    const multiloading = ref(false);

    //Fill tables with full registration and guest details
    const fillList = async function () {
      financialStore.$reset;
      guestStore.$reset;
      loading.value = true;
      try {
        await guestStore.fillGuests().then(async () => {
          await financialStore.fillAllRegistrations().then(() => {
            registrations.value.forEach((registration) => {
              registration.details = {};
              registration.status = 0;
              registration.guests.forEach((guest) => {
                registration.details[guest] = guests.value.filter(
                  (each) => each._id === guest
                )[0];
                registration.details[guest]["tabledetails"] =
                  tables.value.filter(
                    (each) => each._id === registration.details[guest]["table"]
                  )[0];

                registration.details[guest]["table"]
                  ? (registration.status += 1)
                  : null;
              });
              registration.allAssigned =
                registration.status >= registration.guests.length
                  ? true
                  : false;
              registration.guestList = registration.guests.length;
            });
          });
        });
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

    const loadLazyData = async function () {
      await fillList();
    };

    onMounted(() => {
      loadLazyData();
    });

    //Helper Functions

    const lookup = function (key, value) {
      return formServices.lookup(key, value);
    };

    const lookupLoop = function (key, data) {
      let list = "";
      for (let each of data) {
        if (list.length > 0) {
          list += `, ${lookup(key, each)}`;
        } else {
          list = lookup(key, each);
        }
      }
      return list;
    };

    const exportCSV = () => {
      dt.value.value.map(
        (each) =>
          (each.organization = lookup("organizations", each.organization))
      );
      dt.value.exportCSV();
    };

    //Define filters for table sorting and searching
    const filters = ref(formServices.get("registrationFilters") || {});
    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = formServices.get("registrationFilters") || {};
    };

    //Dialog Controls
    const tableDetailsDialog = ref(false);
    const multiTableDialog = ref(false);
    const guest = ref({});
    const registration = ref({});

    const editGuestTable = (prod) => {
      guest.value = { ...prod };
      tableDetailsDialog.value = true;
    };

    const editRegistrationTable = (prod) => {
      registration.value = { ...prod };
      // console.log(registration.value);
      multiTableDialog.value = true;
    };

    const hideDialog = () => {
      tableDetailsDialog.value = false;
      multiTableDialog.value = false;
    };

    //Vuelidate Form Rules
    const rules = {
      table: { required },
    };

    const v$ = useVuelidate(rules, guest);

    //Manages individual guest assignment to event tables

    const editTable = async () => {
      const isFormCorrect = await v$.value.$validate();
      if (!isFormCorrect) return;

      const tableGUID = guest.value.table;
      const guestID = guest.value._id;
      const tablevalue = { _id: tableGUID };
      try {
        loading.value = true;
        if (guest.value.tabledetails != null) {
          await guestStore.removeGuestFromTable(
            guestID,
            { table: null, organization: guest.value.organization },
            {
              _id: guest.value.tabledetails._id,
            }
          );
        }
        await guestStore
          .addGuestToTable(
            guestID,
            { table: tableGUID, organization: guest.value.organization },
            tablevalue
          )
          .then(() => {
            loading.value = false;
            message.value = true;
            messageText.value = {
              severity: "success",
              text: "Successfully updated guest and table.",
            };
          });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Guest and table could not be updated.",
        };
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1500))
          .then(() => {
            message.value = false;
            tableDetailsDialog.value = false;
            emit("addGuest");
          })
          .then(() => {
            loadLazyData();
          });
      }
    };

    //Loops individual guest assignment over a registration until the selected table is filled

    const multiSeat = async (data) => {
      const finalRegistration = registration.value.details;
      const guests = Object.keys(finalRegistration);
      const tablesList = tables.value.filter((each) => each["_id"] === data)[0];
      const tableCapacity =
        tablesList["tablecapacity"] - tablesList["guests"].length;

      try {
        multiloading.value = true;
        let guestCount = 0;
        for (let each of guests) {
          if (guestCount < tableCapacity) {
            guest.value = finalRegistration[each];
            guest.value["table"] = data;
            await editTable();
            guestCount++;
          }
        }
        multiloading.value = false;

        message.value = true;
        messageText.value = {
          severity: "success",
          text: "Successfully updated guests and table.",
        };
      } catch (error) {
        multiloading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Bulk guests and table could not be updated.",
        };
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1500))
          .then(() => {
            message.value = false;
            multiTableDialog.value = false;
            emit("addGuest");
          })
          .then(() => {
            loadLazyData();
          });
      }
    };

    return {
      fillList,
      dt,
      dataTableRender,
      expandedRows,
      lookup,
      lookupLoop,
      exportCSV,
      filters,
      clearFilters,
      initFilters,
      loadLazyData,
      registrations,
      guests,
      tables,
      organizations,
      message,
      loading,
      messageText,
      columns,
      tableDetailsDialog,
      guest,
      editGuestTable,
      hideDialog,
      v$,
      editTable,
      multiTableDialog,
      editRegistrationTable,
      registration,
      multiSeat,
      multiloading,
    };
  },
};
</script>
<style lang="scss">
.registrations-visual {
  display: flex;
  flex-direction: row;
  .registration-lists {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
}
</style>
>
