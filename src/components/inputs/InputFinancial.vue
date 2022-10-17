<!-- Provides initial registration of financial details -->
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
      class="financial-registration-form"
      v-else
      @submit="onSubmit"
      @reset="onReset"
    >
      <div class="financial-form-selections">
        <h3 class="form-header">Organizational Information</h3>
        <div class="form-break"></div>
        <div class="form-item dropdown">
          <label for="organization">Organization:</label>
          <DropDown
            v-bind:class="{ 'p-invalid': v$.organization.$error }"
            id="organization"
            v-model="registration.organization"
            :options="organizations"
            optionLabel="text"
            optionValue="value"
            placeholder="Select an Organization"
            title="organization"
          />
          <small
            v-if="v$.organization.$error"
            class="p-error"
            id="organization-help"
            >Please select your organization.</small
          >
        </div>

        <div class="form-item text-field">
          <label for="branch" id="branch-help">Branch:</label>
          <InputText
            v-bind:class="{ 'p-invalid': v$.branch.$error }"
            id="branch"
            type="branch"
            aria-describedby="branch-help"
            v-model.trim="registration.branch"
          />
          <small v-if="v$.branch.$error" class="p-error" id="branch-help"
            >Please enter your branch.</small
          >
        </div>

        <div class="form-break"></div>
        <h3 class="form-header">Contact Information</h3>
        <div class="form-break"></div>
        <div class="form-item text-field">
          <label for="primarycontact" id="primarycontact-help"
            >Primary Contact:</label
          >
          <InputText
            v-bind:class="{ 'p-invalid': v$.primarycontact.$error }"
            id="primarycontact"
            type="primarycontact"
            aria-describedby="primarycontact-help"
            v-model.trim="registration.primarycontact"
          />
          <small
            v-if="v$.primarycontact.$error"
            class="p-error"
            id="primarycontact-help"
            >Please enter the name of the Primary Contact for this
            registration.</small
          >
        </div>
        <div class="form-item text-field">
          <label for="primaryemail" id="primaryemail-help"
            >Primary Contact Email:</label
          >
          <InputText
            v-bind:class="{ 'p-invalid': v$.primaryemail.$error }"
            id="primaryemail"
            type="primaryemail"
            aria-describedby="primaryemail-help"
            v-model.trim="registration.primaryemail"
          />
          <small
            v-if="v$.primaryemail.$error"
            id="primaryemail-help"
            class="p-error"
            >Email Field is Incorrect.</small
          >
        </div>
        <div class="form-item text-field">
          <label for="financialcontact" id="financialcontact-help"
            >Financial Contact:</label
          >
          <InputText
            v-bind:class="{ 'p-invalid': v$.financialcontact.$error }"
            id="financialcontact"
            type="financialcontact"
            aria-describedby="financialcontact-help"
            v-model.trim="registration.financialcontact"
          />
          <small
            v-if="v$.financialcontact.$error"
            class="p-error"
            id="financialcontact-help"
            >Please enter the name of the Financial Contact for this
            registration.</small
          >
        </div>
        <div class="form-break"></div>
        <h3 class="form-header">Financial Information</h3>
        <div class="form-break"></div>
        <div class="form-item number-field">
          <label for="clientministry">Client/Ministry Number:</label>
          <InputNumber
            v-bind:class="{ 'p-invalid': v$.clientministry.$error }"
            id="clientministry"
            v-model="registration.clientministry"
            aria-placeholder="3 digit number"
            placeholder="3 digit number"
            :useGrouping="false"
          />
          <small
            v-if="v$.clientministry.$error"
            id="clientministry-help"
            class="p-error"
            >Please enter the 3-digit client/ministry number.</small
          >
        </div>
        <div class="form-item number-field">
          <label for="respcode">RESP Code:</label>
          <InputText
            v-bind:class="{ 'p-invalid': v$.respcode.$error }"
            id="respcode"
            v-model.trim="registration.respcode"
            aria-placeholder="5 digit number"
            placeholder="5 digit number"
            :useGrouping="false"
            aria-describedby="respcode-help"
          />
          <small v-if="v$.respcode.$error" id="respcode-help" class="p-error"
            >Please enter the 5-digit RESP Code number.</small
          >
        </div>
        <div class="form-item number-field">
          <label for="serviceline">Service Line:</label>
          <InputNumber
            v-bind:class="{ 'p-invalid': v$.serviceline.$error }"
            id="serviceline"
            v-model="registration.serviceline"
            aria-placeholder="5 digit number"
            placeholder="5 digit number"
            :useGrouping="false"
          />
          <small
            v-if="v$.serviceline.$error"
            id="serviceline-help"
            class="p-error"
            >Please enter the 5-digit Service Line number.</small
          >
        </div>
        <div class="form-item number-field">
          <label for="stob">STOB:</label>
          <InputNumber
            v-bind:class="{ 'p-invalid': v$.stob.$error }"
            id="stob"
            v-model="registration.stob"
            aria-placeholder="4 digit number"
            placeholder="4 digit number"
            :useGrouping="false"
          />
          <small v-if="v$.stob.$error" id="stob-help" class="p-error"
            >Please enter the 4-digit STOB number.</small
          >
        </div>
        <div class="form-item number-field">
          <label for="project">Project:</label>
          <InputText
            v-bind:class="{ 'p-invalid': v$.project.$error }"
            id="project"
            v-model="registration.project"
            aria-placeholder="7 digit number"
            placeholder="7 digit number"
            :useGrouping="false"
            aria-describedby="project-help"
          />
          <small v-if="v$.project.$error" id="project-help" class="p-error"
            >Please enter the 7-digit project number.</small
          >
        </div>
      </div>
      <div class="submission-form-buttons">
        <PrimeButton type="submit" label="primary" class="p-button-raised"
          >Submit</PrimeButton
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
import { ref } from "vue";
import formServices from "@/services/settings.services";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  alphaNum,
  minLength,
  maxLength,
  numeric,
  minValue,
  maxValue,
} from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import { useFinancialStore } from "../../stores/financial";
import { useAuthUserStore } from "../../stores/users";
import router from "../../router/index.js";

