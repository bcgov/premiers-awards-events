<!-- Guest display table. -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}
    </PrimeMessage>
    <div v-else>
      <DataTable
        class="p-datatable-sm guests-datatable"
        :value="guests"
        :exportFilename="exportNameFunction()"
        responsiveLayout="stack"
        :paginator="adminView"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        @rowReorder="onRowReorder"
        filterDisplay="menu"
        :globalFilterFields="[
          'firstname',
          'lastname',
          'attendancetype',
          'supportingFinalist',
          'accessibility',
          'pronouns',
          'dietary',
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
              <FloatLabel>
                <InputText
                  id="keyword-search-guests"
                  v-model="filters['global'].value"
                />
                <label for="keyword-search-guests"
                  ><i class="pi pi-search" />{{ "  " }}Keyword Search</label
                >
              </FloatLabel>
            </span>
          </div>
        </template>
        <template #empty> No guests found. </template>
        <template #loading> Loading guest data. Please wait. </template>
        <!-- <PrimeColumn v-if="tableID && userStore.isAdmin" rowReorder headerStyle="width: 3rem"></PrimeColumn> -->
        <PrimeColumn
          v-if="
            currentUrl.includes('/admin/table/') ||
            currentUrl.includes('/admin/edit/') ||
            (currentUrl.includes('/registration/') &&
              !isSubmitted() &&
              settingsStore.getIsSalesOpen) ||
            userStore.getUser.roles.includes('super-administrator') ||
            userStore.getUser.roles.includes('administrator')
          "
          rowReorder
          headerStyle="width: 3rem"
        ></PrimeColumn>
        <PrimeColumn
          v-if="
            currentUrl.includes('/admin/table/') ||
            currentUrl.includes('/admin/guests')
          "
          headerStyle="width: 3rem"
          field="seat"
          header="Assigned Seat"
          key="seats"
          class="seats"
        >
          <template #body="{ data }">
            {{ data.seat || `N/A` }}
          </template>
        </PrimeColumn>

        <PrimeColumn
          v-if="
            currentUrl.includes('/admin/edit/') ||
            currentUrl.includes('/registration/')
          "
          headerStyle="width: 3rem"
          field="index"
          header="Seat Request"
          key="seats"
          class="seats"
        >
          <template #body="{ data }">
            {{
              !tableID && data.index ? `${Math.ceil(data.index / 10)} -` : null
            }}
            {{ data.index ? data.index % 10 || 10 : `N/A` }}
          </template>
        </PrimeColumn>

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
              >{{ data.registration._id }}</router-link
            > </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by registration"
            />
          </template>
        </PrimeColumn>
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
              @change="
                (event) => {
                  event.value !== event.originalEvent
                    ? (dropdownSelected = true)
                    : null;
                }
              "
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
            <InputText
              v-if="!dropdownSelected"
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Text"
            />
          </template>
          <template #filterfooter>
            <PrimeButton
              type="button"
              @click="
                () => {
                  dropdownSelected = false;
                }
              "
              >Reset Selector Options</PrimeButton
            >
          </template>
        </PrimeColumn>

        <PrimeColumn field="registrar" header="Registrar" key="registrar">
          <template #body="{ data }">
            {{ data.registration.primarycontact }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by First Name"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn field="firstname" header="First Name" key="firstname">
          <template #body="{ data }"> {{ data.firstname }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by First Name"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn field="lastname" header="Last Name" key="lastname">
          <template #body="{ data }"> {{ data.lastname }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Last Name"
            />
          </template>
        </PrimeColumn>
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
              optionLabel="label"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>{{ slotProps.value }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>{{ slotProps.option }}</div>
                </div>
              </template>
            </DropDown>
          </template>
        </PrimeColumn>
        <PrimeColumn field="pronouns" header="Pronouns" key="pronouns">
          <template #body="{ data }">
            <!-- {{ lookupLoop("pronounsoptions", data.pronouns) }} </template -->

            {{
              data.custompronouns
                ? [...data.pronouns, data.custompronouns].toString()
                : data.pronouns.toString()
            }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <DropDown
              v-model="filterModel.value"
              :options="pronounsFilter"
              optionLabel="label"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>
                    <!-- {{ lookup("pronounsoptions", slotProps.value) }} -->
                    {{ slotProps.value.toString() }}
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>{{ lookup("pronounsoptions", slotProps.option) }}</div>
                </div>
              </template>
            </DropDown>
          </template>
        </PrimeColumn>
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
              optionLabel="label"
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
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="supportingfinalist"
          header="Supporting Finalist"
          key="supportingfinalist"
        >
          <template #body="{ data }"> {{ data.supportingfinalist }} </template
          ><template #filter="{ filterModel }" v-if="adminView">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Supporting Finalist"
            />
          </template>
        </PrimeColumn>
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
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="notes"
          header="Notes:"
          key="notes"
          filterField="hasNotes"
        >
          <template #body="{ data }"> {{ data.notes }}</template>
          <template #filter="{ filterModel }" v-if="adminView">
            <TriStateCheckbox v-model="filterModel.value" /> Has Notes?
          </template>
        </PrimeColumn>
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
              <div v-else>Pending</div>
            </span>
          </template>
          <template #filter="{ filterModel }">
            <TriStateCheckbox v-model="filterModel.value" /> Assigned a Table?
          </template>
        </PrimeColumn>
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
            />
          </template>
        </PrimeColumn>
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
            />
          </template>
        </PrimeColumn>
        <PrimeColumn
          v-if="
            (!isSubmitted() && settingsStore.getIsSalesOpen) ||
            (adminView && !ministryView) ||
            (!isSubmitted() && ministryView && settingsStore.getIsSalesOpen) ||
            tableID
          "
          :exportable="false"
          style="min-width: 8rem"
          header="Options:"
        >
          <template #body="slotProps">
            <div class="p-buttonset">
              <PrimeButton
                icon="pi pi-pencil"
                label=""
                v-tooltip.top="'Edit'"
                class="p-button-rounded p-button-success m-0 p-0 edit-button"
                @click="editGuest(slotProps.data)"
              />
              <PrimeButton
                :icon="
                  slotProps.data.table || tableID
                    ? 'pi pi-eject'
                    : 'pi pi-trash'
                "
                v-tooltip.top="
                  slotProps.data.table || tableID
                    ? 'Remove from Table'
                    : 'Delete'
                "
                label=""
                class="p-button-rounded p-button-danger delete-button m-0 p-0"
                @click="confirmDeleteGuest(slotProps.data)"
              />
              <PrimeButton
                v-if="adminView && !registrationID"
                icon="pi pi-arrow-up-right"
                label=""
                v-tooltip.top="'View'"
                class="p-button-rounded p-button-info info-button m-0 p-0"
                @click="
                  router.push(`/admin/edit/${slotProps.data.registration._id}`)
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
            :disabled="guest.hasexternalorganization"
          >
            <template #option="slotProps">
              <div>{{ slotProps.option.label }}</div>
            </template>
          </AutoComplete>
          <small
            v-if="v$.organization.$error"
            class="p-error"
            id="organization-help"
            >Please select your organization.</small
          >
        </div>

        <div class="field-checkbox">
          <CheckBox
            name="hasexternalorganization"
            :binary="true"
            v-model="guest.hasexternalorganization"
            @change="guest.organization = ''"
          />
          <label for="hasexternalorganization"
            >Guest is from an external organization
          </label>
        </div>

        <div class="field-text" v-if="guest.hasexternalorganization">
          <label for="externalorganization"
            >Please enter external organization's name:</label
          >
          <InputText
            id="externalorganization"
            type="externalorganization"
            aria-describedby="xternalorganization-help"
            v-model.trim="guest.organization"
            placeholder="External organization name"
          />
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
        <label for="pronouns">Pronouns:</label>
        <div class="checkbox-group">
          <div
            v-for="each of pronouns"
            :key="each.key"
            name="pronouns"
            class="field-checkbox"
          >
            <CheckBox
              :id="each.key"
              name="pronouns"
              :value="each.key"
              v-model="guest.pronouns"
            />
            <label :for="each.key">{{ each.label }}</label>
          </div>
          <div class="field-checkbox">
            <CheckBox
              name="hascustompronouns"
              :binary="true"
              v-model="guest.hascustompronouns"
              @change="guest.custompronouns = ''"
            />
            <label :for="hascustompronouns">Other</label>
          </div>
        </div>

        <div class="field-text" v-if="guest.hascustompronouns">
          <label for="custompronouns">Please enter your pronouns:</label>
          <InputText
            id="custompronouns"
            type="custompronouns"
            aria-describedby="custompronouns-help"
            v-model="guest.custompronouns"
            placeholder="Custom pronouns"
          />
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
              :value="each.key"
              v-model="guest.accessibility"
            />
            <label :for="each.key">{{ each.label }}</label>
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
              :value="each.key"
              v-model="guest.dietary"
            />
            <label :for="each.key">{{ each.label }}</label>
          </div>
        </div>

        <div class="dropdown">
          <label for="supportingfinalist">Supporting Finalist:</label>
          <DropDown
            id="supportingfinalist"
            v-model="guest.supportingfinalist"
            :options="supportingfinalist"
            optionLabel="text"
            optionValue="value"
            name="supportingfinalist"
            title="Supporting Finalist"
            placeholder="Select the finalist guest is supporting:"
          />
          <!-- <small
            v-if="v$.attendancetype.$error"
            class="p-error"
            id="attendancetype-help"
            >Please select the attendance type for this guest.</small
          > -->
        </div>

        <div class="field-text">
          <label for="guest-notes">Notes:</label>
          <InputText
            id="guestnotes"
            v-model.trim="guest.notes"
            name="guestnotes"
            title="Notes"
            autofocus
          />
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
    ministryView: Boolean,
    registrationID: String,
    tableID: String,
  },
  async setup(props) {
    const guestStore = useGuestsStore();
    const settingsStore = useSettingsStore();
    await settingsStore.getAll();
    const { guests } = storeToRefs(useGuestsStore());
    const tables = ref();
    const dropdownSelected = ref(false);
    const currentUrl = window.location.href;

    //const columns = await settingsStore.get("guestSelection");
    const organizationsData = await settingsStore.get("organizations");
    const organizationsFilter = organizationsData.map((each) => each.key);

    const attendanceTypesData = await settingsStore.get("attendancetypes");
    const attendancetypesFilter = attendanceTypesData.map((each) => each.label);

    const accessibilityData = await settingsStore.get("accessibilityoptions");
    const accessibilityFilter = accessibilityData.map((each) => each.key);

    const pronounsData = await settingsStore.get("pronounsoptions");
    const pronounsFilter = pronounsData.map((each) => each.key);

    const supportingfinalistData = await settingsStore.get(
      "supportingfinalistoptions"
    );
    const supportingfinalistFilter = supportingfinalistData.map(
      (each) => each.value
    );

    const dietaryData = await settingsStore.get("dietaryoptions");
    const dietaryFilter = dietaryData.map((each) => each.value);

    const organizations = ref(organizationsData || {});

    const attendancetypes = await settingsStore.get("attendancetypes");
    const supportingfinalist = await settingsStore.get(
      "supportingfinalistoptions"
    );
    const accessibility = await settingsStore.lookup("accessibilityoptions");
    const pronouns = await settingsStore.get("pronounsoptions");
    const hascustompronouns = ref(false);
    const dietary = await settingsStore.get("dietaryoptions");
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
              return organization.label
                .toLowerCase()
                .startsWith(event.query.toLowerCase());
            }
          );
        }
      }, 100);
    };

    //Conditionally Fill DataList
    const fillList = async () => {
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
            guests.value.forEach((guest, index) => {
              guest.seat = currentUrl.includes("/admin/guests")
                ? guest.seat
                : ref(index + 1);
              currentUrl.includes("/admin/table/")
                ? guestStore.updateGuest(guest._id, guest)
                : null;
              guest.index = ref(guest.index || index + 1);
              guest.createdAt = new Date(guest.createdAt);
              guest.updatedAt = new Date(guest.updatedAt);
              guest.assignedTable = guest.table ? true : false;
              guest["hasNotes"] = guest.notes ? true : false;
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

    const loadLazyData = () => {
      fillList();
      initFilters();
    };

    // onMounted(() => {
    //   loadLazyData();
    // });

    const isSubmitted = function () {
      return financialStore.getRegistration.submitted;
    };

    //Sorting Filters for DataList
    const getFilters = await settingsStore.get("guestFilters");
    const filters = ref(getFilters || {});

    const initFilters = async () => {
      const getFilters = await settingsStore.get("guestFilters");
      filters.value = getFilters || {};
    };
    await initFilters();
    const clearFilters = () => {
      initFilters();
      dropdownSelected.value = false;
    };

    await loadLazyData();

    //Helper Functions

    const exportCSV = () => {
      const requestedSeat =
        currentUrl.includes("/admin/edit/") ||
        currentUrl.includes("/registration/");
      dt.value.value.map((each) => {
        const seat = {
          seat: requestedSeat
            ? each.index
              ? `${Math.ceil(each.index / 10)} - ${each.index % 10 || 10}`
              : null
            : each.seat
            ? `${each.seat % 10 || 10}`
            : null,
        };
        const index = {
          index: requestedSeat
            ? each.index
              ? `Table ${Math.ceil(each.index / 10)} - ${each.index % 10 || 10}`
              : null
            : each.seat
            ? `${each.seat % 10 || 10}`
            : null,
        };
        const organization = {
          organization:
            lookup("organizations", each.organization) || each.organization,
        };
        const registrar = {
          registrar: each.registration.primarycontact,
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
          seat,
          index,
          registrar,
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
      return settingsStore.lookup(key, value);
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
          .deleteGuest(guest.value["_id"], guest.value["registration"]._id)
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

    //Manage row reordering function
    const onRowReorder = (event) => {
      // Check if the URL contains the table editing page.

      const tableSeating = currentUrl.includes("/admin/table/");
      if (tableSeating) {
        const { table } = storeToRefs(useTablesStore());
        const tableID = table.value._id;
        guests.value = event.value;
        event.value.forEach((item, index) => {
          event.value[index] = { ...item, seat: ref(index + 1) }; // Updating reactive index key-value pair
        });
        const newTableData = { ...table.value, guests: event.value };
        tableStore.updateTable(tableID, newTableData).then(
          newTableData.guests.forEach((data) => {
            const newSeatData = data.seat._value;
            guestStore.updateGuest(data._id, { ...data, seat: newSeatData });
          })
        );
      } else {
        const { registration } = storeToRefs(useFinancialStore());
        const registrationID = registration.value._id;
        guests.value = event.value;
        event.value.forEach((item, index) => {
          event.value[index] = { ...item, index: ref(index + 1) }; // Updating reactive index key-value pair
        });
        const newRegistrationData = {
          ...registration.value,
          guests: event.value,
        };
        financialStore.registerFinancialInformation(
          newRegistrationData,
          registrationID
        );
      }
    };

    //  Export Information
    const currentDate = new Date().toISOString().split("T")[0];
    let exportName = `Guest List-${currentDate} - `;

    if (props.tableID) {
      async function getTableDetails() {
        await tableStore.fillOnlyTable(props.tableID);
        const exportTableName = tableStore.getTableName.toString();
        exportName += `Table ${exportTableName}`;
      }
      getTableDetails();
    } else if (props.registrationID) {
      async function getRegistrationDetails() {
        await financialStore.fillOnlyRegistration(props.registrationID);
        const exportRegistrar = financialStore.getRegistrar.toString();
        exportName += `${exportRegistrar} - ${props.registrationID}`;
      }
      getRegistrationDetails();
    } else {
      exportName += " All Guests";
    }

    const exportNameFunction = () => {
      return exportName;
    };

    return {
      //columns,
      useSettingsStore,
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
      pronounsFilter,
      supportingfinalistFilter,
      dietaryFilter,
      organizations,
      attendancetypes,
      accessibility,
      pronouns,
      hascustompronouns,
      supportingfinalist,
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
      dropdownSelected,
      settingsStore,
      onRowReorder,
      currentUrl,
      exportNameFunction,
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

  // .options-buttons {
  //   display: flex;
  //   flex-wrap: wrap;
  //   justify-content: center;
  //   gap: 0.25em;
  // }

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
