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

export default {
  props: {
    id: String,
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
    const keyAdd = () => keyCount.value++;

    const addGuestDialog = ref(false);
    const tableInfoDialog = ref(false);
    const guestInfoDialog = ref(false);
    const submissionDialog = ref(false);

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
      toggleRegistration,
      addGuestDialog,
      tableInfoDialog,
      guestInfoDialog,
      submissionDialog,
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
  components: { GuestList, RegistrationList, InputGuest, PageHeader },
};
</script>

<template>
  <main class="personal-registration">
    <PageHeader
      class="pageheader"
      :footer="`Registration # ${registration._id} `"
      ><span v-if="isSubmitted()">Submitted {{ dateSubmitted() }} by</span>
      <span v-else>In-progress registration for</span>
      {{ getRegistrar() }}</PageHeader
    >
    <div v-if="!isAdmin()">
      <div v-if="!isSubmitted() && settingsStore.getIsSalesOpen">
        <PrimeCard id="registration-info">
          <template #content>
            Please ensure that all registration and guest information on this
            page is complete prior to submitting your registration for the
            event. If you cannot complete the registration at this time, your
            current progress will remain saved here until you are ready to
            complete your submission.
          </template></PrimeCard
        >
      </div>
      <div v-if="isSubmitted() && settingsStore.getIsSalesOpen">
        <PrimeCard id="registration-info">
          <template #content>
            Your registration has been submitted. Any request for changes after
            submission and any other questions should be sent via email to
            <a href="mailto: PremiersAwards@gov.bc.ca"
              >PremiersAwards@gov.bc.ca</a
            >.
          </template></PrimeCard
        >
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
          </template></PrimeCard
        >
      </div>
    </div>
    <ProgressSpinner v-if="loading" />
    <div v-else class="page-body">
      <RegistrationList
        id="personal-registration-table"
        :registrationID="id"
        :detailsView="false"
        :adminView="false || isAdmin()"
      />
      <div>
        <PrimeCard id="guest-seating-info">
          <template #content>
            <div class="registration-guest-info">
              <span id="guest-registration-info"
                >Please note that guests will automatically be sorted to tables
                first by attendance type, and then in the order that they are
                added.</span
              >
              <div class="registration-buttons">
                <PrimeButton
                  type="button"
                  label="Table Information"
                  icon="pi pi-ticket"
                  class="p-button-warning"
                  :badge="tableCount()"
                  @click="tableInfo()"
                  badgeClass="p-badge-danger"
                />
                <PrimeButton
                  type="button"
                  label="Guest Information"
                  icon="pi pi-users"
                  class="p-button-warning"
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
            <b>Are you sure you wish to submit your event registration?</b> You
            will not be able to revise your submission once completed.
          </p>
          <ul>
            <li>
              Changes after the deadline cannot be guaranteed due to impact on
              remaining planning requirements.
            </li>
            <li>
              Any request for changes after submission must be sent via email to
              <a href="mailto: PremiersAwards@gov.bc.ca"
                >PremiersAwards@gov.bc.ca</a
              >.
            </li>
            <li>
              Please ensure to submit change requests with complete contact
              information to avoid oversights of important information, and to
              ensure attendee name tags for entry into the ceremony are
              accurate.
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
          </div>
        </div>
        <div v-else-if="isSubmitted() && isAdmin() && !activeMessage">
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
          v-if="isSubmitted() && isAdmin() && !activeMessage"
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
        ><InputGuest :registrationID="id"
      /></PrimeDialog>
      <GuestList
        id="personal-registration-guests-table"
        :adminView="false || isAdmin()"
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
          v-if="isSubmitted() && isAdmin()"
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
