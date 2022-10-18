<!-- Guest display table. -->
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
        class="p-datatable-sm guests-datatable"
        :value="guests"
        :exportFilename="
          registrationID ? `${registrationID} Guest List` : 'Guest List'
        "
        responsiveLayout="stack"
        :paginator="adminView"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="[
          'firstname',
          'lastname',
          'attendancetype',
          'accessibility',
          'dietary',
          'registration',
        ]"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template #header>
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
            <span v-if="adminView" class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                title="Search all by keyword."
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No guests found. </template>
        <template #loading> Loading guest data. Please wait. </template>
        <PrimeColumn
          v-if="userStore.getUser.role === 'super-administrator'"
          field="registration"
          header="Registration"
          key="registration"
          class="guid"
        >
          <template #body="{ data }">
            <router-link
              :to="`/admin/edit/${data.registration}`"
              class="registration-link"
              >{{ data.registration }}</router-link
            > </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by registration"
            /> </template
        ></PrimeColumn>
        <PrimeColumn
          field="organization"
          header="Organization"
          key="organization"
        >
          <template #body="{ data }">
            {{
              lookup("organizations", data.organization) || data.organization
            }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <DropDown
              v-model="filterModel.value"
              :options="organizationsFilter"
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
        <PrimeColumn field="firstname" header="First Name" key="firstname">
          <template #body="{ data }"> {{ data.firstname }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by First Name"
            /> </template
        ></PrimeColumn>
        <PrimeColumn field="lastname" header="Last Name" key="lastname">
          <template #body="{ data }"> {{ data.lastname }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Last Name"
            /> </template
        ></PrimeColumn>
        <PrimeColumn
          field="attendancetype"
          header="Attendance Type"
          key="attendancetype"
        >
          <template #body="{ data }">
            {{ lookup("attendancetypes", data.attendancetype) }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <DropDown
              v-model="filterModel.value"
              :options="attendancetypesFilter"
              optionLabel="text"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>
                    {{ lookup("attendancetypes", slotProps.value) }}
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>
                    {{ lookup("attendancetypes", slotProps.option) }}
                  </div>
                </div>
              </template>
            </DropDown>
          </template></PrimeColumn
        >
        <PrimeColumn
          field="accessibility"
          header="Accessibility Requirements"
          key="accessibility"
        >
          <template #body="{ data }">
            {{
              lookupLoop("accessibilityoptions", data.accessibility)
            }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <DropDown
              v-model="filterModel.value"
              :options="accessibilityFilter"
              optionLabel="text"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>
                    {{ lookup("accessibilityoptions", slotProps.value) }}
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>
                    {{ lookup("accessibilityoptions", slotProps.option) }}
                  </div>
                </div>
              </template>
            </DropDown>
          </template></PrimeColumn
        >
        <PrimeColumn
          field="dietary"
          header="Dietary Requirements"
          key="dietary"
        >
          <template #body="{ data }">
            {{ lookupLoop("dietaryoptions", data.dietary) }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <DropDown
              v-model="filterModel.value"
              :options="dietaryFilter"
              optionLabel="text"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>
                    {{ lookup("dietaryoptions", slotProps.value) }}
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>
                    {{ lookup("dietaryoptions", slotProps.option) }}
                  </div>
                </div>
              </template>
            </DropDown>
          </template></PrimeColumn
        >
        <PrimeColumn v-if="adminView" field="notes" header="Notes:" key="notes">
          <template #body="{ data }"> {{ data.notes }}</template></PrimeColumn
        >
        <PrimeColumn
          v-if="adminView"
          field="tabledetails.tablename"
          header="Table"
          key="tabledetails.tablename"
          dataType="boolean"
          filterField="assignedTable"
          sortable
        >
          <template #body="{ data }"
            ><span>
              <i
                :class="{
                  'true-icon': data.assignedTable,
                  'false-icon pi pi-times-circle': !data.assignedTable,
                }"
                style="font-size: 2rem"
              ></i
              ><br />
              <div v-if="data.assignedTable">
                <router-link :to="`/admin/table/${data.table}`">{{
                  data.tabledetails.tablename
                }}</router-link>
              </div>
              <div v-else>Pending</div></span
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
            }} </template
          ><template #filter="{ filterModel }">
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
            {{ formatTime(data.updatedAt) }} </template
          ><template #filter="{ filterModel }">
            <PrimeCalendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            /> </template
        ></PrimeColumn>
        <PrimeColumn
          v-if="
            (!isSubmitted() && settingsStore.getIsSalesOpen) ||
            adminView ||
            tableID
          "
          :exportable="false"
          style="min-width: 8rem"
          header="Options:"
        >
          <template #body="slotProps">
            <div class="options-buttons">
              <PrimeButton
                icon="pi pi-pencil"
                label="Edit"
                class="p-button-rounded p-button-success mr-2 edit-button"
                @click="editGuest(slotProps.data)"
              />
              <PrimeButton
                icon="pi pi-trash"
                :label="
                  slotProps.data.table || tableID
                    ? 'Remove from Table'
                    : 'Delete'
                "
                class="p-button-rounded p-button-warning delete-button"
                @click="confirmDeleteGuest(slotProps.data)"
              />
              <PrimeButton
                v-if="adminView && !registrationID"
                icon="pi pi-arrow-up-right"
                label="View"
                class="p-button-rounded p-button-info info-button"
                @click="
                  router.push(`/admin/edit/${slotProps.data.registration}`)
                "
              />
            </div>
          </template>
        </PrimeColumn>
      </DataTable>
    </div>
    <div>
      <PrimeDialog
        v-model:visible="guestDialog"
        :style="{ width: '50rem', margin: '5rem' }"
        header="Guest Details"
        :modal="true"
        class="p-fluid"
        @show="
          () =>
            (guest.organization =
              lookup('organizations', guest.organization) || guest.organization)
        "
      >
        <div class="dropdown">
          <label for="organization">Organization:</label>
          <AutoComplete
            v-bind:class="{ 'p-invalid': v$.organization.$error }"
            v-model="guest.organization"
            :dropdown="true"
            :suggestions="filteredOrganizations"
            @complete="searchOrganization($event)"
            placeholder="Select an organization or enter manually"
            optionLabel="text"
            field="text"
            modelValue="text"
          >
            <template #option="slotProps">
              <div>{{ slotProps.option.text }}</div>
            </template></AutoComplete
          >
          <small
            v-if="v$.organization.$error"
            class="p-error"
            id="organization-help"
            >Please select your organization.</small
          >
        </div>

        <div class="field-text">
          <label for="firstname">First Name</label>
          <InputText
            v-bind:class="{ 'p-invalid': v$.firstname.$error }"
            id="firstname"
            v-model.trim="guest.firstname"
            required="true"
            name="firstname"
            title="First Name"
            autofocus
          />
          <small v-if="v$.firstname.$error" class="p-error" id="firstname-help"
            >Please enter guest's first name.</small
          >
        </div>
        <div class="field-text">
          <label for="lastname">Last Name</label>
          <InputText
            v-bind:class="{ 'p-invalid': v$.lastname.$error }"
            id="lastname"
            v-model.trim="guest.lastname"
            required="true"
            name="lastname"
            title="Last Name"
            autofocus
          />
          <small v-if="v$.lastname.$error" class="p-error" id="lastname-help"
            >Please enter guest's last name.</small
          >
        </div>

        <div class="dropdown">
          <label for="attendancetype">Attendance Type:</label>
          <DropDown
            v-bind:class="{ 'p-invalid': v$.attendancetype.$error }"
            id="attendancetype"
            v-model="guest.attendancetype"
            :options="attendancetypes"
            optionLabel="text"
            optionValue="value"
            name="attendancetype"
            title="Attendance Type"
            placeholder="Select the type of attendance for this guest"
          />
          <small
            v-if="v$.attendancetype.$error"
            class="p-error"
            id="attendancetype-help"
            >Please select the attendance type for this guest.</small
          >
        </div>
        <label for="accessibility">Accessibility Requirements:</label>
        <div class="checkbox-group">
          <div
            v-for="each of accessibility"
            :key="each.key"
            name="accessibility"
            class="field-checkbox"
          >
            <CheckBox
              :id="each.key"
              name="accessibility"
              :value="each.value"
              v-model="guest.accessibility"
            />
            <label :for="each.key">{{ each.text }}</label>
          </div>
        </div>

        <label for="dietary">Dietary Requirements:</label>
        <div class="checkbox-group">
          <div
            v-for="each of dietary"
            :key="each.key"
            class="field-checkbox"
            name="dietary"
          >
            <CheckBox
              :id="each.key"
              name="dietary"
              :value="each.value"
              v-model="guest.dietary"
            />
            <label :for="each.key">{{ each.text }}</label>
          </div>
        </div>
        <div class="field-text" v-if="adminView">
          <label for="guest-notes">Notes:</label>
          <InputText
            id="lastname"
            v-model.trim="guest.notes"
            name="guestnotes"
            title="Notes"
            autofocus
          />
          <small class="p-error" id="guest-notes-help"
            >Notes field visible to admin only.</small
          >
        </div>

        <template #footer>
          <PrimeButton
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
          />
          <PrimeButton
            label="Save"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveGuest"
          />
        </template>
      </PrimeDialog>
      <PrimeDialog
        v-model:visible="deleteGuestDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="guest"
            >Are you sure you want to
            {{ !tableID && !guest.table ? "delete" : "remove" }}
            <b>{{ guest.firstname }} {{ guest.lastname }}</b
            >?</span
          >
        </div>
        <template #footer>
          <PrimeButton
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteGuestDialog = false"
          />
          <PrimeButton
            v-if="!tableID && !guest.table"
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteGuest"
          />

          <PrimeButton
            v-else
            icon="pi pi-trash"
            label="Remove from Table"
            class="p-button-rounded p-button-warning delete-button"
            @click="removeGuest(guest.table)"
          />
        </template>
      </PrimeDialog>
    </div>
  </div>
</template>

<script>
import formServices from "../services/settings.services";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "../stores/guests";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { useSettingsStore } from "../stores/settings";

import { useTablesStore } from "../stores/tables";
import tableRoutes from "../services/api-routes.tables.js";

import router from "../router";

export default {
  props: {
    adminView: Boolean,
    registrationID: String,
    tableID: String,
  },
  setup(props) {
    const guestStore = useGuestsStore();
    const settingsStore = useSettingsStore();
    const { guests } = storeToRefs(useGuestsStore());
    const tables = ref();

    const columns = ref(formServices.get("guestSelection") || []);
    const organizationsFilter = ref(
      (formServices.get("organizations") || []).map((each) => each.value)
    );
    const attendancetypesFilter = ref(
      (formServices.get("attendancetypes") || []).map((each) => each.value)
    );
    const accessibilityFilter = ref(
      (formServices.get("accessibilityoptions") || []).map((each) => each.value)
    );
    const dietaryFilter = ref(
      (formServices.get("dietaryoptions") || []).map((each) => each.value)
    );

    const organizations = ref(formServices.get("organizations") || []);
    const attendancetypes = ref(formServices.get("attendancetypes") || []);
    const accessibility = ref(formServices.get("accessibilityoptions") || []);
    const dietary = ref(formServices.get("dietaryoptions") || []);
    const filteredOrganizations = ref();

    const userStore = useAuthUserStore();
    const dt = ref();
    const loading = ref(false);
    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });
    const financialStore = useFinancialStore();
    const tableStore = useTablesStore();

    //filters organizations on drop-down
    const searchOrganization = (event) => {
      setTimeout(() => {
        if (!event.query.trim().length) {
          filteredOrganizations.value = organizations.value;
        } else {
          filteredOrganizations.value = organizations.value.filter(
            (organization) => {
              return organization.text
                .toLowerCase()
                .startsWith(event.query.toLowerCase());
            }
          );
        }
      }, 100);
    };

    //Conditionally Fill DataList
    const fillList = async function () {
      const user = userStore.getUser;
      guestStore.$reset;
      loading.value = true;
      try {
        tables.value = await (await tableRoutes.getAllTables()).data;
        await new Promise((resolve) => setTimeout(resolve, 1))
          .then(async () => {
            if (props.registrationID)
              return await guestStore.fillGuestsRegistration(
                props.registrationID
              );
            if (props.adminView) return await guestStore.fillGuests();
            if (props.tableID)
              return await guestStore.fillGuestsTable(props.tableID);
            else
              return (await guestStore.fillGuestsRegistration(user.guid))
                ? guestStore.fillGuestsRegistration(user.guid)
                : [];
          })
          .then(() => {
            guests.value.forEach((guest) => {
              guest.createdAt = new Date(guest.createdAt);
              guest.updatedAt = new Date(guest.updatedAt);
              guest.assignedTable = guest.table ? true : false;
              guest["tabledetails"] = tables.value.filter(
                (each) => each._id === guest.table
              )[0];
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

    const isSubmitted = function () {
      return financialStore.getRegistration.submitted;
    };

    //Sorting Filters for DataList

    const filters = ref(formServices.get("guestFilters") || {});
    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = formServices.get("guestFilters") || {};
    };

    //Helper Functions

    const exportCSV = () => {
      dt.value.value.map((each) => {
        const organization = {
          organization:
            lookup("organizations", each.organization) || each.organization,
        };
        const dietary = {
          dietary: lookupLoop("dietaryoptions", each.dietary),
        };
        const attendancetype = {
          attendancetype: lookup("attendancetypes", each.attendancetype),
        };
        const accessibility = {
          accessibility: lookupLoop("accessibilityoptions", each.accessibility),
        };
        each = Object.assign(
          each,
          organization,
          attendancetype,
          dietary,
          accessibility
        );
      });
      dt.value.exportCSV();
      loadLazyData();
    };

    const lookup = function (key, value) {
      return formServices.lookup(key, value);
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

    const lookupLoop = function (key, data) {
      let list = "";
      for (let each of data) {
        if (list && list.length > 0) {
          list += `\r\n${lookup(key, each)}`;
        } else {
          list = lookup(key, each);
        }
      }
      return list;
    };

    //PrimeDialog controls
    const guest = ref({});
    const rules = {
      organization: { required },
      firstname: { required },
      lastname: { required },
      attendancetype: { required },
    };
    const v$ = useVuelidate(rules, guest);
    const submitted = ref(false);
    const guestDialog = ref(false);
    const deleteGuestDialog = ref(false);

    const editGuest = (prod) => {
      guest.value = { ...prod };
      guestDialog.value = true;
    };
    const confirmDeleteGuest = (prod) => {
      guest.value = prod;
      deleteGuestDialog.value = true;
    };

    const hideDialog = () => {
      guestDialog.value = false;
      submitted.value = false;
    };

    const saveGuest = async function (event) {
      event.preventDefault();
      submitted.value = true;
      const isFormCorrect = await v$.value.$validate();
      if (!isFormCorrect) return;
      guest.value["organization"] =
        typeof guest.value["organization"] === "string"
          ? guest.value["organization"]
          : guest.value["organization"]["value"];

      guestStore
        .updateGuest(guest.value["_id"], guest.value)

        .then(() => {
          guestDialog.value = false;
          guest.value = {};
        })
        .then(fillList())
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          loadLazyData();
        });
    };

    const deleteGuest = async function () {
      loading.value = true;
      try {
        guestStore
          .deleteGuest(guest.value["_id"], guest.value["registration"])
          .then(fillList())
          .then(() => {
            loading.value = false;
            message.value = true;
            messageText.value = {
              severity: "success",
              text: "Successfully deleted guest.",
            };
          });
      } catch (error) {
        console.log(error);
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not delete guest.",
        };
      } finally {
        deleteGuestDialog.value = false;
        await new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
          message.value = false;
          fillList();
        });
      }
    };

    //removes guest from table rather than deleting
    const removeGuest = async function (guestTableID) {
      loading.value = true;
      await tableStore.fillOnlyTable(props.tableID || guestTableID);
      const { table } = storeToRefs(useTablesStore());
      const tablevalue = table.value;
      try {
        guestStore
          .removeGuestFromTable(guest.value["_id"], { table: null }, tablevalue)
          .then(fillList())
          .then(() => {
            loading.value = false;
            message.value = true;
            messageText.value = {
              severity: "success",
              text: "Successfully removed guest.",
            };
          });
      } catch (error) {
        console.log(error);
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not delete guest.",
        };
      } finally {
        deleteGuestDialog.value = false;
        await new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
          message.value = false;
          fillList();
        });
      }
    };
    return {
      columns,
      settingsStore,
      v$,
      dt,
      filters,
      loading,
      message,
      messageText,
      isSubmitted,
      exportCSV,
      clearFilters,
      organizationsFilter,
      attendancetypesFilter,
      accessibilityFilter,
      dietaryFilter,
      organizations,
      attendancetypes,
      accessibility,
      dietary,
      guests,
      guest,
      submitted,
      guestDialog,
      deleteGuestDialog,
      formatDate,
      formatTime,
      lookup,
      lookupLoop,
      editGuest,
      confirmDeleteGuest,
      deleteGuest,
      removeGuest,
      hideDialog,
      saveGuest,
      loadLazyData,
      router,
      userStore,
      filteredOrganizations,
      searchOrganization,
    };
  },
};
</script>

<style lang="scss" scoped>
.guests-datatable {
  white-space: pre;
  .p-datatable-sm tr td {
    font-size: 16px;
    padding: 0.3rem;
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
  .guid {
    line-break: anywhere;
  }
  .p-datatable-wrapper {
    tr {
      white-space: pre;
    }
  }
  .p-datatable-wrapper {
    line-height: 1rem;
  }

  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
