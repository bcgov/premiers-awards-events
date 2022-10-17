<!-- Allows submission of table details -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <form v-else @submit="onSubmit">
      <div class="text-field">
        <label for="tablename">Name of Table:</label>
        <InputText
          id="tablename"
          type="tablename"
          aria-describedby="tablename-help"
          v-model="table.tablename"
          placeholder="Enter Table Name (Leave Blank for Default Next Available Table)"
        />
      </div>
      <div class="dropdown">
        <label for="tabletype">Type of Table:</label>
        <DropDown
          v-bind:class="{ 'p-invalid': v$.tabletype.$error }"
          id="tabletype"
          v-model="table.tabletype"
          :options="tabletypes"
          optionLabel="text"
          optionValue="value"
          placeholder="Select the type of table."
        />
        <small v-if="v$.tabletype.$error" class="p-error" id="tabletype-help"
          >Please select the type of table.</small
        >
      </div>

      <div class="number-field">
        <label for="tablecapacity">Table Capacity:</label>
        <InputText
          v-bind:class="{ 'p-invalid': v$.tablecapacity.$error }"
          id="tablecapacity"
          type="tablecapacity"
          aria-describedby="tablecapacity-help"
          v-model="table.tablecapacity"
          :min="1"
          :max="99"
          aria-placeholder="1-2 digit number"
          placeholder="Required Table Capacity"
          :useGrouping="false"
        />
        <small
          v-if="v$.tablecapacity.$error"
          class="p-error"
          id="tablecapacity-help"
          >Please enter the required table capacity.</small
        >
      </div>

      <PrimeButton type="submit" label="primary" class="p-button-raised"
        >Submit</PrimeButton
      >
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import formServices from "@/services/settings.services";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import { useAuthUserStore } from "../../stores/users";
import { useTablesStore } from "../../stores/tables";

export default {
  props: {
    tableID: String,
    adminView: Boolean,
    detailsView: Boolean,
  },
  setup(props) {
    const userStore = useAuthUserStore();
    const tableStore = useTablesStore();
    const tabletypes = ref(formServices.get("tabletypes") || []);
    const { table } = storeToRefs(useTablesStore());

    //Vuelidate Form Rules
    const rules = {
      tabletype: { required },
      tablecapacity: { required },
    };

    const v$ = useVuelidate(rules, table);

    let loading = ref(false);
    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });

    //registers table if all form fields valid
    const onSubmit = async function (event) {
      event.preventDefault();
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      try {
        loading.value = true;

        tableStore
          .registerTableHandler(this.table)
          .then(() => {
            this.$forceUpdate;
            loading.value = false;
            message.value = true;
            messageText.value = {
              severity: "success",
              text: "Table Updated!",
            };
          })
          .then(() => {
            tableStore.addTable;
          });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Table could not be updated.",
        };
        // error.response.status Check status code
      } finally {
        setTimeout(() => (message.value = false), 1500);
      }
    };

    //fills table state on load of component

    const fillList = async function () {
      const user = userStore.getUser;
      tableStore.$reset;

      if (props.tableID) return await tableStore.fillOnlyTable(props.tableID);
      if (props.adminView) return await tableStore.fillTables();
      else
        return (await tableStore.fillTable(user.guid))
          ? tableStore.fillTable(user.guid)
          : [];
    };

    fillList();

    return {
      loading,
      message,
      messageText,
      table,
      v$,
      tabletypes,
      onSubmit,
    };
  },
};
</script>
<style scoped></style>
