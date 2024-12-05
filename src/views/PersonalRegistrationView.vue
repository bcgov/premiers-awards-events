<script>
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
import InputGuest from "../components/inputs/InputGuest.vue";
import PageHeader from "../components/common/PageHeader.vue";
import { useAuthUserStore } from "../stores/users";
import { useMessageStore } from "../stores/messages";
import { storeToRefs } from "pinia";
import { useFinancialStore } from "../stores/financial";
import { useSettingsStore } from "../stores/settings";
import { ref } from "vue";
import RegistrationSelector from "../components/inputs/RegistrationSelector.vue";
import RegistrationUserSelector from "../components/inputs/RegistrationUserSelector.vue";

export default {
  props: {
    id: String,
    ministryView: Boolean,
  },
  setup(props) {
    const messageStore = useMessageStore();
    const settingsStore = useSettingsStore();
    const { settings } = storeToRefs(useSettingsStore());
    const { message } = storeToRefs(useMessageStore());
    const { registration } = storeToRefs(useFinancialStore());
    const activeMessage = ref(false);
    const loading = ref(false);
    const ministerApproval = ref(false);
    const userStore = useAuthUserStore();
    userStore.login();
    const financialStore = useFinancialStore();

    financialStore.fill(props.id);

    const tableCount = () => {
      return String(financialStore.getTableCount);
    };

    const guestCount = () => {
      return String(financialStore.getGuestCount);
    };

    const getRegistrar = () => {
      return financialStore.getRegistrar;
    };

    const getMinistry = () => {
      return financialStore.getMinistry;
    };
    };

    const isSubmitted = () => {
      return financialStore.getRegistration.submitted;
    };

    const isCompleted = () => {
      return financialStore.getCompleted;
    };

    const dateSubmitted = () => {
      const date = new Date(financialStore.getRegistration.updatedAt);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const isAdmin = () => {
      return userStore.isAdmin;
      return userStore.isAdmin;
    };

    const isMinistryContact = () => {
      return userStore.user.organization === getMinistry();
    };
    };

    const toggleRegistration = async () => {
      let submitStatus = isSubmitted() ? false : true;
      let message = submitStatus ? "submitted" : "re-opened";
      loading.value = true;
      try {
        activeMessage.value = true;

        financialStore
          .registerFinancialInformation({
            submitted: submitStatus,
            registration: props.id,
          })
          .then(() => {
            loading.value = false;
            messageStore.setMessage({
              text: `Successfully ${message} registration!`,
              type: "success",
            });
          })
          .then(() => financialStore.fill(props.id));
      } catch (error) {
        loading.value = false;
        console.warn(error);
        activeMessage.value = true;
        messageStore.setMessage({
          text: `Registration could not be ${message}.`,
          type: "error",
        });
      }
    };

    //guestList Reactivity

    const keyCount = ref(0);
    const keyCountRegistration = ref(0);

    const keyAdd = () => keyCount.value++;
    const keyAddRegistration = () => keyCountRegistration.value++;

    const addGuestDialog = ref(false);
    const tableInfoDialog = ref(false);
    const guestInfoDialog = ref(false);
    const submissionDialog = ref(false);
    const registrationsDialog = ref(false);

    //PrimeDialog controls
    const addGuest = () => {
      addGuestDialog.value = true;
    };

    const tableInfo = () => {
      tableInfoDialog.value = true;
    };

    const guestInfo = () => {
      guestInfoDialog.value = true;
    };

    const submitRegistration = () => {
      activeMessage.value = false;
      submissionDialog.value = true;
    };

    const registrationSelect = () => {
      registrationsDialog.value = true;
    };

    return {
      userStore,
      financialStore,
      settingsStore,
      settings,
      registration,
      ministerApproval,
      tableCount,
      guestCount,
      getRegistrar,
      isSubmitted,
      isAdmin,
      isMinistryContact,
      getMinistry,
      toggleRegistration,
      addGuestDialog,
      tableInfoDialog,
      guestInfoDialog,
      submissionDialog,
      registrationsDialog,
      registrationSelect,
      keyCountRegistration,
      keyAddRegistration,
      addGuest,
      tableInfo,
      guestInfo,
      submitRegistration,
      dateSubmitted,
      activeMessage,
      message,
      loading,
      isCompleted,
      keyCount,
      keyAdd,
    };
  },
  components: {
    GuestList,
    RegistrationList,
    InputGuest,
    PageHeader,
    RegistrationSelector,
    RegistrationUserSelector,
  },
};
</script>

