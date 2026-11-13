<script setup>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import { useGuestsStore } from "../stores/guests";
import { useMessageStore } from "../stores/messages";
import { useSettingsStore } from "../stores/settings";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import PageHeader from "../components/common/PageHeader.vue";

const userStore = useAuthUserStore();
const financialStore = useFinancialStore();
const guestStore = useGuestsStore();
const settingsStore = useSettingsStore();
const fullTableReset = ref(false);
const tableAssignment = ref(false);
const fullDatabaseReset = ref(false);
const defaultLayoutGenerated = ref(false);

const tableStore = useTablesStore();
const messageStore = useMessageStore();
const { message } = storeToRefs(useMessageStore());
const { settings } = storeToRefs(useSettingsStore());
const activeMessage = ref(false);

const dateRules = {
  year: { required },
  salesopen: { required },
  salesclose: { required },
};
console.log(settings);

const v$ = useVuelidate(
  dateRules,
  settingsStore.lookup("globalSettings", undefined, true)
);

const toggleMessage = () => {
  activeMessage.value = false;
};

//Date management update
const updateEventDates = async function (event) {
  event.preventDefault();
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  try {
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Updating Dates...",
      type: "info",
      spinner: true,
    });
    settingsStore.selected.value.year = year.value;
    settingsStore.selected.value.salesopen = salesopen.value;
    settingsStore.selected.value.salesclose = salesclose.value;
    settingsStore.update().then(() => {
      messageStore.setMessage({
        text: "Successfully Updated Dates!",
        type: "success",
      });
    });
  } catch (error) {
    console.error(error);
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Dates could not be updated.",
      type: "error",
    });
  } finally {
    setTimeout(() => (activeMessage.value = false), 1500);
  }
};

//Table Management Functions - Generate and Fill the default layout
const fillTables = async () => {
  try {
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Algorithmically filling tables...",
      type: "info",
      spinner: true,
    });
    // handle data submission
    financialStore.$reset;
    tableStore.$reset;
    guestStore.$reset;
    await tableStore
      .fillTables()
      .then(async () => {
        await tableStore.fillEventTables();
      })
      .then(() => {
        messageStore.setMessage({
          text: "Successfully filled tables!",
          type: "success",
        });
      })
      .then(() => (defaultLayoutGenerated.value = false));
  } catch (error) {
    console.error(error);
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Tables could not be filled automatically.",
      type: "error",
    });
  }
};

const generateDefaultTables = async () => {
  try {
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Generating required tables...",
      type: "info",
      spinner: true,
    });
    // handle data submission
    await tableStore
      .generateNewEventTables()
      .then(() => {
        messageStore.setMessage({
          text: "Successfully generated tables!",
          type: "success",
        });
      })
      .then(() => (defaultLayoutGenerated.value = true));
  } catch (error) {
    console.error(error);
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Tables could not be generated.",
      type: "error",
    });
  }
};

//Database Reset
const resetDatabase = async () => {
  try {
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Wiping Database...",
      type: "info",
      spinner: true,
    });
    // handle data submission
    await tableStore.deleteAll().then(() => {
      messageStore.setMessage({
        text: "Successfully deleted registration, guest and table data!",
        type: "success",
      });
    });
  } catch (error) {
    console.error(error);
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Data could not be deleted.",
      type: "error",
    });
  }
};

//Dialog Controls
const resetDialog = ref(false);
const fillDialog = ref(false);
const databaseResetDialog = ref(false);

const resetConfirmation = () => {
  resetDialog.value = true;
};

const fillConfirmation = () => {
  fillDialog.value = true;
};

const resetDatabaseConfirmation = () => {
  databaseResetDialog.value = true;
};
const year = ref();
const salesopen = ref();
const salesclose = ref();
const organizations = ref([]);
const expandedTableOrganizations = ref([]);
const newExpandedOrganization = ref(null);
const newExpandedTableCount = ref(1);
const isSavingExpandedTables = ref(false);

const availableExpandedOrganizations = computed(() =>
  organizations.value.filter(
    (organization) =>
      !expandedTableOrganizations.value.some(
        (expandedOrganization) => expandedOrganization.key === organization.key
      )
  )
);

