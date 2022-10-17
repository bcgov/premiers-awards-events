<!-- Selector for Tables -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <div v-else>
      <div v-for="each of registrations" :key="each">
        <PrimeCard>
          <template #content><TableDisplay :tables="each.tables" /></template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<script>
import { useFinancialStore } from "../../stores/financial";
import TableDisplay from "../common/TableDisplay.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";

export default {
  setup() {
    const financialStore = useFinancialStore();
    const { registrations } = storeToRefs(useFinancialStore());

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });
    const loading = ref(false);

    //Fill tables datatables with appropriate data based on props
    const fillList = async function () {
      financialStore.$reset;
      loading.value = true;
      try {
        await financialStore.fillAllRegistrations();
        return;
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not fetch registrations.",
        };
      } finally {
        loading.value = false;
        setTimeout(() => (message.value = false), 1500);
      }
    };

    const loadLazyData = () => {
      fillList().then(() => {
        registrations.value.forEach((registration) => {
          registration.tables = computed(() => {
            // const tableContainer = {};
            const tableContainer = [];
            const tableCount = Math.ceil(registration.guests.length / 10);

            for (let i = 0; i < tableCount; i++) {
              // tableContainer[i] = registration.guests.slice(0, 10);
              tableContainer.push(registration.guests.slice(0, 10));
              registration.guests = registration.guests.slice(10);
            }
            return tableContainer;
          });
        });
      });
    };

    onMounted(() => {
      loadLazyData();
    });

    return {
      fillList,
      loadLazyData,
      registrations,
      message,
      loading,
      messageText,
    };
  },
  components: {
    TableDisplay,
  },
};
</script>
<style></style>
