<!-- Provides initial registration of guest details -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <form
      class="guest-registration-form"
      v-else
      @submit="onSubmit"
      @reset="onReset"
    >
      <div class="guest-registration-selections">
        <div class="dropdown">
          <label for="organization">Organization:</label>
          <AutoComplete
            v-bind:class="{ 'p-invalid': v$.organization.$error }"
            v-model="guest.organization"
            :dropdown="true"
            :suggestions="filteredOrganizations"
            @complete="searchOrganization($event)"
            placeholder="Select an organization or enter manually"
            optionLabel="label"
            optionValue="key"
            field="label"
            :disabled="guest.hasexternalorganization"
          >
            <template #option="slotProps">
              <div>{{ slotProps.option.label }}</div>
            </template></AutoComplete
          >
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
            v-model="guest.hasexternalorganization"
            :binary="true"
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
            v-model="guest.organization"
            placeholder="External organization name"
          />
        </div>

        <div class="text-field">
          <label for="firstname">First Name:</label>
          <InputText
            v-bind:class="{ 'p-invalid': v$.firstname.$error }"
            id="firstname"
            type="firstname"
            aria-describedby="firstname-help"
            v-model="guest.firstname"
            placeholder="First Name"
          />
          <small v-if="v$.firstname.$error" class="p-error" id="firstname-help"
            >Please enter guest's first name.</small
          >
        </div>

        <div class="text-field">
          <label for="lastname">Last Name:</label>
          <InputText
            v-bind:class="{ 'p-invalid': v$.lastname.$error }"
            id="lastname"
            type="lastname"
            aria-describedby="lastname-help"
            v-model="guest.lastname"
            placeholder="Last Name"
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
            optionLabel="label"
            optionValue="key"
            optionDisabled="disabled"
            placeholder="Select the type of attendance for this guest"
          />
          <small
            v-if="v$.attendancetype.$error"
            class="p-error"
            id="attendancetype-help"
            >Please select the attendance type for this guest.</small
          >
        </div>

        <label for="pronouns">Pronouns (please select all that apply):</label>
        <div class="checkbox-group">
          <div
            v-for="each of pronouns"
            :key="each.key"
            class="field-checkbox"
            id="pronouns-checkbox"
          >
            <CheckBox
              :id="each.key"
              :name="each.value"
              :value="each.value"
              v-model="guest.pronouns"
            />
            <label :for="each.key">{{ each.text }}</label>
          </div>
          <div>
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
            :binary="true"
            v-model="guest.custompronouns"
            placeholder="Custom pronouns"
          />
        </div>

        <div class="dropdown">
          <label for="supportingfinalist">Finalist guest is supporting:</label>
          <DropDown
            v-bind:class="{ 'p-invalid': v$.supportingfinalist.$error }"
            id="supportingfinalist"
            v-model="guest.supportingfinalist"
            :options="supportingfinalist"
            optionLabel="text"
            optionValue="value"
            placeholder="Select the finalist guest is supporting:"
          />
          <small
            v-if="v$.supportingfinalist.$error"
            class="p-error"
            id="supportingfinalist-help"
            >Please select the finalist guest is supporting.</small
          >
        </div>

        <label for="accessibility">Accessibility Requirements:</label>
        <div class="checkbox-group">
          <div
            v-for="each of accessibility"
            :key="each.key"
            class="field-checkbox"
            id="accessibility-checkbox"
          >
            <CheckBox
              :id="each.key"
              :name="each.value"
              :value="each.value"
              v-model="guest.accessibility"
            />
            <label :for="each.key">{{ each.text }}</label>
          </div>
        </div>

        <label for="dietary">Dietary Requirements:</label>
        <div class="checkbox-group">
          <div v-for="each of dietary" :key="each.key" class="field-checkbox">
            <CheckBox
              :id="each.key"
              name="each"
              :value="each.value"
              v-model="guest.dietary"
            />
            <label :for="each.key">{{ each.text }}</label>
          </div>
        </div>
      </div>
      <div class="buttons">
        <PrimeButton type="submit" label="primary" class="p-button-raised"
          >Add Guest</PrimeButton
        >
        <PrimeButton
          type="reset"
          label="danger"
          class="p-button-raised p-button-danger"
          >Reset</PrimeButton
        >
      </div>
    </form>
  </div>