userStore.login();
settingsStore.getAll().then(() => {
  const configuredOrganizations = settingsStore.lookup("organizations");
  organizations.value = Array.isArray(configuredOrganizations)
    ? configuredOrganizations
    : [];
  expandedTableOrganizations.value = organizations.value
    .filter(
      (organization) =>
        Number.isInteger(organization.expandedTables) &&
        organization.expandedTables > 0
    )
    .map((organization) => ({
      key: organization.key,
      label: organization.label,
      count: organization.expandedTables,
    }));

  const globalSettings = settingsStore.lookup(
    "globalSettings",
    undefined,
    true
  );
  settingsStore.select("globalSettings");
  year.value = globalSettings.year;
  salesopen.value = new Date(globalSettings.salesopen);
  salesclose.value = new Date(globalSettings.salesclose);
});

const addExpandedTableOrganization = () => {
  if (
    !newExpandedOrganization.value ||
    !Number.isInteger(newExpandedTableCount.value) ||
    newExpandedTableCount.value < 1
  ) {
    return;
  }

  const organization = organizations.value.find(
    (item) => item.key === newExpandedOrganization.value
  );
  if (!organization) return;

  expandedTableOrganizations.value.push({
    key: organization.key,
    label: organization.label,
    count: newExpandedTableCount.value,
  });
  newExpandedOrganization.value = null;
  newExpandedTableCount.value = 1;
};

const saveExpandedTableOrganizations = async () => {
  try {
    isSavingExpandedTables.value = true;
    activeMessage.value = true;
    messageStore.setMessage({
      text: "Saving expanded table settings...",
      type: "info",
      spinner: true,
    });

    if (!(await settingsStore.select("organizations"))) {
      throw (
        settingsStore.error ||
        new Error("Organization settings could not be loaded.")
      );
    }

    if (
      expandedTableOrganizations.value.some(
        ({ count }) => !Number.isInteger(count) || count < 1
      )
    ) {
      throw new Error("Each organization must have a positive whole number of tables.");
    }

    const expandedCounts = new Map(
      expandedTableOrganizations.value.map(({ key, count }) => [key, count])
    );
    settingsStore.selected.value = organizations.value.map((organization) => {
      const count = expandedCounts.get(organization.key);
      if (count !== undefined) return { ...organization, expandedTables: count };
      const unchangedOrganization = { ...organization };
      delete unchangedOrganization.expandedTables;
      return unchangedOrganization;
    });

    await settingsStore.update();
    if (settingsStore.error) throw settingsStore.error;

    organizations.value = settingsStore.selected.value;
    messageStore.setMessage({
      text: "Expanded table settings were saved.",
      type: "success",
    });
  } catch (error) {
    console.error(error);
    messageStore.setMessage({
      text: "Expanded table settings could not be saved.",
      type: "error",
    });
  } finally {
    isSavingExpandedTables.value = false;
    setTimeout(() => (activeMessage.value = false), 1500);
  }
};
</script>

