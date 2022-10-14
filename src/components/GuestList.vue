<template>
  <div>
    <div>
      <DataTable
        class="p-datatable-sm"
        :value="guests"
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
            <span v-if="adminView" class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No guests found. </template>
        <template #loading> Loading guest data. Please wait. </template>
        <Column
          v-if="adminView"
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
        ></Column>
        <Column field="organization" header="Organization" key="organization">
          <template #body="{ data }">
            {{ lookup("organizations", data.organization) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by organization"
            /> </template
        ></Column>
        <Column field="firstname" header="First Name" key="firstname">
          <template #body="{ data }"> {{ data.firstname }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by First Name"
            /> </template
        ></Column>
        <Column field="lastname" header="Last Name" key="lastname">
          <template #body="{ data }"> {{ data.lastname }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Last Name"
            /> </template
        ></Column>
        <Column
          field="attendancetype"
          header="Attendance Type"
          key="attendancetype"
        >
          <template #body="{ data }">
            {{ lookup("attendancetypes", data.attendancetype) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Attendance Type"
            /> </template
        ></Column>
        <Column
          field="accessibility"
          header="Accessibility Requirements"
          key="accessibility"
        >
          <template #body="{ data }">
            {{
              lookupLoop("accessibilityoptions", data.accessibility)
            }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Accessibility Options"
            /> </template
        ></Column>
        <Column field="dietary" header="Dietary Requirements" key="dietary">
          <template #body="{ data }">
            {{ lookupLoop("dietaryoptions", data.dietary) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Dietary Requirements"
            /> </template
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
            }} </template
          ><template #filter="{ filterModel }">
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
            {{ formatTime(data.updatedAt) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Date Updated"
            /> </template
        ></Column>
        <Column
          v-if="!isSubmitted() || adminView"
          :exportable="false"
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editGuest(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="confirmDeleteGuest(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div>
      <Dialog
        v-model:visible="guestDialog"
        :style="{ width: '450px' }"
        header="Guest Details"
        :modal="true"
        class="p-fluid"
      >
        <div class="dropdown">
          <label for="organization">Organization:</label>
          <Dropdown
            v-bind:class="{ 'p-invalid': v$.organization.$error }"
            id="organization"
            v-model="guest.organization"
            :options="organizations"
            optionLabel="text"
            optionValue="value"
            placeholder="Select a Organization"
          />
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
            autofocus
          />
          <small v-if="v$.lastname.$error" class="p-error" id="lastname-help"
            >Please enter guest's last name.</small
          >
        </div>

        <div class="dropdown">
          <label for="attendancetype">Attendance Type:</label>
          <Dropdown
            v-bind:class="{ 'p-invalid': v$.attendancetype.$error }"
            id="attendancetype"
            v-model="guest.attendancetype"
            :options="attendancetypes"
            optionLabel="text"
            optionValue="value"
            placeholder="Select the type of attendance for this guest"
          />
          <small
            v-if="v$.attendancetype.$error"
            class="p-error"
            id="attendancetype-help"
            >Please select the attendance type for this guest.</small
          >
        </div>

        <div class="checkbox-group">
          <label for="accessibility">Accessibility Requirements:</label>
          <div
            v-for="each of accessibility"
            :key="each.key"
            class="field-checkbox"
          >
            <Checkbox
              :id="each.key"
              name="each"
              :value="each.value"
              v-model="guest.accessibility"
            />
            <label :for="each.key">{{ each.text }}</label>
          </div>
        </div>

        <div class="checkbox-group">
          <label for="dietary">Dietary Requirements:</label>
          <div v-for="each of dietary" :key="each.key" class="field-checkbox">
            <Checkbox
              :id="each.key"
              name="each"
              :value="each.value"
              v-model="guest.dietary"
            />
            <label :for="each.key">{{ each.text }}</label>
          </div>
        </div>

        <template #footer>
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveGuest"
          />
        </template>
      </Dialog>
      <Dialog
        v-model:visible="deleteGuestDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="guest"
            >Are you sure you want to delete
            <b>{{ guest.firstname }} {{ guest.lastname }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteGuestDialog = false"
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteGuest"
          />
        </template>
      </Dialog>
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
import { FilterMatchMode, FilterOperator } from "primevue/api";

export default {
  props: {
    adminView: Boolean,
    registrationID: String,
  },
  setup(props) {
    const guestStore = useGuestsStore();
    const { guests } = storeToRefs(useGuestsStore());
    const columns = ref(formServices.get("guestSelection") || []);
    const organizations = ref(formServices.get("organizations") || []);
    const attendancetypes = ref(formServices.get("attendancetypes") || []);
    const accessibility = ref(formServices.get("accessibilityoptions") || []);
    const dietary = ref(formServices.get("dietaryoptions") || []);
    const userStore = useAuthUserStore();
    const dt = ref();
    const loading = ref(true);
    const { adminView, registrationID } = props;
    const financialStore = useFinancialStore();

    //Conditionally Fill DataList
    const fillList = function () {
      const user = userStore.getUser;
      guestStore.$reset;
      loading.value = false;
      if (adminView) return guestStore.fillGuests();
      if (registrationID)
        return guestStore.fillGuestsRegistration(registrationID);
      else
        return guestStore.fillGuestsRegistration(user.guid)
          ? guestStore.fillGuestsRegistration(user.guid)
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
      dt.value.exportCSV();
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
        if (list.length > 0) {
          list += `, ${lookup(key, each)}`;
        } else {
          list = lookup(key, each);
        }
      }
      return list;
    };

    //Dialog controls
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

      guestStore
        .updateGuest(guest.value["_id"], guest.value)

        .then(() => {
          guestDialog.value = false;
          guest.value = {};
        })
        .then(fillList())
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          loadLazyData();
        });
    };

    const deleteGuest = async function () {
      guestStore
        .deleteGuest(guest.value["_id"], guest.value["registration"])

        .then(() => {})
        .then(fillList())
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          deleteGuestDialog.value = false;
          guest.value = {};
          loadLazyData();
          //Perform action in always
        });
    };

    return {
      columns,
      v$,
      dt,
      filters,
      loading,
      isSubmitted,
      exportCSV,
      clearFilters,
      organizations,
      attendancetypes,
      accessibility,
      dietary,
      guests,
      guest,
      adminView,
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
      hideDialog,
      saveGuest,
      loadLazyData,
    };
  },
};
</script>

<style scoped>
.p-datatable-sm tr td {
  font-size: 16px;
  padding: 0.3rem;
}

.guid {
  line-break: anywhere;
}
.p-datatable-wrapper {
  line-height: 1rem;
}
</style>
