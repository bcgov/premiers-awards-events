<script setup>
import InputGuest from "../components/inputs/InputGuest.vue";
// import TableList from "../components/TableList.vue";
import formServices from "../services/settings.services";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "../stores/guests";
import GuestList from "../components/GuestList.vue";

import { useFinancialStore } from "../stores/financial";

const { guests } = storeToRefs(useGuestsStore());
//const guestStore = useGuestsStore();
const columns = ref(formServices.get("guestSelection") || []);

// const guestStore = useGuestsStore();
// const registrationID = useFinancialStore().fill(useGuestsStore().getUser().guid)
//guestStore.fillGuests();
// const guests = guestStore.fillGuests();
</script>

<template>
  <main>
    <InputGuest />
    <GuestList :adminView="false" />
  </main>
</template>
