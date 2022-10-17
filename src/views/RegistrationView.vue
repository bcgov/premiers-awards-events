<script>
import InputFinancial from "../components/inputs/InputFinancial.vue";
import PageHeader from "../components/common/PageHeader.vue";
export default {
  props: {
    id: String,
  },
  components: { InputFinancial, PageHeader },
};
</script>

<template>
  <main>
    <PageHeader :title="`Registration # ${id} `"
      >Please fill out the required financial details for this event. These
      details will be used to charge for the total cost of the tables registered
      for this event.</PageHeader
    >
    <InputFinancial />
  </main>
</template>
