<script setup>
import InputFinancial from "../components/inputs/InputFinancial.vue";
import PageHeader from "../components/common/PageHeader.vue";

const props = defineProps({ id: String });
const registration = props.id;
</script>

<template>
  <main>
    <PageHeader :title="`Registration # ${registration} `"
      >Please fill out the required financial details for this event. These
      details will be used to charge for the total cost of the tables registered
      for this event.</PageHeader
    >
    <InputFinancial />
  </main>
</template>