<template>
  <main class="personal-registration">
    <PageHeader
      class="pageheader"
      :footer="`Registration # ${registration._id} `"
      ><span v-if="isSubmitted()">Submitted {{ dateSubmitted() }} by</span>
    <PageHeader
      class="pageheader"
      :footer="`Registration # ${registration._id} `"
      ><span v-if="isSubmitted()">Submitted {{ dateSubmitted() }} by</span>
      <span v-else>In-progress registration for</span>
      {{ getRegistrar() }}
    </PageHeader>
    <div v-if="!isAdmin()">
      <div v-if="!isSubmitted() && settingsStore.getIsSalesOpen">
        <PrimeCard id="registration-info">
          <template #content>
            Please ensure that all registration and guest information on this
            page is complete prior to submitting your registration for the
            event. If you cannot complete the registration at this time, your
            current progress will remain saved here until you are ready to
            complete your submission.
          </template>
        </PrimeCard>
      </div>
      <div v-if="isSubmitted() && settingsStore.getIsSalesOpen">
        <PrimeCard id="registration-info">
          <template #content>
            Your registration has been submitted. Any request for changes after
            submissions close, and any other questions, should be sent via email
            to
            <a href="mailto: PremiersAwards@gov.bc.ca"
              >PremiersAwards@gov.bc.ca</a
            >.
            submissions close, and any other questions, should be sent via email
            to
            <a href="mailto: PremiersAwards@gov.bc.ca"
              >PremiersAwards@gov.bc.ca</a
            >.
          </template>
        </PrimeCard>
      </div>
      <div v-if="!settingsStore.getIsSalesOpen">
        <PrimeCard id="sales-closed-info">
          <template #content>
            Registrations for {{ settings.year }} are currently closed. Any
            request for changes after submission, inquiries regarding
            outstanding registrations, or any other questions should be sent via
            email to
            <a href="mailto: PremiersAwards@gov.bc.ca"
              >PremiersAwards@gov.bc.ca</a
            >.
            <a href="mailto: PremiersAwards@gov.bc.ca"
              >PremiersAwards@gov.bc.ca</a
            >.
          </template>
        </PrimeCard>
      </div>
    </div>
    <ProgressSpinner v-if="loading" />
    <div v-else class="page-body">
      <div id="multiregistration-dropdown" class="pt-1">
        <PrimeButton
          type="button"
          label="Registration Options"
          icon="pi pi-question-circle"
          class="p-button-info"
          @click="registrationSelect()"
          badgeClass="p-badge-danger"
          v-tooltip="'Switch registrations or create a new registration.'"
          ><span>Registration Options</span
          ><i class="pi pi-question-circle pl-1"></i
        ></PrimeButton>
        <PrimeButton
          type="button"
          label="Registration Options"
          icon="pi pi-question-circle"
          class="p-button-info"
          @click="registrationSelect()"
          badgeClass="p-badge-danger"
          v-tooltip="'Switch registrations or create a new registration.'"
          ><span>Registration Options</span
          ><i class="pi pi-question-circle pl-1"></i
        ></PrimeButton>
      </div>
      <RegistrationList
        id="personal-registration-table"
        :registrationID="id"
        :detailsView="false"
        :adminView="false || isAdmin()"
        :ministryView="false"
        :key="keyCountRegistration"
      />
      <RegistrationList
        id="personal-registration-table"
        :registrationID="id"
        :detailsView="false"
        :adminView="false || isAdmin()"
        :ministryView="false"
        :key="keyCountRegistration"
      />
      <div>
        <PrimeCard id="guest-seating-info">
          <template #content>
            <div class="registration-guest-info">
              <span id="guest-registration-info"
                >Please order guests by requested seating arrangement. By
              <span id="guest-registration-info"
                >Please order guests by requested seating arrangement. By
                default, guests will be assigned to tables in the order they are
                added.</span
              >
                added.</span
              >
              <div class="registration-buttons">
                <PrimeButton
                  type="button"
                  label="Table Information"
                  icon="pi pi-ticket"
                  class="p-button-info"
                  :badge="tableCount()"
                  @click="tableInfo()"
                  badgeClass="p-badge-danger"
                />
                <PrimeButton
                  type="button"
                  label="Guest Information"
                  icon="pi pi-users"
                  class="p-button-info"
                  :badge="guestCount()"
                  @click="guestInfo()"
                  badgeClass="p-badge-danger"
                />
                <PrimeButton
                  v-if="
                    !isSubmitted() &&
                    (settingsStore.getIsSalesOpen || isAdmin())
                  "
                  label="Add Guests"
                  icon="pi pi-user-plus"
                  class="p-button-rounded p-button-success mr-2"
                  @click="addGuest()"
                  :disabled="guestCount() >= 60 && !isAdmin()"
                />
                <PrimeButton
                  type="button"
                  label="Table Information"
                  icon="pi pi-ticket"
                  class="p-button-info"
                  :badge="tableCount()"
                  @click="tableInfo()"
                  badgeClass="p-badge-danger"
                />
                <PrimeButton
                  type="button"
                  label="Guest Information"
                  icon="pi pi-users"
                  class="p-button-info"
                  :badge="guestCount()"
                  @click="guestInfo()"
                  badgeClass="p-badge-danger"
                />
                <PrimeButton
                  v-if="
                    !isSubmitted() &&
                    (settingsStore.getIsSalesOpen || isAdmin())
                  "
                  label="Add Guests"
                  icon="pi pi-user-plus"
                  class="p-button-rounded p-button-success mr-2"
                  @click="addGuest()"
                  :disabled="guestCount() >= 60 && !isAdmin()"
                />
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
      <PrimeDialog
        v-model:visible="tableInfoDialog"
        header="Table Information"
        :modal="true"
        class="p-fluid"
        >The current number of tables required based on your guest list is:
      <PrimeDialog
        v-model:visible="tableInfoDialog"
        header="Table Information"
        :modal="true"
        class="p-fluid"
        >The current number of tables required based on your guest list is:
        {{ tableCount() }}.
        <ul>
          <li>The cost per table is $500, and each table seats 10 people.</li>
          <li>
            Payment for tables is conducted through a Journal Voucher process
            with each ministry using the financial coding submitted in the
            registration information. Payment will be reconciled following the
            provincial ceremony.
          </li>
          <li>
            Each ministry is encouraged to purchase a minimum of one table (or
            up to three tables for large ministries ).
          </li>
          <li>
            Requests for four or more tables will be assessed based on total
            number of tables requested to ensure participation from all
            ministries is accommodated.
          </li>
          <li>
            Ministries are responsible for their employees' travel and
            associated accommodation for the provincial ceremony .
          </li>
        </ul>

        <br /><b>Warning regarding table charges:</b><br />
        Please be aware that half tables may only be accomodated at the
        program's discretion, and you may be charged the full table amount.
        <br />
      </PrimeDialog>

      <PrimeDialog
        v-model:visible="guestInfoDialog"
        header="Guest Information"
        :modal="true"
        class="p-fluid"
        >Total Number of Guests: {{ guestCount() }}.
      <PrimeDialog
        v-model:visible="guestInfoDialog"
        header="Guest Information"
        :modal="true"
        class="p-fluid"
        >Total Number of Guests: {{ guestCount() }}.

        <ul>
          <li>
            For individual categories: Emerging Leader, Leadership, and Legacy
            finalists – ensure the finalist and their spouse (or alternate
            immediate family member) are both included in this registration.
          </li>
          <li>
            All Ministers are invited by the Premier’s Office as part of the
            Premier’s Awards program; in most cases, Ministers will be seated
            with their respective ministry.
          </li>
          <ul>
            <li>
              Upon Minister RSVPs, the Premier’s Awards program will work with
              each Ministry Contact to ensure the Minister is accounted for in
              table numbers.
            </li>
          </ul>

          <li>
            Ministry Contacts must ensure all Executive who plan to attend (DM,
            ADM, etc.) are included in this registration.
          </li>
          <li>
            Ministry Contacts must ensure that all invited external partners are
            included in this registration.
          </li>
        </ul>
      </PrimeDialog>

      <PrimeDialog
        v-model:visible="submissionDialog"
        header="Confirm Submission"
        :modal="true"
        class="p-fluid"
      >
      <PrimeDialog
        v-model:visible="submissionDialog"
        header="Confirm Submission"
        :modal="true"
        class="p-fluid"
      >
        <div v-if="!isCompleted() && !isAdmin()">
          <p>
            There are currently missing fields on your registration.
            <br />
            Please update the registration details and ensure that all fields
            are completed.
          </p>
        </div>
        <div v-else-if="!isSubmitted() && !activeMessage">
          <p>
            <b>Are you sure you wish to submit your event registration?</b>
          </p>
          <ul>
            <li>
              Changes after the deadline cannot be guaranteed due to impact on
              remaining planning requirements.
            </li>
            <li>
              The Premier’s Awards team will reach out after table sales close
              with specific instructions on how to communicate changes or
              updates to your submissions. Please hold your changes and
              questions until that time.
            </li>
          </ul>
          <p>
            Please be aware that half tables may only be accomodated at the
            program's discretion, and you may be charged the full table amount.
          </p>
          <p>
            Guests submitted on this registration: {{ guestCount() }}.<br />
            Total tables required for this number of guests: {{ tableCount() }}
          </p>
          <div id="minister-approval-checkbox">
            <CheckBox
              id="minister-approval"
              name="minister-approval"
              value="ministerapproval"
              v-model="ministerApproval"
              :binary="true"
            />
            <label for="minister-approval"
              >Check this box to confirm approval has been obtained by the
              ministry's Deputy Minister's office.</label
            >
            <CheckBox
              id="minister-approval"
              name="minister-approval"
              value="ministerapproval"
              v-model="ministerApproval"
              :binary="true"
            />
            <label for="minister-approval"
              >Check this box to confirm approval has been obtained by the
              ministry's Deputy Minister's office.</label
            >
          </div>
        </div>
        <div
          v-else-if="
            isSubmitted() &&
            (isAdmin() || settingsStore.getIsSalesOpen) &&
            !activeMessage
          "
        >
        <div
          v-else-if="
            isSubmitted() &&
            (isAdmin() || settingsStore.getIsSalesOpen) &&
            !activeMessage
          "
        >
          <p>
            Are you sure you wish to reverse submission of this
            event-registration?<br />
            This will re-open this submission for editing, and remove the
            current submission date.
          </p>
        </div>
        <PrimeButton
          v-if="
            !isSubmitted() && !activeMessage && (isCompleted() || isAdmin())
          "
          :disabled="!ministerApproval"
          type="button"
          label="Confirm submit registration"
          icon="pi pi-send"
          class="p-button-primary"
          @click="toggleRegistration()"
          badgeClass="p-badge-danger"
        />
        <PrimeButton
          v-if="
            isSubmitted() &&
            (isAdmin() || settingsStore.getIsSalesOpen) &&
            !activeMessage
          "
          type="button"
          label="Re-open registration"
          icon="pi pi-undo"
          class="p-button-danger"
          @click="toggleRegistration()"
          badgeClass="p-badge-danger"
        />
        <PrimeMessage
          show
          v-if="activeMessage"
          :variant="message.type"
          :closable="false"
        >
        <PrimeButton
          v-if="
            !isSubmitted() && !activeMessage && (isCompleted() || isAdmin())
          "
          :disabled="!ministerApproval"
          type="button"
          label="Confirm submit registration"
          icon="pi pi-send"
          class="p-button-primary"
          @click="toggleRegistration()"
          badgeClass="p-badge-danger"
        />
        <PrimeButton
          v-if="
            isSubmitted() &&
            (isAdmin() || settingsStore.getIsSalesOpen) &&
            !activeMessage
          "
          type="button"
          label="Re-open registration"
          icon="pi pi-undo"
          class="p-button-danger"
          @click="toggleRegistration()"
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
        v-model:visible="addGuestDialog"
        :style="{ width: '50rem', margin: '5rem' }"
        header="Add a new Guest"
        @hide="keyAdd()"
        :modal="true"
        class="p-fluid"
      >
        <InputGuest :registrationID="id" />
      <PrimeDialog
        v-model:visible="addGuestDialog"
        :style="{ width: '50rem', margin: '5rem' }"
        header="Add a new Guest"
        @hide="keyAdd()"
        :modal="true"
        class="p-fluid"
      >
        <InputGuest :registrationID="id" :isAdmin="isAdmin()" />
      </PrimeDialog>
      <PrimeDialog
        v-model:visible="registrationsDialog"
        position="top"
        :style="{ width: '50rem', margin: '5rem' }"
        @hide="keyAddRegistration()"
        :modal="true"
        class="p-fluid"
      >
      <PrimeDialog
        v-model:visible="registrationsDialog"
        position="top"
        :style="{ width: '50rem', margin: '5rem' }"
        @hide="keyAddRegistration()"
        :modal="true"
        class="p-fluid"
      >
        <template #header>
          <h2>Registration Management Options</h2>
        </template>
        <h3>
          Select Registration To Edit / Create New Additional Registration
        </h3>
        <RegistrationSelector />
        <div v-if="isAdmin()">
          <h3>
            Add/Remove Registrar Access to Registration
            <i
              class="pi pi-question-circle pl-1"
              v-tooltip.top="'Users must be in the system as a registrar.'"
            ></i>
          </h3>
          <h3>
            Add/Remove Registrar Access to Registration
            <i
              class="pi pi-question-circle pl-1"
              v-tooltip.top="'Users must be in the system as a registrar.'"
            ></i>
          </h3>
          <RegistrationUserSelector />
        </div>
      </PrimeDialog>
      <GuestList
        id="personal-registration-guests-table"
        :adminView="false || isAdmin()"
        :ministryView="false || isMinistryContact()"
        :registrationID="id"
        :key="keyCount"
      />
      <GuestList
        id="personal-registration-guests-table"
        :adminView="false || isAdmin()"
        :ministryView="false || isMinistryContact()"
        :registrationID="id"
        :key="keyCount"
      />
      <div class="submission-buttons">
        <PrimeButton
          v-if="!isSubmitted() && (settingsStore.getIsSalesOpen || isAdmin())"
          :disabled="guestCount() < 5 && !isAdmin()"
          type="button"
          label="Submit Registration"
          icon="pi pi-send"
          class="p-button-primary"
          @click="submitRegistration()"
          badgeClass="p-badge-danger"
        />
        <PrimeButton
          v-if="!isSubmitted() && (settingsStore.getIsSalesOpen || isAdmin())"
          :disabled="guestCount() < 5 && !isAdmin()"
          type="button"
          label="Submit Registration"
          icon="pi pi-send"
          class="p-button-primary"
          @click="submitRegistration()"
          badgeClass="p-badge-danger"
        />

        <PrimeButton
          v-if="
            (isSubmitted() && isAdmin() && !ministryView) ||
            (!ministryView && isSubmitted() && settingsStore.getIsSalesOpen) ||
            (ministryView &&
              isMinistryContact() &&
              isSubmitted() &&
              settingsStore.getIsSalesOpen)
          "
          type="button"
          label="Unsubmit Registration"
          icon="pi pi-undo"
          class="p-button-danger"
          @click="submitRegistration()"
          badgeClass="p-badge-danger"
        />
        <label
          v-if="
            !isSubmitted() &&
            (settingsStore.getIsSalesOpen || isAdmin()) &&
            guestCount() < 5 &&
            !isAdmin()
          "
          class="p-error"
          id="submit-registration-help"
          >The minimum number of guests allowed on a registration is 5.</label
        >
        <PrimeButton
          v-if="
            (isSubmitted() && isAdmin() && !ministryView) ||
            (!ministryView && isSubmitted() && settingsStore.getIsSalesOpen) ||
            (ministryView &&
              isMinistryContact() &&
              isSubmitted() &&
              settingsStore.getIsSalesOpen)
          "
          type="button"
          label="Unsubmit Registration"
          icon="pi pi-undo"
          class="p-button-danger"
          @click="submitRegistration()"
          badgeClass="p-badge-danger"
        />
        <label
          v-if="
            !isSubmitted() &&
            (settingsStore.getIsSalesOpen || isAdmin()) &&
            guestCount() < 5 &&
            !isAdmin()
          "
          class="p-error"
          id="submit-registration-help"
          >The minimum number of guests allowed on a registration is 5.</label
        >
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.personal-registration {
  #registration-info {
    .p-card-content {
      font-size: 1rem;
    }
  }

  #personal-registration-table {
    .p-datatable {
      padding: 1rem;
    }
  }

  #personal-registration-guests-table {
    .p-datatable {
      padding: 1rem;
    }
  }

  #guest-seating-info {
    .p-card-content {
      padding: 0;
    }
  }

  .registration-guest-info {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    flex-wrap: wrap;

    #guest-registration-info {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .registration-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  }

  .submission-buttons {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    align-items: flex-end;
    flex-direction: column;

    button {
      width: fit-content;
    }
  }
}

#minister-approval-checkbox {
  padding: 1rem;
  display: flex;
  gap: 1rem;
}
</style>
