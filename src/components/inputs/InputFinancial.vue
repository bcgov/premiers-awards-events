<!-- Provides initial registration of financial details -->
<template>
  <div>
    <form @submit="onSubmit" @reset="onReset">
      <div class="dropdown">
        <label for="organization">Organization:</label>
        <Dropdown
          v-bind:class="{ 'p-invalid': v$.organization.$error }"
          id="organization"
          v-model="registration.organization"
          :options="organizations"
          optionLabel="text"
          optionValue="value"
          placeholder="Select an Organization"
        />
        <small
          v-if="v$.organization.$error"
          class="p-error"
          id="organization-help"
          >Please select your organization.</small
        >
      </div>

      <div class="text-field">
        <label for="branch">Branch:</label>
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

      <div class="text-field">
        <label for="primarycontact">Primary Contact:</label>
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
      <div class="text-field">
        <label for="primaryemail">Primary Contact Email:</label>
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
      <div class="text-field">
        <label for="financialcontact">Financial Contact:</label>
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
      <div class="number-field">
        <label for="clientministry">Client/Ministry Number:</label>
        <InputNumber
          v-bind:class="{ 'p-invalid': v$.clientministry.$error }"
          id="clientministry"
          v-model="registration.clientministry"
          :min="100"
          :max="999"
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
      <div class="number-field">
        <label for="respcode">RESP Code:</label>
        <InputNumber
          v-bind:class="{ 'p-invalid': v$.respcode.$error }"
          id="respcode"
          v-model="registration.respcode"
          :min="10000"
          :max="99999"
          aria-placeholder="5 digit number"
          placeholder="5 digit number"
          :useGrouping="false"
        />
        <small v-if="v$.respcode.$error" id="respcode-help" class="p-error"
          >Please enter the 5-digit RESP Code number.</small
        >
      </div>
      <div class="number-field">
        <label for="serviceline">Service Line:</label>
        <InputNumber
          v-bind:class="{ 'p-invalid': v$.serviceline.$error }"
          id="serviceline"
          v-model="registration.serviceline"
          :min="10000"
          :max="99999"
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
      <div class="number-field">
        <label for="stob">STOB:</label>
        <InputNumber
          v-bind:class="{ 'p-invalid': v$.stob.$error }"
          id="stob"
          v-model="registration.stob"
          :min="1000"
          :max="9999"
          aria-placeholder="4 digit number"
          placeholder="4 digit number"
          :useGrouping="false"
        />
        <small v-if="v$.stob.$error" id="stob-help" class="p-error"
          >Please enter the 4-digit STOB number.</small
        >
      </div>
      <div class="number-field">
        <label for="project">Project:</label>
        <InputNumber
          v-bind:class="{ 'p-invalid': v$.project.$error }"
          id="project"
          v-model="registration.project"
          :min="1000000"
          :max="9999999"
          aria-placeholder="7 digit number"
          placeholder="7 digit number"
          :useGrouping="false"
        />
        <small v-if="v$.project.$error" id="project-help" class="p-error"
          >Please enter the 7-digit project number.</small
        >
      </div>

      <Button type="submit" label="primary" class="p-button-raised"
        >Submit</Button
      >
      <Button
        type="reset"
        label="danger"
        class="p-button-raised p-button-danger"
        >Reset</Button
      >
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import formServices from "@/services/settings.services";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
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
      clientministry: { required },
      respcode: { required },
      serviceline: { required },
      stob: { required },
      project: { required },
    };

    const v$ = useVuelidate(rules, registration);

    //registers user if all form fields valid
    const onSubmit = async function (event) {
      event.preventDefault();
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      const userGUID = userStore.getUser.username;
      console.log(userGUID);

      //attaches the creator's username to the registration
      this.registration.registrar =
        this.registration.registrar !== null ||
        this.registration.registrar.length !== 0
          ? this.registration.registrar
          : userGUID.username;

      register
        .registerFinancialInformation(this.registration)
        .then((res) => {
          console.log(res);
          this.$forceUpdate;
          //Perform Success Action
        })
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
        })
        .finally(() => {
          if (props.registrationID) {
            return;
            //router.go();
          } else {
            router.push("/create/registration/");
          }

          //Perform action in always
        });
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

    return { registration, v$, organizations, fillList, onSubmit, onReset };
  },
};
</script>
<style scoped></style>