<template>
  <main>
    <PageHeader title="Event Settings" subtitle="Update PA Event Details" />
    <div id="siteSettings">
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
      <PrimeCard id="eventDateSettings">
        <template #subtitle>
          <h1>Table Settings</h1>
        </template>
        <template #content>
          <h3>
            Use these settings to:<br />
            (1) Reset and generate a new table layout.
            <br />
            (2) Fill tables based on a sorting algorithm.
          </h3>
          <ol>
            <li>
              <PrimeButton
                label="Reset All Tables and Generate Default Layout"
                type="button"
                icon="pi pi-ticket"
                class="p-button"
                @click="resetConfirmation()"
              />
            </li>
            <li>
              <PrimeButton
                :disabled="!defaultLayoutGenerated"
                id="fill-tables-button"
                label="Fill Tables"
                type="button"
                icon="pi pi-ticket"
                class="p-button"
                @click="fillConfirmation()"
              />
              <small
                v-if="!defaultLayoutGenerated"
                class="p-error"
                id="fill-tables-button-help"
                >Fill Tables option only available after a reset.</small
              >
            </li>
          </ol>
        </template>
      </PrimeCard>
      <PrimeCard id="expandedTableSettings" v-if="userStore.isAdmin">
        <template #subtitle>
          <h1>Expanded Table Settings</h1>
        </template>
        <template #content>
          <p>
            Choose organizations that may select tables of 11 during
            registration. Their remaining tables will use the standard size of
            10. These settings affect registration seat requests but do not
            change table creation.
          </p>
          <div class="expanded-table-form">
            <div class="expanded-table-add-row">
              <label for="expanded-table-organization">Organization:</label>
              <DropDown
                id="expanded-table-organization"
                v-model="newExpandedOrganization"
                :options="availableExpandedOrganizations"
                optionLabel="label"
                optionValue="key"
                placeholder="Select an organization"
              />
              <label for="expanded-table-count">Number of tables of 11:</label>
              <InputNumber
                id="expanded-table-count"
                v-model="newExpandedTableCount"
                :min="1"
                :maxFractionDigits="0"
                :useGrouping="false"
                :allowEmpty="false"
              />
              <PrimeButton
                type="button"
                label="Add Organization"
                icon="pi pi-plus"
                :disabled="
                  !newExpandedOrganization || availableExpandedOrganizations.length === 0
                "
                @click="addExpandedTableOrganization"
              />
            </div>
            <p v-if="expandedTableOrganizations.length === 0">
              No organizations have been added.
            </p>
            <div
              v-for="(organization, index) in expandedTableOrganizations"
              :key="organization.key"
              class="expanded-table-organization-row"
            >
              <span>{{ organization.label }}</span>
              <label :for="`expanded-table-count-${index}`">
                Number of tables of 11:
              </label>
              <InputNumber
                :id="`expanded-table-count-${index}`"
                v-model="organization.count"
                :min="1"
                :maxFractionDigits="0"
                :useGrouping="false"
                :allowEmpty="false"
              />
              <PrimeButton
                type="button"
                label="Remove"
                icon="pi pi-trash"
                class="p-button-danger"
                :aria-label="`Remove ${organization.label}`"
                @click="expandedTableOrganizations.splice(index, 1)"
              />
            </div>
            <PrimeButton
              type="button"
              label="Save Expanded Table Settings"
              icon="pi pi-save"
              :disabled="isSavingExpandedTables"
              @click="saveExpandedTableOrganizations"
            />
          </div>
        </template>
      </PrimeCard>
      <PrimeCard id="eventDateSettings" v-if="userStore.isAdmin">
        <template #subtitle>
          <h1>Event Date Settings</h1>
        </template>
        <template #content
          ><h3>Update application dates.</h3>
          <form class="event-dates-form" @submit="updateEventDates">
            <div class="text-field">
              <label for="event-year">Current Event Year:</label>
              <InputNumber
                id="event-year"
                type="event-year"
                :useGrouping="false"
                :min="2022"
                :max="2100"
                :allowEmpty="false"
                aria-describedby="event-year-help"
                v-model="year"
                placeholder="Current Event Year"
              />
              <small v-if="v$.year.$error" class="p-error" id="event-year-help"
                >Please select the event year.</small
              >
            </div>
            <div class="date-field">
              <label for="salesopen">Sales Open Date:</label>
              <PrimeCalendar
                id="salesopen"
                v-model="salesopen"
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                :showTime="true"
                :showSeconds="true"
                hourFormat="12"
                aria-describedby="salesopen-help"
              />
              <small
                v-if="v$.salesopen.$error"
                class="p-error"
                id="salesopen-help"
                >Please select the date and time for table sales to open to
                public.</small
              >
            </div>
            <div class="date-field">
              <label for="salesclose">Sales Close Date:</label>
              <PrimeCalendar
                id="salesclose"
                v-model="salesclose"
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                :showTime="true"
                :showSeconds="true"
                hourFormat="12"
                aria-describedby="salesclose-help"
              />
              <small
                v-if="v$.salesclose.$error"
                class="p-error"
                id="salesclose-help"
                >Please select the date and time for table sales to close to
                public.</small
              >
            </div>
            <PrimeButton type="submit" label="primary" class="p-button-raised"
              >Update Event Dates</PrimeButton
            >
          </form></template
        >
      </PrimeCard>
      <PrimeCard id="totalResetSettings" v-if="userStore.isSuperAdmin">
        <template #subtitle>
          <h1>Database Reset</h1>
        </template>
        <template #content
          ><h3>
            Reset database by deleting all current:<br />
            (1) Reservations,<br />
            (2) Guests, and<br />
            (3) Tables.<br />
            Users should be manually managed.
          </h3>
          <PrimeButton
            label="Reset Everything"
            type="button"
            icon="pi pi-exclamation-circle"
            class="p-button-danger"
            @click="resetDatabaseConfirmation()"
        /></template>
      </PrimeCard>
    </div>

    <PrimeDialog
      v-model:visible="resetDialog"
      header="Confirm Reset"
      :modal="true"
      class="p-fluid"
      @hide="toggleMessage()"
    >
      <div v-if="!activeMessage">
        <p>
          This will reset all tables and remove all guests from their current
          table assignment.
          <br />
          This action cannot be undone.
          <br />
        </p>
        <div id="full-table-reset-checkbox">
          <CheckBox
            id="full-table-reset"
            name="full-table-reset"
            value="fulltablereset"
            v-model="fullTableReset"
            :binary="true"
          />
          <label for="full-table-reset"
            >Please confirm that you wish to reset all tables and generate a new
            layout, and that you understand that this action cannot be
            reversed.</label
          >
        </div>
      </div>

      <PrimeButton
        v-if="!activeMessage"
        :disabled="!fullTableReset"
        type="button"
        label="Confirm Table Reset"
        @click="generateDefaultTables()"
        class="p-button-danger"
        badgeClass="p-badge-danger"
      />

      <PrimeMessage
        show
        v-if="activeMessage"
        :variant="message.type"
        :closable="false"
      >
        <p>
          {{ message.text }}
        </p>
      </PrimeMessage>
    </PrimeDialog>
    <PrimeDialog
      v-model:visible="fillDialog"
      header="Confirm AutoFill of Tables"
      :modal="true"
      class="p-fluid"
      @hide="toggleMessage()"
    >
      <div v-if="!activeMessage">
        <p>
          This will algorithmically fill the available tables using the default
          sorting method, and can only be used immediately following a full
          reset.
          <br />
          This will first sort reservations to tables alphabetically based on
          the ministry/organization name on the reservation. <br />
          Individuals are then sorted to tables within that reservation based on
          their attendance type (Minister, Deputy Minister, Associate/Assistant
          Deputy Minister, etc.).
          <br />
        </p>
        <div id="table-assignment-checkbox">
          <CheckBox
            id="table-assignment"
            name="table-assignment"
            value="tableAssignment"
            v-model="tableAssignment"
            :binary="true"
          />
          <label for="table-assignment"
            >Please confirm that you wish to use the default sorting algorithim
            to setup the initial table arrangement.</label
          >
        </div>
      </div>

      <PrimeButton
        v-if="!activeMessage"
        :disabled="!tableAssignment"
        type="button"
        label="Confirm Table AutoFill"
        @click="fillTables()"
        class="p-button-success"
        badgeClass="p-badge-success"
      />

      <PrimeMessage
        show
        v-if="activeMessage"
        :variant="message.type"
        :closable="false"
      >
        <p>
          {{ message.text }}
        </p>
      </PrimeMessage>
    </PrimeDialog>
    <PrimeDialog
      v-model:visible="databaseResetDialog"
      header="Confirm Total Database Reset"
      :modal="true"
      class="p-fluid"
      @hide="toggleMessage()"
    >
      <div v-if="!activeMessage">
        <p>This will completely reset the database for a fresh event year.</p>
        <p>
          <b
            >WARNING: This action CANNOT be undone. Please proceed with
            caution.</b
          >
        </p>
        <p>
          All current reservations, guests, and tables will be removed from the
          event database.
        </p>
        <div id="reset-database-checkbox">
          <CheckBox
            id="reset-database"
            name="reset-database"
            value="fullDatabaseReset"
            v-model="fullDatabaseReset"
            :binary="true"
          />
          <label for="reset-database"
            ><b
              >Please confirm that you wish to reset the database for the
              Premier's Awards Event and you understand that this action CANNOT
              be undone.</b
            ></label
          >
        </div>
      </div>

      <PrimeButton
        v-if="!activeMessage"
        :disabled="!fullDatabaseReset"
        type="button"
        label="Confirm Database Reset"
        @click="resetDatabase()"
        class="p-button-danger"
        badgeClass="p-badge-danger"
      />

      <PrimeMessage
        show
        v-if="activeMessage"
        :variant="message.type"
        :closable="false"
      >
        <p>
          {{ message.text }}
        </p>
      </PrimeMessage>
    </PrimeDialog>
  </main>
</template>
<style lang="scss">
#siteSettings {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
  .p-card-subtitle {
    margin: 0;
  }
  .p-card-content {
    padding: 0;
    display: flex;
    flex-direction: column;
    button {
      width: fit-content;
    }
  }
  .expanded-table-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .expanded-table-add-row,
  .expanded-table-organization-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}
</style>