</template>

<script>
import { useSettingsStore } from "@/stores/settings";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "../../stores/guests";
import { useFinancialStore } from "../../stores/financial";

export default {
  props: {
    registrationID: String,
  },
  setup(props) {
    const settingsStore = useSettingsStore();
    const guestData = useGuestsStore();
    const registrationData = useFinancialStore();
    const { guest } = storeToRefs(useGuestsStore());
    const rules = {
      organization: { required },
      firstname: { required },
      lastname: { required },
      attendancetype: { required },
      supportingfinalist: { required },
    };
    const hascustompronouns = ref(false);
    const custompronouns = ref("");
    const hasexternalorganization = ref(false);
    const v$ = useVuelidate(rules, guest);
    const organizations = ref(settingsStore.lookup("organizations") || []);
    const filteredOrganizations = ref();
    const attendancetypes = ref(settingsStore.lookup("attendancetypes") || []);
    const trimmedAttendancetypes = attendancetypes.value.map((opt) => ({
      ...opt,
      disabled:
        opt.value !== "judge" &&
        opt.value !== "adjudicator" &&
        opt.value !== "volunteer" &&
        opt.value !== "guest"
          ? false
          : true,
    }));

    attendancetypes.value = trimmedAttendancetypes;

    const accessibility = ref(
      settingsStore.lookup("accessibilityoptions") || []
    );
    const supportingfinalist = ref(
      settingsStore.lookup("supportingfinalistoptions") || []
    );
    const pronouns = ref(settingsStore.lookup("pronounsoptions") || []);
    const dietary = ref(settingsStore.lookup("dietaryoptions") || []);

    if (props.registrationID) {
      registrationData.fill(props.registrationID);
    }

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
      }, 10);
    };

    let loading = ref(false);
    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });

    const onSubmit = async function (event) {
      event.preventDefault();
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;
      this.guest.registration = registrationData.getId;
      this.guest.organization =
        typeof this.guest.organization === "string"
          ? this.guest.organization
          : this.guest.organization.value;

      try {
        loading.value = true;
        guestData
          .registerGuest(this.guest)
          .then((guest) => guestData.addGuestList(guest))
          .then(() => {
            delete this.guest["guid"];
            this.guest.organization = "";
            this.guest.firstname = "";
            this.guest.lastname = "";
            this.guest.attendancetype = "";
            this.guest.dietary = [];
            this.guest.accessibility = [];
            this.guest.custompronouns = "";
            this.guest.hascustompronouns = false;
            this.guest.pronouns = [];
            this.guest.hasexternalorganization = false;
            this.guest.supportingfinalist = "";
            this.$forceUpdate;
            this.v$.$reset();
            loading.value = false;
            message.value = true;
            messageText.value = { severity: "success", text: "Guest Updated!" };
          });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Guest could not be updated.",
        };
      } finally {
        setTimeout(() => (message.value = false), 1500);
      }
    };

    //reset to default
    const onReset = function (event) {
      event.preventDefault();
      delete this.guest["guid"];
      this.guest.organization = "";
      this.guest.firstname = "";
      this.guest.lastname = "";
      this.guest.attendancetype = "";
      this.guest.dietary = [];
      this.guest.accessibility = [];
      this.guest.pronouns = [];
      this.guest.custompronouns = "";
      this.guest.hascustompronouns = false;
      this.guest.hasexternalorganization = false;
      this.guest.supportingfinalist = "";
    };
    return {
      loading,
      message,
      messageText,
      guest,
      guestData,
      v$,
      organizations,
      dietary,
      accessibility,
      attendancetypes,
      pronouns,
      custompronouns,
      hascustompronouns,
      hasexternalorganization,
      supportingfinalist,
      rules,
      filteredOrganizations,
      searchOrganization,
      onSubmit,
      onReset,
    };
  },
};
</script>

<style lang="scss">
.field-checkbox {
  padding: 0px 0.5em;
}
.guest-registration-form {
  padding: 1rem;

  .guest-registration-selections {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }
}
.buttons {
  display: flex;
  justify-content: space-between;
  .p-button {
    width: 48%;
  }
}
</style>