export default {
  props: {
    registrationID: String,
    adminView: Boolean,
    detailsView: Boolean,
  },
  setup(props) {
    const register = useFinancialStore();
    const userStore = useAuthUserStore();
    const organizations = ref(formServices.get("organizations") || []);
    const { registration } = storeToRefs(useFinancialStore());

    //Vuelidate Form Rules
    const rules = {
      organization: { required },
      branch: { required },
      primarycontact: { required },
      primaryemail: { required, email },
      financialcontact: { required },
      clientministry: {
        required,
        numeric,
        minValueValue: minValue(100),
        maxValueValue: maxValue(999),
      },
      respcode: {
        required,
        alphaNum,
        minLengthValue: minLength(5),
        maxLengthValue: maxLength(5),
      },
      serviceline: {
        required,
        numeric,
        minValueValue: minValue(10000),
        maxValueValue: maxValue(99999),
      },
      stob: {
        required,
        numeric,
        minValueValue: minValue(1000),
        maxValueValue: maxValue(9999),
      },
      project: {
        required,
        alphaNum,
        minLengthValue: minLength(7),
        maxLengthValue: maxLength(7),
      },
    };

    const v$ = useVuelidate(rules, registration);

    let loading = ref(false);
    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });

    //registers user if all form fields valid
    const onSubmit = async function (event) {
      event.preventDefault();
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      try {
        loading.value = true;
        const userGUID = userStore.getUser.username;

        //attaches the creator's username to the registration
        this.registration.registrar =
          this.registration.registrar !== null ||
          this.registration.registrar.length !== 0
            ? this.registration.registrar
            : userGUID.username;

        register.registerFinancialInformation(this.registration).then(() => {
          this.$forceUpdate;
          loading.value = false;
          message.value = true;
          messageText.value = {
            severity: "success",
            text: "Registration Updated!",
          };
        });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Registration could not be updated.",
        };
        // error.response.status Check status code
      } finally {
        setTimeout(() => (message.value = false), 1500);
        if (!props.registrationID) {
          router.push("/create/registration/");
        }
      }
    };

    //reset form fields to default
    const onReset = function (event) {
      event.preventDefault();
      this.registration.organization = "";
      this.registration.branch = "";
      this.registration.primarycontact = "";
      this.registration.primaryemail = "";
      this.registration.financialcontact = "";
      this.registration.clientministry = null;
      this.registration.respcode = null;
      this.registration.serviceline = null;
      this.registration.stob = null;
      this.registration.project = null;
    };

    //fills user registration state on load of component

    const fillList = async function () {
      const user = userStore.getUser;
      register.$reset;

      if (props.registrationID)
        return await register.fillOnlyRegistration(props.registrationID);
      if (props.adminView) return await register.fillAllRegistrations();
      else
        return (await register.fill(user.guid)) ? register.fill(user.guid) : [];
    };

    fillList();

    return {
      loading,
      message,
      messageText,
      registration,
      v$,
      organizations,
      fillList,
      onSubmit,
      onReset,
    };
  },
};
</script>

<style lang="scss">
.financial-registration-form {
  padding: 1rem;

  .financial-form-selections {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;

    .form-item {
      margin: 0 10px;
    }
    .form-break {
      flex-basis: 100%;
      height: 0;
    }

    .form-header {
      margin: 0;
    }
  }

  label {
    display: flex;
  }

  .submission-form-buttons {
    display: flex;
    justify-content: center;
    padding: 1rem;
    gap: 1rem;
  }
}
</style>
