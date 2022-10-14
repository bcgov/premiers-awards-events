<script setup>
import GuestList from "../components/GuestList.vue";
import RegistrationList from "../components/RegistrationList.vue";
import InputFinancial from "../components/inputs/InputFinancial.vue";
import InputGuest from "../components/inputs/InputGuest.vue";
import PageHeader from "../components/common/PageHeader.vue";
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const props = defineProps({ id: String });
const registration = props.id;

const userStore = useAuthUserStore();
userStore.login();
const financialStore = useFinancialStore();

financialStore.fill(registration);

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

const isAdmin = () => {
  return userStore.isAdmin;
};

const toggleRegistration = async () => {
  let submitStatus = isSubmitted() ? false : true;
  financialStore
    .registerFinancialInformation({
      submitted: submitStatus,
      registration,
    })
    .then(() => financialStore.fill(registration));
};

const registrarName = getRegistrar();

const addGuestDialog = ref(false);
const tableInfoDialog = ref(false);
const guestInfoDialog = ref(false);

//Dialog controls
const addGuest = (prod) => {
  addGuestDialog.value = true;
};

const tableInfo = (prod) => {
  tableInfoDialog.value = true;
};

const guestInfo = (prod) => {
  guestInfoDialog.value = true;
};

const hideDialog = () => {
  addGuestDialog.value = false;
};
</script>

<template>
  <main>
    <PageHeader :title="`Registration # ${registration} `"
      >Submitted by {{ getRegistrar() }}</PageHeader
    >
    <RegistrationList :registrationID="registration" :detailsView="false" />
    <Button
      v-if="!isSubmitted()"
      label="Add Guests"
      icon="pi pi-pencil"
      class="p-button-rounded p-button-success mr-2"
      @click="addGuest()"
    />
    <Button
      type="button"
      label="Total Guests"
      icon="pi pi-users"
      class="p-button-warning"
      :badge="guestCount()"
      @click="guestInfo()"
      badgeClass="p-badge-danger"
    />
    <Button
      type="button"
      label="Tables"
      icon="pi pi-ticket"
      class="p-button-warning"
      :badge="tableCount()"
      @click="tableInfo()"
      badgeClass="p-badge-danger"
    />
    <Button
      v-if="!isSubmitted()"
      type="button"
      label="Submit Registration"
      icon="pi pi-ticket"
      class="p-button-warning"
      @click="toggleRegistration()"
      badgeClass="p-badge-danger"
    />
    <Button
      v-if="isSubmitted() && isAdmin()"
      type="button"
      label="Unsubmit Registration"
      icon="pi pi-ticket"
      class="p-button-warning"
      @click="toggleRegistration()"
      badgeClass="p-badge-danger"
    />
    <Dialog
      v-model:visible="tableInfoDialog"
      header="Table Information"
      :modal="true"
      class="p-fluid"
      >Warning regarding table charges. Please be aware that half tables may not
      be able to be accomodated, and you may be charged the full table amount.
      Current table count: {{ tableCount() }}
    </Dialog>

    <Dialog
      v-model:visible="guestInfoDialog"
      header="Guest Information"
      :modal="true"
      class="p-fluid"
      >Total Number of Guests: {{ guestCount() }}.
    </Dialog>

    <Dialog
      v-model:visible="addGuestDialog"
      header="Add a new Guest"
      :modal="true"
      class="p-fluid"
      ><InputGuest :registrationID="registration"
    /></Dialog>
    <GuestList :adminView="false" :registrationID="registration" />
  </main>
</template>
